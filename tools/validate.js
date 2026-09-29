#!/usr/bin/env node
// Content validator. Enforces guardrails that JSON Schema alone can't.
// Usage: node tools/validate.js [--release]   (--release: fail if any module/drug isn't approved)
import fs from 'node:fs';
import crypto from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';
const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(here, '..', 'content');

function walk(dir) { return fs.readdirSync(dir, { withFileTypes: true }).flatMap(d => d.isDirectory() ? walk(path.join(dir, d.name)) : d.name.endsWith('.json') ? [path.join(dir, d.name)] : []); }

function monthsBetween(a, b) { return (b.getFullYear() - a.getFullYear()) * 12 + (b.getMonth() - a.getMonth()); }

export function validateModule(m, tiers, drugIds, today = new Date()) {
  const errs = [], warns = [];
  const clinical = (m.kind ?? 'clinical') === 'clinical';
  const required = tiers.filter(t => !t.optional).map(t => t.id);
  if (clinical) for (const t of required) if (!m.lens || !m.lens[t]) errs.push(`lens missing tier '${t}'`);
  for (const [t, e] of Object.entries(m.lens || {})) {
    if (!tiers.find(x => x.id === t)) errs.push(`lens has unknown tier '${t}'`);
    for (const f of e.requires || []) if (!(f in tierFlags)) errs.push(`lens.${t}.requires unknown flag '${f}'`);
  }
  if ((m.what_changes_from_human || []).length > 3) errs.push('what_changes_from_human > 3 items');
  const nSources = (m.sources || []).length;
  (m.compare || []).forEach((r, i) => {
    for (const n of r.source_refs || []) if (!(n >= 1 && n <= nSources)) errs.push(`compare[${i}] source_ref ${n} is not a source of this module`);
    if (/\b\d+(\.\d+)?\s*(mg|mcg|µg|ug|g|ml|mL|units?|IU)\s*\/\s*kg\b/i.test(`${r.canine} ${r.implication}`)) errs.push(`compare[${i}] contains a dose-like figure in the canine or implication text; doses belong only in engine-checked drug entries`);
  });
  if (m.kind === 'pathophysiology' && (m.compare || []).length === 0 && m.status === 'approved') errs.push('approved pathophysiology module without compare rows');
  for (const d of m.drug_refs || []) if (!drugIds.has(d)) errs.push(`drug_ref '${d}' has no entry in content/drugs`);
  if (m.status === 'approved') {
    if (!m.signoff?.vet || !m.signoff?.physician) errs.push('approved without dual sign-off');
    if (!m.last_verified) errs.push('approved without last_verified');
    if (!(m.sources || []).length) errs.push('approved without sources');
    if (JSON.stringify(m).includes('TODO')) errs.push('approved but contains TODO');
    if ((m.what_changes_from_human || []).length === 0) errs.push('approved without what_changes_from_human');
    (m.compare || []).forEach((r, i) => { if (!(r.source_refs || []).length) errs.push(`approved but compare[${i}] has no source_refs`); });
  }
  // Retrieval-tool links are not citations. Every source must resolve to a DOI or PubMed record before approval.
  const unresolved = (m.sources || []).filter(x => /consensus\.app/.test(x.url || ''));
  if (unresolved.length) {
    const msg = `${unresolved.length} source(s) still use a retrieval link instead of a DOI or PubMed URL (citation details unverified)`;
    if (m.status === 'approved') errs.push(msg); else warns.push(msg);
  }
  if (m.last_verified && monthsBetween(new Date(m.last_verified), today) > m.review_interval_months) warns.push('STALE: past review interval');
  return { errs, warns };
}

/** Plates must exist, match their checksum and be verified public domain. */
export function validateFigures(m, contentRoot, readFile = f => fs.readFileSync(f)) {
  const errs = [];
  for (const f of m.figures || []) {
    if (f.license !== 'public-domain') errs.push(`figure ${f.id}: license must be 'public-domain'`);
    if (!f.credit || !f.sourceUrl) errs.push(`figure ${f.id}: credit and sourceUrl are required`);
    const file = path.join(contentRoot, f.src);
    if (!path.resolve(file).startsWith(path.resolve(contentRoot))) { errs.push(`figure ${f.id}: src escapes content/`); continue; }
    let buf;
    try { buf = readFile(file); } catch { errs.push(`figure ${f.id}: ${f.src} does not exist under content/`); continue; }
    const sha = crypto.createHash('sha1').update(buf).digest('hex');
    if (sha !== f.sha1) errs.push(`figure ${f.id}: sha1 is ${sha}, expected ${f.sha1}. The file is not the one credited`);
  }
  return errs;
}

/** Registry check: every plate must exist, match its sha1, be public domain, and have a unique id. */
export function validatePlates(registry, contentRoot, readFile) {
  const errs = [], seen = new Set();
  for (const p of registry.plates || []) {
    if (seen.has(p.id)) errs.push(`plate ${p.id}: duplicate id`);
    seen.add(p.id);
    errs.push(...validateFigures({ figures: [{ ...p, caption: p.subject }] }, contentRoot, readFile));
  }
  return errs;
}

export function validateDrug(d) {
  const errs = [];
  if (d.species !== 'canine') errs.push("species must be 'canine'");
  const s = JSON.stringify(d).toLowerCase();
  if (/human_dose|adult_dose|pediatric_dose/.test(s)) errs.push('human dose field present — forbidden');
  if (d.status === 'approved') {
    if (!(d.canine_source || []).length) errs.push('approved without canine_source');
    for (const i of d.indications || []) {
      if (!i.dose_mg_per_kg || typeof i.dose_mg_per_kg.low !== 'number') errs.push(`approved but ${i.indication}/${i.route} has no mg/kg dose`);
    }
  }
  return { errs, warns: [] };
}

let tierFlags = {};

const schemaDir = path.join(here, '..', 'schema');
function makeSchemaValidators() {
  const ajv = new Ajv2020({ allErrors: true, strict: false });
  addFormats(ajv);
  const load = f => JSON.parse(fs.readFileSync(path.join(schemaDir, f)));
  return { module: ajv.compile(load('module.schema.json')), drug: ajv.compile(load('drug.schema.json')) };
}
const fmt = v => (v.errors || []).map(e => `schema ${e.instancePath || '/'} ${e.message}`);
function run({ release = false } = {}) {
  const envs = JSON.parse(fs.readFileSync(path.join(root, 'environments.json')));
  tierFlags = envs.capability_flags;
  const drugFiles = walk(path.join(root, 'drugs'));
  const drugs = drugFiles.map(f => [f, JSON.parse(fs.readFileSync(f))]);
  const drugIds = new Set(drugs.map(([, d]) => d.id));
  let nErr = 0, nWarn = 0, nApproved = 0, nTotal = 0;
  const report = (f, { errs, warns }) => {
    errs.forEach(e => console.log(`ERROR ${path.relative(root, f)}: ${e}`)); warns.forEach(w => console.log(`WARN  ${path.relative(root, f)}: ${w}`));
    nErr += errs.length; nWarn += warns.length;
  };
  const sv = makeSchemaValidators();
  const index = JSON.parse(fs.readFileSync(path.join(root, 'index.json')));
  const domainIds = new Set(index.domains.map(d => d.id));
  const seen = new Set();
  for (const f of walk(path.join(root, 'modules'))) {
    const m = JSON.parse(fs.readFileSync(f)); nTotal++; if (m.status === 'approved') nApproved++;
    const r = validateModule(m, envs.tiers, drugIds);
    if (!sv.module(m)) r.errs.push(...fmt(sv.module));
    r.errs.push(...validateFigures(m, root));
    if (!domainIds.has(m.domain)) r.errs.push(`unknown domain '${m.domain}'`);
    if (!index.modules.some(x => x.id === m.id)) r.errs.push('module missing from content/index.json');
    if (seen.has(m.id)) r.errs.push('duplicate module id');
    seen.add(m.id);
    if (release && m.status !== 'approved') r.errs.push(`not approved (status: ${m.status})`);
    report(f, r);
  }
  const platesPath = path.join(root, 'plates.json');
  if (fs.existsSync(platesPath)) {
    const reg = JSON.parse(fs.readFileSync(platesPath));
    const ajvP = new Ajv2020({ allErrors: true, strict: false });
    const vp = ajvP.compile(JSON.parse(fs.readFileSync(path.join(schemaDir, 'plates.schema.json'))));
    const errs = [...(vp(reg) ? [] : (vp.errors || []).map(e => `schema ${e.instancePath || '/'} ${e.message}`)), ...validatePlates(reg, root)];
    report(platesPath, { errs, warns: [] });
    // every figure a module uses must be a registered plate (one place holds the licence record)
    const ids = new Set(reg.plates.map(p => p.src));
    for (const f of walk(path.join(root, 'modules'))) {
      const m = JSON.parse(fs.readFileSync(f));
      for (const fig of m.figures || []) if (!ids.has(fig.src)) report(f, { errs: [`figure ${fig.id}: ${fig.src} is not in content/plates.json`], warns: [] });
    }
  }
  for (const [f, d] of drugs) {
    const r = validateDrug(d);
    if (!sv.drug(d)) r.errs.push(...fmt(sv.drug));
    if (release && d.status !== 'approved') r.errs.push(`not approved (status: ${d.status})`);
    report(f, r);
  }
  for (const e of index.modules) if (!seen.has(e.id)) { console.log(`ERROR index.json: '${e.id}' has no module file`); nErr++; }
  console.log(`\n${nTotal} modules (${nApproved} approved), ${drugs.length} drugs — ${nErr} errors, ${nWarn} warnings`);
  return nErr;
}

export const _setFlags = f => { tierFlags = f; };
export { run };

if (process.argv[1] === fileURLToPath(import.meta.url)) process.exit(run({ release: process.argv.includes('--release') }) ? 1 : 0);
