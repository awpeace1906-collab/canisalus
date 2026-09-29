import test from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import { renderLens, resolveFlags, resolveFlag } from '../src/lib/lens.js';

const envs = JSON.parse(fs.readFileSync(new URL('../content/environments.json', import.meta.url)));
const tier = id => envs.tiers.find(t => t.id === id);
const gdv = JSON.parse(fs.readFileSync(new URL('../content/modules/medical/gastric-dilatation-volvulus.json', import.meta.url)));

test("'sometimes' and 'jurisdiction' resolve false until the user confirms", () => {
  assert.equal(resolveFlag('sometimes'), false);
  assert.equal(resolveFlag('jurisdiction'), false);
  assert.equal(resolveFlag('jurisdiction', true), true);
  assert.equal(resolveFlag(true, false), false);
  const f = resolveFlags(tier('vet_gp'));
  assert.equal(f.canine_blood, false);
  assert.equal(f.species_surgery, true);
});

test('lens returns the tier entry when requirements are met', () => {
  const l = renderLens(gdv, 'vet_gp', resolveFlags(tier('vet_gp')));
  assert.deepEqual(l.doHere, ['Stabilize', 'Gastropexy if capable']);
  assert.deepEqual(l.unmetFlags, []);
});

test('do_here is demoted to leave_for_next when a required flag is missing at the site', () => {
  const flags = resolveFlags(tier('vet_gp'), { species_surgery: false });
  const l = renderLens(gdv, 'vet_gp', flags);
  assert.deepEqual(l.doHere, []);
  assert.deepEqual(l.unmetFlags, ['species_surgery']);
  assert.deepEqual(l.demoted, ['Stabilize', 'Gastropexy if capable']);
  assert.ok(l.leaveForNext.includes('Stabilize') && l.leaveForNext.includes('Post-op ICU'));
});

test('hidden lens entries hide the module at that tier', () => {
  const m = { lens: { handler: { do_here: ['x'], leave_for_next: [], transfer_trigger: 't', hidden: true } } };
  const l = renderLens(m, 'handler', {});
  assert.equal(l.hidden, true);
  assert.deepEqual(l.doHere, []);
});

test('missing lens entry returns null', () => assert.equal(renderLens({ lens: {} }, 'handler', {}), null));
