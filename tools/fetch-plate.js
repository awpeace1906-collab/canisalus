#!/usr/bin/env node
// Fetch a public-domain plate from Wikimedia Commons into content/assets/figures and register it.
//
//   node tools/fetch-plate.js "File:Example.png" --kind canine --subject "Dog thorax, lateral" \
//        --credit "Plate: <artist>, <book> (<year>). Public domain." --published-year 1910 [--use medical/heat-stroke]
//
// It refuses unless (1) Commons tags the file public domain and (2) you assert a first-publication year of
// 1930 or earlier. It records the sha1 so tools/validate.js can prove the file on disk is the one credited.
import fs from 'node:fs';
import path from 'node:path';
import { CONTENT_DIR } from './lib/content.js';
import { classifyLicense, buildPlateEntry } from './lib/plates.js';

const arg = (name, fallback) => { const i = process.argv.indexOf('--' + name); return i > 0 ? process.argv[i + 1] : fallback; };
const title = process.argv[2];
if (!title || title.startsWith('--')) { console.error('usage: fetch-plate.js "File:Name.png" --kind human|canine --subject "..." --credit "..." --published-year YYYY [--use module-id]'); process.exit(2); }

const kind = arg('kind'), subject = arg('subject'), credit = arg('credit'), year = Number(arg('published-year'));
if (!['human', 'canine'].includes(kind) || !subject || !credit) { console.error('--kind (human|canine), --subject and --credit are required'); process.exit(2); }

const api = new URL('https://commons.wikimedia.org/w/api.php');
api.search = new URLSearchParams({ action: 'query', format: 'json', titles: title, prop: 'imageinfo', iiprop: 'url|extmetadata|mime' }).toString();
const res = await fetch(api, { headers: { 'user-agent': 'canisalus-plate-fetch/1.0 (reference app; contact via repository)' } });
if (!res.ok) { console.error(`Commons API ${res.status}. If this is a network policy denial, the host must be allowed for this environment.`); process.exit(1); }
const page = Object.values((await res.json()).query.pages)[0];
const info = page?.imageinfo?.[0];
if (!info) { console.error(`No such file on Commons: ${title}`); process.exit(1); }

const verdict = classifyLicense(info.extmetadata, { assertedPublicationYear: year });
if (!verdict.ok) { console.error(`REFUSED: ${verdict.reason}`); process.exit(1); }

const img = await fetch(info.url, { headers: { 'user-agent': 'canisalus-plate-fetch/1.0' } });
if (!img.ok) { console.error(`download failed: ${img.status}`); process.exit(1); }
const buf = Buffer.from(await img.arrayBuffer());
const ext = (info.mime.split('/')[1] || 'png').replace('jpeg', 'jpg');
const entry = buildPlateEntry({ title, buf, ext, kind, subject, credit, sourceUrl: `https://commons.wikimedia.org/wiki/${encodeURIComponent(title.replace(/ /g, '_'))}`, plannedUse: arg('use') ? [arg('use')] : [] });

fs.mkdirSync(path.join(CONTENT_DIR, 'assets/figures'), { recursive: true });
fs.writeFileSync(path.join(CONTENT_DIR, entry.src), buf);
const regPath = path.join(CONTENT_DIR, 'plates.json');
const reg = JSON.parse(fs.readFileSync(regPath, 'utf8'));
reg.plates = [...reg.plates.filter(p => p.id !== entry.id), entry].sort((a, b) => a.id.localeCompare(b.id));
fs.writeFileSync(regPath, JSON.stringify(reg, null, 2) + '\n');
console.log(`OK ${entry.id}: ${verdict.reason}\n  sha1 ${entry.sha1}\n  registered in content/plates.json (unattached until a module references it)`);
