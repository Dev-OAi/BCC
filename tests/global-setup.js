import http from 'http';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.pdf': 'application/pdf',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.json': 'application/json',
  '.woff2': 'font/woff2',
};

export default async () => {
  const server = http.createServer((req, res) => {
    let url = req.url;
    if (url.startsWith('/BCC/')) {
      url = url.substring(5);
    }

    // Default to index.html if the path is a directory
    if (url.endsWith('/')) {
      url += 'index.html';
    }

    let filePath = path.join(__dirname, '..', 'app', url);

    // Security check: ensure the resolved path is within the 'app' directory
    const appDir = path.resolve(__dirname, '..', 'app');
    const resolvedPath = path.resolve(filePath);
    if (!resolvedPath.startsWith(appDir)) {
        res.writeHead(403);
        res.end('Forbidden');
        return;
    }

    fs.readFile(filePath, (err, content) => {
      if (err) {
        if (err.code === 'ENOENT') {
          // If file not found, serve index.html for client-side routing
          fs.readFile(path.join(appDir, 'index.html'), (err2, content2) => {
            if (err2) {
              res.writeHead(500);
              res.end('Server Error');
            } else {
              res.writeHead(200, { 'Content-Type': 'text/html' });
              res.end(content2);
            }
          });
        } else {
          res.writeHead(500);
          res.end('Server Error');
        }
        return;
      }

      const ext = path.extname(filePath);
      const contentType = mimeTypes[ext] || 'application/octet-stream';

      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    });
  });

  await new Promise((resolve) => server.listen(8000, resolve));
  // Adding a small delay to ensure the server is fully ready before tests start.
  await new Promise(resolve => setTimeout(resolve, 100));
  global.server = server;
};
