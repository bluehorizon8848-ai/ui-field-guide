/**
 * 本地静态导出预览服务器。
 *
 * 为什么不用 `python -m http.server`：
 * 1. 它不会把 404 回退到 404.html（Cloudflare Pages / Netlify 会）
 * 2. 它对无尾斜杠路径的重定向处理和真实托管不一致
 *
 * 行为对齐主流静态托管：
 * - 目录请求补尾斜杠后 301 到 index.html
 * - 找不到资源时用 404.html 兜底并保留 404 状态码
 *
 * 用法：node scripts/serve-export.mjs [port]
 */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve('out');
const PORT = Number(process.argv[2] ?? process.env.PORT ?? 3111);

if (!fs.existsSync(ROOT)) {
  console.error('out/ 不存在，请先跑 npm run build');
  process.exit(1);
}

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.woff2': 'font/woff2',
};

const notFoundPage = path.join(ROOT, '404.html');
const hasNotFound = fs.existsSync(notFoundPage);

const send = (res, status, filePath) => {
  const ext = path.extname(filePath).toLowerCase();
  res.writeHead(status, {
    'Content-Type': MIME[ext] ?? 'application/octet-stream',
    'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=31536000, immutable',
  });
  fs.createReadStream(filePath).pipe(res);
};

http
  .createServer((req, res) => {
    const url = new URL(req.url, `http://localhost:${PORT}`);
    let pathname = decodeURIComponent(url.pathname);

    // 防目录穿越
    const target = path.join(ROOT, pathname);
    if (!target.startsWith(ROOT)) {
      res.writeHead(403).end('Forbidden');
      return;
    }

    // 无尾斜杠的目录 → 301 补斜杠（与 Cloudflare Pages 一致）
    if (fs.existsSync(target) && fs.statSync(target).isDirectory() && !pathname.endsWith('/')) {
      res.writeHead(301, { Location: `${pathname}/${url.search}` }).end();
      return;
    }

    if (fs.existsSync(target) && fs.statSync(target).isFile()) {
      send(res, 200, target);
      return;
    }

    const indexFile = path.join(target, 'index.html');
    if (fs.existsSync(indexFile)) {
      send(res, 200, indexFile);
      return;
    }

    if (hasNotFound) {
      send(res, 404, notFoundPage);
      return;
    }

    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }).end('404');
  })
  .listen(PORT, '127.0.0.1', () => {
    console.log(`静态导出预览：http://127.0.0.1:${PORT}`);
    console.log(`根目录：${ROOT}`);
  });
