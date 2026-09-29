import test from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import { computeDose, RESULT } from '../engine/dose.js';
import { validateModule, validateDrug, _setFlags } from '../tools/validate.js';
const readJson = p => JSON.parse(fs.readFileSync(new URL(p, import.meta.url)));
const envs = readJson('../content/environments.json');
_setFlags(envs.capability_flags);
const ranks = Object.fromEntries(envs.tiers.map(t => [t.id, t.rank]));

// Synthetic test drug — NOT clinical data.
const fake = { id: 'testdrug', name: 'Test', species: 'canine', status: 'approved', mdr1_caution: true,
  human_product_hazards: ['xylitol in ODT'], canine_source: [{ rank: 1, citation: 'test' }],
  indications: [{ indication: 'x', route: 'IV', dose_mg_per_kg: { low: 1, high: 2 }, max_dose_mg: 50, concentration_mg_per_ml: 10, min_tier: 'prehospital_als' }] };
const q = o => ({ indication: 'x', route: 'IV', weightKg: 30, tierRank: 3, tierRanks: ranks, ...o });

test('computes mg and ml range', () => { const r = computeDose(fake, q()); assert.equal(r.result, RESULT.OK); assert.equal(r.lowMg, 30); assert.equal(r.highMg, 50); assert.equal(r.highMl, 5); });
test('caps at max dose', () => assert.ok(computeDose(fake, q()).warnings.includes('MAX_DOSE_CAPPED')));
test('no weight → NEED_WEIGHT', () => assert.equal(computeDose(fake, q({ weightKg: undefined })).result, RESULT.NEED_WEIGHT));
test('unapproved → NO_CANINE_DOSE', () => assert.equal(computeDose({ ...fake, status: 'draft' }, q()).result, RESULT.NO_CANINE_DOSE));
test('unsourced → NO_CANINE_DOSE', () => assert.equal(computeDose({ ...fake, canine_source: [] }, q()).result, RESULT.NO_CANINE_DOSE));
test('non-canine species → NO_CANINE_DOSE', () => assert.equal(computeDose({ ...fake, species: 'human' }, q()).result, RESULT.NO_CANINE_DOSE));
test('missing route → NO_CANINE_DOSE (never falls back)', () => assert.equal(computeDose(fake, q({ route: 'IM' })).result, RESULT.NO_CANINE_DOSE));
test('below min tier → NOT_AT_THIS_TIER', () => assert.equal(computeDose(fake, q({ tierRank: 0 })).result, RESULT.NOT_AT_THIS_TIER));
test('MDR1 warning for unknown herding breed', () => assert.ok(computeDose(fake, q({ herdingBreed: true })).warnings.includes('MDR1_CAUTION')));
test('estimated weight flagged', () => assert.ok(computeDose(fake, q({ weightEstimated: true })).warnings.includes('WEIGHT_ESTIMATED')));
test('human product hazard surfaced', () => assert.ok(computeDose(fake, q()).warnings.some(w => w.startsWith('HUMAN_PRODUCT_HAZARD'))));

test('validator rejects human dose fields', () => assert.ok(validateDrug({ ...fake, human_dose: 1 }).errs.length));
test('validator rejects approved module without dual sign-off', () => {
  const m = readJson('../content/modules/medical/gastric-dilatation-volvulus.json');
  const r = validateModule({ ...m, status: 'approved', signoff: { vet: { name: 'a', credential: 'DVM', date: '2026-09-28' }, physician: null } }, envs.tiers, new Set());
  assert.ok(r.errs.includes('approved without dual sign-off'));
});
test('validator requires every non-optional tier in lens', () => {
  const m = readJson('../content/modules/medical/gastric-dilatation-volvulus.json');
  const lens = { ...m.lens }; delete lens.human_ed;
  assert.ok(validateModule({ ...m, lens }, envs.tiers, new Set()).errs.some(e => e.includes('human_ed')));
});
