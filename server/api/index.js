import * as fs from 'fs';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import createError from 'http-errors';
import express from 'express';
import logger from 'morgan';
import path from 'path';
import session from 'express-session';
// 移除 Redis 相關
// import RedisStore from 'connect-redis';
// import { createClient } from 'redis';
import sessionFileStore from 'session-file-store';
import { serverConfig } from '../config/server.config.js';
import { pathToFileURL,fileURLToPath} from 'url';
import 'dotenv/config.js';


const app = express();

// CORS、logger、body-parser……(同原本)

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(process.cwd(), 'public')));

// 只用檔案 Session Store
const FileStore = sessionFileStore(session);
const sessionStore = new FileStore({ logFn: function () {} });

const isDev = process.env.NODE_ENV === 'development';
const options = isDev
  ? { maxAge: 30 * 86400000 }
  : {
      domain: serverConfig.domain,
      maxAge: 30 * 86400000,
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    };

if (!isDev) app.set('trust proxy', 1);

app.use(
  session({
    store: sessionStore,
    name: 'SESSION_ID',
    secret: '67f71af4602195de2450faeb6f8856c0',
    proxy: !isDev,
    cookie: options,
    resave: false,
    saveUninitialized: false,
  })
);

// 根路由測試
app.get('/', (req, res) => res.send('Express server is running.'));

// 路由自動載入 (改用 __dirname 保證路徑正確)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const apiPath = '/api';
const routePath = path.join(__dirname, '..', 'routes');

const filenames = await fs.promises.readdir(routePath);
for (const filename of filenames) {
  const fullPath = path.join(routePath, filename);
  const stats = fs.statSync(fullPath);
  if (stats.isFile()) {
    const item = await import(pathToFileURL(fullPath));
    const slug = filename.replace(/\.js$/, '');
    app.use(`${apiPath}/${slug === 'index' ? '' : slug}`, item.default);
  } else if (stats.isDirectory()) {
    const subFiles = await fs.promises.readdir(fullPath);
    for (const sub of subFiles) {
      const subFull = path.join(fullPath, sub);
      if (fs.statSync(subFull).isFile()) {
        const item = await import(pathToFileURL(subFull));
        const slug = sub.replace(/\.js$/, '');
        app.use(
          `${apiPath}/${filename}/${slug === 'index' ? '' : slug}`,
          item.default
        );
      }
    }
  }
}

// 404 & Error handler
app.use((req, res, next) => next(createError(404)));
app.use((err, req, res) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server ready on port ${port}.`));

export default app;