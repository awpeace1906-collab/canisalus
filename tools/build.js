#!/usr/bin/env node
// Assembles dist/ from the app shell + content. `--release` ships approved content only.
//   dist/index.html, sw.js, styles.css, src/, engine/, public/   (copied)
//   dist/manifest.webmanifest                                    (generated from app.config.json)
//   dist/content/...                                             (filtered copy + generated manifest/search index)
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { pathToFileURL } from 'node:url';
import { ROOT, CONTENT_DIR, loadAll, walk } from './lib/content.js';

const sha = s => crypto.createHash('sha1').update(s).digest('hex');
const w = (p, s) => { fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, s); };
const rel = (from, f) => path.relative(from, f).split(path.sep).join('/');

export function buildSearchIndex(modules, domains) {
  const label = Object.fromEntries(domains.map(d => [d.id, d.label]));
  return modules.map(({ json: m }) => ({
    id: m.id, title: m.title, domain: m.domain, domainLabel: label[m.domain] ?? m.domain,
    reversible: m.reversible, status: m.status,
    keywords: [...new Set(m.what_changes_from_human.map(x => x.point))],
    summary: m.why_this_matters, route: `/module/${m.id}`,
  })).sort((a, b) => (a.domainLabel + a.title).localeCompare(b.domainLabel + b.title));
}

export function buildManifest(modules, drugs, release) {
  const entries = list => Object.fromEntries(list.map(({ file, json }) =>
    [json.id, { hash: sha(JSON.stringify(json)), path: rel(CONTENT_DIR, file), status: json.status }]));
  return { schemaVersion: 1, release, modules: entries(modules), drugs: entries(drugs) };
}

export function build({ release = false, out = path.join(ROOT, 'dist') } = {}) {
  const all = loadAll({ release });
  fs.rmSync(out, { recursive: true, force: true });
  for (const name of ['src', 'engine', 'public']) fs.cpSync(path.join(ROOT, name), path.join(out, name), { recursive: true });
  for (const name of ['styles.css']) fs.copyFileSync(path.join(ROOT, name), path.join(out, name));

  // content: filtered copy
  const c = p => path.join(out, 'content', p);
  w(c('app.config.json'), JSON.stringify(all.config, null, 2));
  w(c('about.json'), JSON.stringify(all.about, null, 2));
  w(c('environments.json'), JSON.stringify(all.environments, null, 2));
  const present = new Set(all.modules.map(m => m.json.id));
  w(c('index.json'), JSON.stringify({ domains: all.domains, modules: all.indexModules.filter(m => present.has(m.id)) }, null, 2));
  for (const { file, json } of [...all.modules, ...all.drugs]) w(c(rel(CONTENT_DIR, file)), JSON.stringify(json, null, 2));
  for (const { json } of all.modules) for (const f of json.figures ?? []) {
    const from = path.join(CONTENT_DIR, f.src);
    if (fs.existsSync(from)) { fs.mkdirSync(path.dirname(c(f.src)), { recursive: true }); fs.copyFileSync(from, c(f.src)); }
  }
  w(c('search-index.json'), JSON.stringify({ entries: buildSearchIndex(all.modules, all.domains) }, null, 2));
  w(c('manifest.json'), JSON.stringify(buildManifest(all.modules, all.drugs, release), null, 2));

  // The name comes from app.config.json, never from source files.
  const { name, short_name, store_title } = all.config;
  w(path.join(out, 'manifest.webmanifest'), JSON.stringify({
    name: store_title, short_name, start_url: './', scope: './', display: 'standalone', orientation: 'portrait',
    background_color: '#f4f3ee', theme_color: '#12343b',
    icons: [{ src: './public/icons/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any maskable' }],
  }, null, 2));
  const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8').replaceAll('%APP_TITLE%', store_title).replaceAll('%APP_NAME%', name);
  w(path.join(out, 'index.html'), html);

  // Service worker: inject the exact precache list and a version derived from it.
  const files = walk0(out).filter(f => f !== 'sw.js' && !f.startsWith('content/')).map(f => './' + f);
  const contentFiles = walk0(path.join(out, 'content')).map(f => './content/' + f);
  const version = sha(files.concat(contentFiles).map(f => f + sha(fs.readFileSync(path.join(out, f)))).join('')).slice(0, 10);
  const sw = fs.readFileSync(path.join(ROOT, 'sw.js'), 'utf8')
    .replace('/*__SHELL__*/[]', JSON.stringify(['./', ...files, ...contentFiles], null, 2))
    .replace('__VERSION__', version);
  w(path.join(out, 'sw.js'), sw);

  return { out, modules: all.modules.length, drugs: all.drugs.length, release };
}

function walk0(dir) {
  return fs.readdirSync(dir, { recursive: true, withFileTypes: true })
    .filter(d => d.isFile()).map(d => rel(dir, path.join(d.parentPath, d.name))).sort();
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const r = build({ release: process.argv.includes('--release') });
  console.log(`built dist/ (${r.release ? 'RELEASE' : 'dev'}): ${r.modules} modules, ${r.drugs} drugs`);
  if (r.release && r.modules === 0) console.log('note: no approved modules yet, so the release build contains no clinical content');
}
