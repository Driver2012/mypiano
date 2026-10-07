/* 识谱小达人 · 本地预览服务器
 * 用途：在自己的电脑上先跑起来看效果（localhost 属于"安全上下文"，
 *      浏览器允许在 localhost 上安装 PWA 和运行 Service Worker）。
 *
 * 用法：
 *   node serve.js            # 默认 http://localhost:8080
 *   PORT=9000 node serve.js  # 换端口
 *
 * 注意：这是给"本机测试"用的。要让华为平板安装，需要把 pwa/ 整个目录
 *      放到一个 https 网址上（例如 GitHub Pages），详见 README.md。
 */
const http = require('http');
const fs = require('fs');
const path = require('path');

const root = __dirname;
const port = process.env.PORT || 8080;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8'
};

http.createServer((req, res) => {
  let urlPath = decodeURIComponent((req.url || '/').split('?')[0]);
  if (urlPath === '/') urlPath = '/index.html';

  const filePath = path.join(root, urlPath);
  // 防目录穿越
  if (!filePath.startsWith(root)) {
    res.writeHead(403);
    return res.end('403 Forbidden');
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      return res.end('404 Not Found');
    }
    const type = MIME[path.extname(filePath).toLowerCase()] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': type });
    res.end(data);
  });
}).listen(port, () => {
  console.log('识谱小达人 PWA 预览服务器已启动：');
  console.log('  http://localhost:' + port);
  console.log('按 Ctrl+C 停止。');
});
