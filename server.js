const http = require('http')
const fs = require('fs')
const path = require('path')

const root = path.join(__dirname)
const port = process.env.PORT || 3000

const mime = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
}

const server = http.createServer((req, res) => {
  const requestPath = req.url === '/' ? '/index.html' : req.url
  const filePath = path.join(root, decodeURIComponent(requestPath))

  if (!filePath.startsWith(root)) {
    res.writeHead(403)
    return res.end('Forbidden')
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404)
      return res.end('Not found')
    }

    const ext = path.extname(filePath).toLowerCase()
    const contentType = mime[ext] || 'application/octet-stream'
    res.writeHead(200, { 'Content-Type': contentType })
    fs.createReadStream(filePath).pipe(res)
  })
})

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})
