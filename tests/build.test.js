import test from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { build } from '../tools/build.js';
import { overdue } from '../tools/check-staleness.js';

const tmp = () => fs.mkdtempSync(path.join(os.tmpdir(), 'canisalus-'));

test('release build ships NO unapproved modules or drugs (stubs only in this repo)', () => {
  const out = tmp();
  const r = build({ release: true, out });
  assert.equal(r.modules, 0); assert.equal(r.drugs, 0);
  const manifest = JSON.parse(fs.readFileSync(path.join(out, 'content/manifest.json')));
  assert.deepEqual(manifest.modules, {}); assert.equal(manifest.release, true);
  assert.equal(fs.existsSync(path.join(out, 'content/modules')), false);
  assert.equal(fs.existsSync(path.join(out, 'content/drugs')), false);
  // no draft text leaks anywhere in the shipped tree
  const all = fs.readdirSync(out, { recursive: true, withFileTypes: true }).filter(d => d.isFile());
  for (const f of all) assert.ok(!fs.readFileSync(path.join(f.parentPath, f.name), 'utf8').includes('gastric-dilatation-volvulus'), `draft leaked in ${f.name}`);
});

test('dev build includes drafts; app name comes from app.config.json', () => {
  const out = tmp();
  const r = build({ release: false, out });
  const onDisk = fs.readdirSync(new URL('../content/modules', import.meta.url), { recursive: true }).filter(f => f.endsWith('.json')).length;
  assert.equal(r.modules, onDisk); assert.ok(onDisk >= 80); assert.equal(r.drugs, 1);
  const cfg = JSON.parse(fs.readFileSync(new URL('../app.config.json', import.meta.url)));
  const wm = JSON.parse(fs.readFileSync(path.join(out, 'manifest.webmanifest')));
  assert.equal(wm.name, cfg.store_title); assert.equal(wm.short_name, cfg.short_name);
  assert.ok(fs.readFileSync(path.join(out, 'index.html'), 'utf8').includes(`<title>${cfg.store_title}</title>`));
});

test('service worker precache list is injected and covers every shipped file', () => {
  const out = tmp();
  build({ release: false, out });
  const sw = fs.readFileSync(path.join(out, 'sw.js'), 'utf8');
  assert.ok(!sw.includes('__VERSION__') && !sw.includes('__SHELL__'));
  const list = JSON.parse(sw.match(/const PRECACHE = (\[[\s\S]*?\]);/)[1]);
  for (const f of ['./src/main.js', './styles.css', './engine/dose.js', './content/manifest.json', './content/search-index.json', './content/modules/medical/gastric-dilatation-volvulus.json'])
    assert.ok(list.includes(f), `${f} not precached`);
});

test('no source file hardcodes the app name (identifiers like storage keys are fine)', () => {
  const name = JSON.parse(fs.readFileSync(new URL('../app.config.json', import.meta.url))).name.toLowerCase();
  const roots = ['../src', '../sw.js', '../index.html'];
  const files = roots.flatMap(r => {
    const p = new URL(r, import.meta.url);
    return fs.statSync(p).isDirectory() ? fs.readdirSync(p, { recursive: true, withFileTypes: true }).filter(d => d.isFile()).map(d => path.join(d.parentPath, d.name)) : [p.pathname];
  });
  for (const f of files) {
    const text = fs.readFileSync(f, 'utf8').toLowerCase()
      .replace(new RegExp(`${name}[.:_-][a-z0-9.-]*`, 'g'), '')   // storage keys, event and cache names
      .replace(/awpeace1906-collab\/\w+/g, '');                  // repo slug
    assert.ok(!text.includes(name), `${f} hardcodes the app name`);
  }
});

test('staleness tripwire flags approved modules past interval or unverified, ignores drafts', () => {
  const today = new Date('2026-09-29');
  const mods = [
    { id: 'a', status: 'approved', last_verified: '2024-01-01', review_interval_months: 12 },
    { id: 'b', status: 'approved', last_verified: '2026-08-01', review_interval_months: 12 },
    { id: 'c', status: 'draft', last_verified: null, review_interval_months: 12 },
    { id: 'd', status: 'approved', last_verified: null, review_interval_months: 12 },
  ];
  assert.deepEqual(overdue(mods, today).map(x => x.id), ['a', 'd']);
});
