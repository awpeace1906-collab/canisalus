import test from 'node:test';
import assert from 'node:assert';
import { staleness } from '../src/lib/staleness.js';
import { makeSearch } from '../src/lib/search.js';
import { buildHandoff } from '../src/lib/handoff.js';
import { match } from '../src/lib/router.js';
import { doseFor, RESULT, NO_CANINE_DOSE_COPY } from '../src/lib/dose.js';
import { prefs, setTier, setFlagOverride, flagOverrides } from '../src/lib/prefs.js';
import { newDog, saveDog, listDogs, deleteDog, activeDogId } from '../src/lib/dogs.js';

test('staleness states', () => {
  const today = new Date('2026-09-29');
  assert.equal(staleness({ last_verified: null, review_interval_months: 12 }, today).state, 'unverified');
  assert.equal(staleness({ last_verified: '2026-01-01', review_interval_months: 12 }, today).state, 'ok');
  const s = staleness({ last_verified: '2024-01-01', review_interval_months: 12 }, today);
  assert.equal(s.state, 'stale'); assert.equal(s.overdueBy, 20);
});

test('search ranks title over keyword over summary', () => {
  const e = [
    { id: 'a', title: 'Heat stroke', domain: 'm', domainLabel: 'Medical', keywords: [], summary: '' },
    { id: 'b', title: 'Other', domain: 'm', domainLabel: 'Medical', keywords: ['cooling for heat'], summary: '' },
    { id: 'c', title: 'Third', domain: 'x', domainLabel: 'X', keywords: [], summary: 'dogs get heat fast' },
  ];
  assert.deepEqual(makeSearch(e)('heat').map(x => x.id), ['a', 'b', 'c']);
  assert.deepEqual(makeSearch(e)('heat', { domain: 'x' }).map(x => x.id), ['c']);
  assert.deepEqual(makeSearch(e)('  '), []);
});

test('handoff includes profile, flags estimated weight, and never invents data', () => {
  const dog = { ...newDog(), name: 'Rex', weightKg: 30, weightEstimated: true, mdr1: 'unknown', herdingBreed: true };
  const t = buildHandoff({ dog, tierLabel: 'Human ED', situation: 'Collapsed', now: new Date('2026-09-29T12:00:00Z') });
  assert.match(t, /Weight: 30 kg \(ESTIMATED\)/);
  assert.match(t, /MDR1: unknown \(herding breed\)/);
  assert.match(t, /Current meds: not recorded/);
  assert.match(t, /Local veterinary protocol overrides/);
  assert.match(buildHandoff({ dog: null, tierLabel: 'x' }), /No K9 profile selected/);
});

test('router match', () => {
  assert.deepEqual(match('/module/abc', '/module/:id'), { id: 'abc' });
  assert.equal(match('/module', '/module/:id'), null);
});

test('dose adapter never yields a dose for unapproved drugs and passes the copy through', () => {
  const tier = { id: 'human_ed', rank: 3 };
  const draft = { id: 'x', name: 'X', species: 'canine', status: 'draft', canine_source: [], indications: [{ indication: 'i', route: 'IV', dose_mg_per_kg: { low: 1 }, max_dose_mg: 5 }] };
  const r = doseFor({ drug: draft, indication: 'i', route: 'IV', dog: { weightKg: 20 }, tier, tierRanks: { human_ed: 3 } });
  assert.equal(r.result, RESULT.NO_CANINE_DOSE);
  assert.equal(NO_CANINE_DOSE_COPY, 'No verified canine dose. Contact a veterinarian or animal poison control.');
});

test('dose adapter: manual weight is always flagged as estimated', () => {
  const tier = { id: 'human_ed', rank: 3 };
  const drug = { id: 'x', name: 'X', species: 'canine', status: 'approved', canine_source: [{ rank: 1, citation: 't' }], indications: [{ indication: 'i', route: 'IV', dose_mg_per_kg: { low: 1 }, max_dose_mg: 500 }] };
  const r = doseFor({ drug, indication: 'i', route: 'IV', dog: null, weightOverrideKg: 10, tier, tierRanks: { human_ed: 3 } });
  assert.equal(r.result, RESULT.OK);
  assert.ok(r.warnings.includes('WEIGHT_ESTIMATED'));
  assert.equal(doseFor({ drug, indication: 'i', route: 'IV', dog: null, tier, tierRanks: {} }).result, RESULT.NEED_WEIGHT);
});

test('prefs and dogs persist in memory; changing tier resets flag overrides', () => {
  prefs.clearAll();
  setTier('vet_gp'); setFlagOverride('canine_blood', true);
  assert.deepEqual(flagOverrides(), { canine_blood: true });
  setTier('human_ed');
  assert.deepEqual(flagOverrides(), {});
  const d = { ...newDog(), name: 'Rex', weightKg: '32' };
  saveDog(d);
  assert.equal(listDogs()[0].weightKg, 32);
  assert.equal(activeDogId(), d.id);
  deleteDog(d.id);
  assert.equal(listDogs().length, 0); assert.equal(activeDogId(), null);
});
