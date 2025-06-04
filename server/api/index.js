// server/api/index.js

import * as fs from 'fs';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import createError from 'http-errors';
import express from 'express';
import logger from 'morgan';
import path from 'path';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { pathToFileURL, fileURLToPath } from 'url';

import 'dotenv/config.js';

// --- Prisma Client 和 MessageType ---
import { PrismaClient, MessageType } from '@prisma/client';
const prisma = new PrismaClient();

// 建立 Express 應用程式
const app = express();
// 使用 Express app 建立 HTTP 伺服器 (供 Socket.IO 使用)
const server = http.createServer(app);

// CORS 設定
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
const whiteList   = frontendUrl.split(',');
app.use(
  cors({
    origin:      whiteList,
    methods:     ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
  })
);

// 記錄 HTTP 請求
app.use(logger('dev'));
// 解析 JSON、URL-encoded
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// 解析 Cookie
app.use(cookieParser());
// 提供靜態檔案（public 資料夾）
app.use(express.static(path.join(process.cwd(), 'public')));

// ===== 完全移除 Session 相關程式碼（不再使用 express-session） =====

// ===== Socket.IO 初始化 =====
const io = new SocketIOServer(server, {
  cors: {
    origin:      whiteList,
    methods:     ['GET', 'POST'],
    credentials: true,
  },
});

io.on('connection', (socket) => {
  console.log('使用者透過 Socket.IO 連線:', socket.id);

  socket.on('joinGroupChat', async (groupIdString, userId) => {
    const numericGroupId = parseInt(groupIdString, 10);
    const numericUserId  = typeof userId === 'string'
      ? parseInt(userId, 10)
      : userId;

    if (
      isNaN(numericGroupId) ||
      (userId !== undefined && isNaN(numericUserId))
    ) {
      console.error(
        `[Socket Server] joinGroupChat: 無效的 groupId (${groupIdString}) 或 userId (${userId})`
      );
      socket.emit('joinRoomError', {
        groupId: groupIdString,
        message: '無效的群組或使用者 ID',
      });
      return;
    }
    console.log(
      `[Socket Server] 使用者 ${numericUserId || '未知'} (Socket ${socket.id}) 請求加入群組 ${numericGroupId} 的聊天室`
    );

    try {
      await prisma.chatRoom.upsert({
        where:  { groupId: numericGroupId },
        update: {},
        create: { groupId: numericGroupId },
      });
      console.log(
        `[Socket Server] 已確認/創建群組 ${numericGroupId} 的 ChatRoom`
      );

      socket.join(groupIdString);
      console.log(
        `[Socket Server] Socket ${socket.id} 已加入房間 ${groupIdString}`
      );
      socket.emit('joinedRoomSuccess', {
        groupId: groupIdString,
        message: `成功加入群組 ${groupIdString} 的聊天室`,
      });
    } catch (error) {
      console.error(
        `[Socket Server] 加入房間 ${groupIdString} 或確認/創建 ChatRoom 時發生錯誤:`,
        error
      );
      socket.emit('joinRoomError', {
        groupId: groupIdString,
        message: '準備聊天室時發生錯誤',
      });
    }
  });

  socket.on('sendMessage', async (msg, targetGroupIdString) => {
    console.log(`--- [Socket Server] 收到 'sendMessage' 事件 ---`);
    console.log(
      `[Socket Server] Target Group ID (原始): ${targetGroupIdString}`
    );
    console.log(
      `[Socket Server] Message Data (原始): ${JSON.stringify(msg, null, 2)}`
    );

    const clientUserId         = msg.user?.id;
    const content              = msg.type === 'text' ? msg.content : msg.imageUrl;
    const messageTypeFromClient = msg.type?.toUpperCase();

    if (!clientUserId || !content || !targetGroupIdString) {
      console.error(
        '[Socket Server] sendMessage 中止：缺少 clientUserId、content 或 targetGroupIdString'
      );
      socket.emit('sendMessageError', {
        groupId: targetGroupIdString,
        message: '訊息格式不完整或目標群組未指定',
      });
      return;
    }

    const targetGroupId = parseInt(targetGroupIdString, 10);
    if (isNaN(targetGroupId)) {
      console.error(
        `[Socket Server] sendMessage 中止：targetGroupId 檔位 NaN，來自 ${targetGroupIdString}`
      );
      socket.emit('sendMessageError', {
        groupId: targetGroupIdString,
        message: '目標群組 ID 格式不正確',
      });
      return;
    }

    const numericUserId = typeof clientUserId === 'string'
      ? parseInt(clientUserId, 10)
      : clientUserId;
    if (isNaN(numericUserId)) {
      console.error(
        `[Socket Server] sendMessage 中止：clientUserId 檔位 NaN，來自 ${clientUserId}`
      );
      socket.emit('sendMessageError', {
        groupId: targetGroupIdString,
        message: '使用者 ID 格式不正確',
      });
      return;
    }

    let prismaMessageType;
    if (messageTypeFromClient === 'IMAGE') {
      prismaMessageType = MessageType.IMAGE;
    } else if (messageTypeFromClient === 'TEXT') {
      prismaMessageType = MessageType.TEXT;
    } else {
      console.error(
        `[Socket Server] sendMessage 中止：不合法的訊息類型，來自 ${messageTypeFromClient}`
      );
      socket.emit('sendMessageError', {
        groupId: targetGroupIdString,
        message: '無效的訊息類型',
      });
      return;
    }

    try {
      const chatRoomExists = await prisma.chatRoom.findUnique({
        where: { groupId: targetGroupId },
      });
      if (!chatRoomExists) {
        console.error(
          `[Socket Server] sendMessage 中止：群組 ${targetGroupId} 的 ChatRoom 不存在，將嘗試創建`
        );
        await prisma.chatRoom.create({ data: { groupId: targetGroupId } });
        console.log(
          `[Socket Server] 已為群組 ${targetGroupId} 創建 ChatRoom`
        );
      }

      console.log(
        `[Socket Server] 嘗試將訊息儲存到資料庫：群組 ${targetGroupId}, 使用者 ${numericUserId}`
      );
      const savedMessage = await prisma.chatMessage.create({
        data: {
          groupId:     targetGroupId,
          userId:      numericUserId,
          content:     content,
          messageType: prismaMessageType,
        },
        include: { user: { select: { id: true, name: true, avatar: true } } },
      });
      console.log(
        `[Socket Server] 訊息已儲存，ID: ${savedMessage.id}, 群組: ${savedMessage.groupId}`
      );

      await prisma.chatRoom.update({
        where: { groupId: targetGroupId },
        data:  { lastMessageAt: savedMessage.sentAt },
      });
      console.log(
        `[Socket Server] 已更新 ChatRoom ${targetGroupId} 的 lastMessageAt`
      );

      const messageToBroadcast = {
        id:      savedMessage.id,
        user:    savedMessage.user,
        type:    savedMessage.messageType === MessageType.IMAGE ? 'image' : 'text',
        content: savedMessage.messageType === MessageType.TEXT
          ? savedMessage.content
          : undefined,
        imageUrl: savedMessage.messageType === MessageType.IMAGE
          ? savedMessage.content
          : undefined,
        time:    savedMessage.sentAt.getTime(),
        groupId: savedMessage.groupId.toString(),
      };

      io.to(targetGroupId.toString()).emit('chatMessage', messageToBroadcast);
      console.log(
        `[Socket Server] 已廣播 'chatMessage' 給房間 ${targetGroupId}: ${JSON.stringify(
          messageToBroadcast,
          null,
          2
        )}`
      );
    } catch (error) {
      console.error(
        `[Socket Server] !!! 儲存或廣播訊息至群組 ${targetGroupId} 時發生錯誤：`,
        error
      );
      socket.emit('sendMessageError', {
        groupId:      targetGroupIdString,
        message:      '伺服器處理您的訊息時發生嚴重錯誤',
        errorDetails: error.message,
      });
    }
  });

  socket.on('disconnect', () => {
    console.log('使用者已離線:', socket.id);
  });
});

// 根路由測試
app.get('/', (req, res) => res.send('Express server is running.'));

// --- 載入 routes 資料夾裡的所有路由，並套用到 /api ---
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

// 正確指向 server/routes
const routePath = path.join(__dirname, '..', 'routes');
const filenames = await fs.promises.readdir(routePath);

for (const filename of filenames) {
  const fullPath = path.join(routePath, filename);
  const stats    = fs.statSync(fullPath);

  // 如果是單一檔案 (xxx.js)
  if (stats.isFile()) {
    const item = await import(pathToFileURL(fullPath));
    const slug = filename.replace(/\.js$/, '');
    app.use(`/api/${slug === 'index' ? '' : slug}`, item.default);
  }

  // 如果是資料夾 (xxx/xxx.js)
  if (stats.isDirectory()) {
    const subFiles = await fs.promises.readdir(fullPath);
    for (const subFilename of subFiles) {
      const subFull = path.join(fullPath, subFilename);
      if (fs.statSync(subFull).isFile()) {
        const item = await import(pathToFileURL(subFull));
        const slug = subFilename.replace(/\.js$/, '');
        app.use(
          `/api/${filename}/${slug === 'index' ? '' : slug}`,
          item.default
        );
      }
    }
  }
}

// 捕獲 404
app.use((req, res, next) => next(createError(404)));

// 錯誤處理
app.use((err, req, res) => {
  res.locals.message = err.message;
  res.locals.error   = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500).send({ error: err.message });
});

// --- 啟動伺服器 (含 Socket.IO) ---
const port = process.env.PORT || 3005;
server.listen(port, () => {
  console.log(`API 伺服器 (含 Socket.IO) 正在 http://localhost:${port} 上運行`);
});

export default app;
