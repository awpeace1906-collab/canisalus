// Zero-dependency static server for dist/. Dev use only.
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { ROOT } from './lib/content.js';

const DIST = join(ROOT, 'dist');
const PORT = process.env.PORT || 5173;
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json',
  '.webmanifest': 'application/manifest+json', '.svg': 'image/svg+xml', '.png': 'image/png' };

createServer(async (req, res) => {
  try {
    let p = normalize(decodeURIComponent(req.url.split('?')[0]));
    if (p.endsWith('/')) p += 'index.html';
    const file = join(DIST, p);
    if (!file.startsWith(DIST)) return void res.writeHead(403).end('forbidden');
    const info = await stat(file).catch(() => null);
    if (!info?.isFile()) return void res.writeHead(404).end('not found');
    res.writeHead(200, { 'content-type': TYPES[extname(file)] || 'application/octet-stream', 'cache-control': 'no-cache' });
    res.end(await readFile(file));
  } catch (e) { res.writeHead(500).end(String(e)); }
}).listen(PORT, () => console.log(`Serving dist/ at http://localhost:${PORT}`));
