// Shared content access for build tools. Release rule lives here: in a release
// build only `approved` modules and drugs are loaded, so unreviewed clinical
// content can never reach the shipped output.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
export const ROOT = path.join(here, '..', '..');
export const CONTENT_DIR = path.join(ROOT, 'content');

export const readJson = p => JSON.parse(fs.readFileSync(p, 'utf8'));

export function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(d =>
    d.isDirectory() ? walk(path.join(dir, d.name)) : d.name.endsWith('.json') ? [path.join(dir, d.name)] : []);
}

export function loadAll({ release = false } = {}) {
  const config = readJson(path.join(ROOT, 'app.config.json'));
  const about = readJson(path.join(CONTENT_DIR, 'about.json'));
  const environments = readJson(path.join(CONTENT_DIR, 'environments.json'));
  const index = readJson(path.join(CONTENT_DIR, 'index.json'));
  const keep = x => !release || x.json.status === 'approved';
  const modules = walk(path.join(CONTENT_DIR, 'modules')).map(f => ({ file: f, json: readJson(f) })).filter(keep);
  const drugs = walk(path.join(CONTENT_DIR, 'drugs')).map(f => ({ file: f, json: readJson(f) })).filter(keep);
  const order = new Map(index.modules.map(m => [m.id, m.order]));
  modules.sort((a, b) => (order.get(a.json.id) ?? 1e9) - (order.get(b.json.id) ?? 1e9));
  return { config, about, environments, domains: index.domains, indexModules: index.modules, modules, drugs };
}
