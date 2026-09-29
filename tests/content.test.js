import test from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { validateModule, validateFigures, _setFlags } from '../tools/validate.js';

const readJson = p => JSON.parse(fs.readFileSync(new URL(p, import.meta.url)));
const envs = readJson('../content/environments.json');
_setFlags(envs.capability_flags);
const base = () => ({ ...readJson('../content/modules/pathophysiology/blood-groups-and-transfusion.json') });
const sha = b => crypto.createHash('sha1').update(b).digest('hex');
const fig = (o = {}) => ({ id: 'p1', src: 'assets/p1.png', caption: 'c', credit: 'x', license: 'public-domain', sourceUrl: 'https://example.org', sha1: sha('img'), ...o });

test('pathophysiology modules need no lens; clinical modules still do', () => {
  const p = base();
  assert.deepEqual(validateModule(p, envs.tiers, new Set()).errs, []);
  const clinical = { ...p, kind: 'clinical' };
  assert.ok(validateModule(clinical, envs.tiers, new Set()).errs.some(e => e.startsWith('lens missing tier')));
});

test('compare rows: source_refs must point at real sources', () => {
  const m = base(); m.compare[0] = { ...m.compare[0], source_refs: [99] };
  assert.ok(validateModule(m, envs.tiers, new Set()).errs.some(e => e.includes('source_ref 99')));
});

test('compare rows may not smuggle in dose-like figures', () => {
  const m = base(); m.compare[0] = { ...m.compare[0], implication: 'Give 0.5 mg/kg IV' };
  assert.ok(validateModule(m, envs.tiers, new Set()).errs.some(e => e.includes('dose-like')));
});

test('approved gating: compare rows need sources, and a TODO anywhere blocks approval', () => {
  const m = base();
  m.status = 'approved'; m.last_verified = '2026-09-01';
  m.signoff = { vet: { name: 'a', credential: 'DVM', date: '2026-09-01' }, physician: { name: 'b', credential: 'MD', date: '2026-09-01' } };
  m.compare[0] = { ...m.compare[0], source_refs: [] };
  assert.ok(validateModule(m, envs.tiers, new Set()).errs.some(e => e.includes('no source_refs')));
  const hemo = readJson('../content/modules/trauma/hemorrhage-control.json');
  const a = { ...hemo, status: 'approved', last_verified: '2026-09-01', signoff: m.signoff };
  assert.ok(validateModule(a, envs.tiers, new Set()).errs.includes('approved but contains TODO'), 'TODO items must block approval');
});

test('figures: must exist, match sha1, and be public domain', () => {
  const ok = validateFigures({ figures: [fig()] }, '/x', () => Buffer.from('img'));
  assert.deepEqual(ok, []);
  assert.ok(validateFigures({ figures: [fig()] }, '/x', () => { throw new Error('nope'); })[0].includes('does not exist'));
  assert.ok(validateFigures({ figures: [fig()] }, '/x', () => Buffer.from('other'))[0].includes('not the one credited'));
  assert.ok(validateFigures({ figures: [fig({ license: 'cc-by-sa' })] }, '/x', () => Buffer.from('img')).some(e => e.includes("must be 'public-domain'")));
  assert.ok(validateFigures({ figures: [fig({ src: '../../etc/passwd' })] }, '/x', () => Buffer.from('img')).some(e => e.includes('escapes')));
});

test('gen_stubs refuses to overwrite modules that are past stub', () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'gen-'));
  fs.cpSync(new URL('../content', import.meta.url), path.join(tmp, 'content'), { recursive: true });
  fs.cpSync(new URL('../tools', import.meta.url), path.join(tmp, 'tools'), { recursive: true });
  let failed = false, out = '';
  try { execFileSync('python3', ['tools/gen_stubs.py'], { cwd: tmp, encoding: 'utf8', stdio: 'pipe' }); }
  catch (e) { failed = true; out = e.stdout; }
  assert.ok(failed && out.includes('refusing to overwrite'), 'expected refusal; got: ' + out);
});

test('sources: search and retrieval links warn on drafts and block approval', () => {
  const m = base();
  m.sources = [{ rank: 3, citation: 'x', url: 'https://consensus.app/papers/details/abc/' }];
  m.compare = m.compare.map(r => ({ ...r, source_refs: [1] }));
  assert.ok(validateModule(m, envs.tiers, new Set()).warns.some(w => w.includes('search or retrieval link')));
  m.sources = [{ rank: 3, citation: 'x', url: 'https://pubmed.ncbi.nlm.nih.gov/?term=abc' }];
  assert.ok(validateModule(m, envs.tiers, new Set()).warns.some(w => w.includes('search or retrieval link')), 'pubmed search links count as unresolved');
  const a = { ...m, status: 'approved', last_verified: '2026-09-01', signoff: { vet: { name: 'a', credential: 'DVM', date: '2026-09-01' }, physician: { name: 'b', credential: 'MD', date: '2026-09-01' } } };
  assert.ok(validateModule(a, envs.tiers, new Set()).errs.some(e => e.includes('search or retrieval link')));
});

import { validatePlates } from '../tools/validate.js';
import { classifyLicense, imageSize, buildPlateEntry, sha1 } from '../tools/lib/plates.js';

test('plate registry in the repo is valid (files exist, checksums match)', () => {
  const reg = readJson('../content/plates.json');
  assert.ok(reg.plates.length >= 6);
  assert.deepEqual(validatePlates(reg, new URL('../content', import.meta.url).pathname), []);
});

test('plate registry catches a swapped file and duplicate ids', () => {
  const p = { id: 'a', src: 'assets/a.png', kind: 'human', subject: 's', credit: 'c', license: 'public-domain', sourceUrl: 'u', sha1: sha1(Buffer.from('x')) };
  assert.ok(validatePlates({ plates: [p] }, '/x', () => Buffer.from('y'))[0].includes('not the one credited'));
  assert.ok(validatePlates({ plates: [p, p] }, '/x', () => Buffer.from('x')).some(e => e.includes('duplicate id')));
});

test('licence gate: public domain tag AND an asserted year of 1930 or earlier are both required', () => {
  const pd = { LicenseShortName: { value: 'Public domain' } };
  assert.equal(classifyLicense(pd, { assertedPublicationYear: 1910 }).ok, true);
  assert.equal(classifyLicense(pd, {}).ok, false, 'no asserted year');
  assert.equal(classifyLicense(pd, { assertedPublicationYear: 1955 }).ok, false, 'too recent');
  assert.equal(classifyLicense({ LicenseShortName: { value: 'CC BY-SA 4.0' } }, { assertedPublicationYear: 1900 }).ok, false, 'share-alike rejected');
  assert.equal(classifyLicense({ LicenseShortName: { value: 'PD-old-70' } }, { assertedPublicationYear: 1920 }).ok, true);
  assert.equal(classifyLicense({}, { assertedPublicationYear: 1920 }).ok, false, 'unknown licence');
});

test('image size and plate entry from real bytes', () => {
  const buf = fs.readFileSync(new URL('../content/assets/figures/gray1195.png', import.meta.url));
  assert.deepEqual(imageSize(buf), { width: 531, height: 500 });
  const e = buildPlateEntry({ title: 'File:Test Dog 1.png', buf, ext: 'png', kind: 'canine', subject: 's', credit: 'c', sourceUrl: 'u' });
  assert.equal(e.id, 'test-dog-1'); assert.equal(e.sha1, sha1(buf)); assert.equal(e.license, 'public-domain');
});
