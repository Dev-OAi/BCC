const http = require('http');
const path = require('path');
const fs = require('fs');

const mimeTypes = {
    '.html': 'text/html',
    '.js': 'application/javascript',
    '.css': 'text/css',
    '.pdf': 'application/pdf',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
};

module.exports = async () => {
    const server = http.createServer((req, res) => {
        let url = req.url;
        if (url.startsWith('/BCC/')) {
            url = url.substring(5);
        }
        let filePath = path.join(__dirname, '..', 'app', url === '/' ? 'index.html' : url);

        fs.readFile(filePath, (err, content) => {
            if (err) {
                res.writeHead(404);
                res.end('File not found');
                return;
            }

            const ext = path.extname(filePath);
            const contentType = mimeTypes[ext] || 'application/octet-stream';

            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content);
        });
    });

    await new Promise(resolve => server.listen(8000, resolve));
    global.server = server;
};
