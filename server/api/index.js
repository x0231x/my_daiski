// server/api/index.js
import * as fs from 'fs';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import createError from 'http-errors';
import express from 'express';
import logger from 'morgan';
import path from 'path';
// 移除 session 相關
// import session from 'express-session';
// import sessionFileStore from 'session-file-store';
import { fileURLToPath, pathToFileURL } from 'url';
import 'dotenv/config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const app = express();

// CORS、logger、body parser、cookieParser、static
app.use(cors({
  origin: (process.env.FRONTEND_URL||'').split(','),
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  credentials: true,
}));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(process.cwd(), 'public')));

// **移除 session entirely**

// 根路由檢查
app.get('/', (req, res) => res.send('Express server is running.'));

// 自動載入 routes
const apiPath   = '/api';
const routePath = path.join(__dirname, '..', 'routes');
const filenames = await fs.promises.readdir(routePath);

for (const filename of filenames) {
  const fullPath = path.join(routePath, filename);
  const stats    = fs.statSync(fullPath);
  if (stats.isFile()) {
    const item = await import(pathToFileURL(fullPath));
    const slug = filename.replace(/\.js$/, '');
    app.use(`${apiPath}/${slug==='index'?'':slug}`, item.default);
  } else if (stats.isDirectory()) {
    const subs = await fs.promises.readdir(fullPath);
    for (const sub of subs) {
      const subFull = path.join(fullPath, sub);
      if (fs.statSync(subFull).isFile()) {
        const item = await import(pathToFileURL(subFull));
        const slug = sub.replace(/\.js$/, '');
        app.use(`${apiPath}/${filename}/${slug==='index'?'':slug}`, item.default);
      }
    }
  }
}

// 404 & error handler
app.use((req, res, next) => next(createError(404)));
app.use((err, req, res) => {
  console.error(err);
  res.status(err.status||500).json({ error: err.message });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server ready on port ${port}.`));

export default app;