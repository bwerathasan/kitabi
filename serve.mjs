/**
 * Fallback static server — serves the built dist/ folder on all interfaces.
 * Use when: npm run mobile
 *
 * Proxies /api to the FastAPI backend at localhost:8000
 */
import http from 'http'
import https from 'https'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import os from 'os'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DIST      = path.join(__dirname, 'dist')
const PORT      = 3000
const API_HOST  = 'localhost'
const API_PORT  = 8000

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js':   'application/javascript',
  '.css':  'text/css',
  '.svg':  'image/svg+xml',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.ico':  'image/x-icon',
  '.json': 'application/json',
  '.woff2':'font/woff2',
  '.woff': 'font/woff',
  '.ttf':  'font/ttf',
}

function getLanIP() {
  for (const ifaces of Object.values(os.networkInterfaces())) {
    for (const iface of ifaces) {
      if (iface.family === 'IPv4' && !iface.internal) return iface.address
    }
  }
  return 'localhost'
}

function proxyToBackend(req, res) {
  const options = {
    hostname: API_HOST,
    port:     API_PORT,
    path:     req.url,
    method:   req.method,
    headers:  req.headers,
  }

  const proxy = http.request(options, (backRes) => {
    res.writeHead(backRes.statusCode, backRes.headers)
    backRes.pipe(res)
  })

  proxy.on('error', () => {
    res.writeHead(502)
    res.end('Bad Gateway — backend not running on port 8000')
  })

  req.pipe(proxy)
}

const server = http.createServer((req, res) => {
  // Proxy API calls
  if (req.url.startsWith('/api')) {
    proxyToBackend(req, res)
    return
  }

  // Static file serving with SPA fallback
  let filePath = path.join(DIST, req.url === '/' ? 'index.html' : req.url)

  if (!fs.existsSync(filePath)) {
    filePath = path.join(DIST, 'index.html')   // SPA fallback
  }

  const ext  = path.extname(filePath)
  const mime = MIME[ext] || 'application/octet-stream'

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404)
      res.end('Not found')
      return
    }
    res.writeHead(200, { 'Content-Type': mime })
    res.end(data)
  })
})

server.listen(PORT, '0.0.0.0', () => {
  const ip = getLanIP()
  console.log('\n')
  console.log('  ┌──────────────────────────────────────────┐')
  console.log(`  │  📱  Mobile URL:  http://${ip}:${PORT}   │`)
  console.log(`  │  💻  Local  URL:  http://localhost:${PORT}  │`)
  console.log('  └──────────────────────────────────────────┘')
  console.log('\n')
})
