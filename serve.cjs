const http = require('http');
const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, 'dist');
const PORT = 3000;

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

const server = http.createServer((req, res) => {
  // Strip /stdqs prefix from request URL
  let url = req.url;
  if (url.startsWith('/stdqs/')) {
    url = url.substring(6); // remove '/stdqs'
  }
  let filePath = path.join(distDir, url === '/' ? '/index.html' : url);
  
  // Serve index.html for any non-file route (SPA fallback)
  if (!path.extname(filePath)) {
    filePath = path.join(distDir, 'index.html');
  }

  const ext = path.extname(filePath);
  const contentType = mimeTypes[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        // SPA fallback
        fs.readFile(path.join(distDir, 'index.html'), (err2, content2) => {
          if (err2) {
            res.writeHead(404);
            res.end('Not Found');
          } else {
            // Remove AMap scripts to prevent blocking
            let html = content2.toString().replace(/<script[\s\S]*?webapi\.amap\.com[\s\S]*?<\/script>/g, '');
            html = html.replace(/<script>[\s\S]*?_AMapSecurityConfig[\s\S]*?<\/script>/g, '');
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(html);
          }
        });
      } else {
        res.writeHead(500);
        res.end('Server Error');
      }
    } else {
      if (ext === '.html') {
        // Remove AMap scripts to prevent blocking
        let html = content.toString().replace(/<script[\s\S]*?webapi\.amap\.com[\s\S]*?<\/script>/g, '');
        html = html.replace(/<script>[\s\S]*?_AMapSecurityConfig[\s\S]*?<\/script>/g, '');
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(html);
      } else {
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content);
      }
    }
  });
});

server.listen(PORT, () => {
  console.log(`Static server running at http://localhost:${PORT}/`);
});
