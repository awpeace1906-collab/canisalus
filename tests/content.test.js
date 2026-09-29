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
