import test from 'node:test';
import assert from 'node:assert';
import { telHref, searchLinks, directionsLinks, verifyState, groupByArea, isUsableVetEd, newVetEd, VERIFY_AFTER_DAYS } from '../src/lib/vetEd.js';
import { newDog, saveDog, listDogs } from '../src/lib/dogs.js';
import { prefs } from '../src/lib/prefs.js';

test('telHref keeps digits and a leading +, drops extensions, and rejects junk', () => {
  assert.equal(telHref('+1 (555) 123-4567'), 'tel:+15551234567');
  assert.equal(telHref('555-123-4567 ext 12'), 'tel:5551234567');
  assert.equal(telHref('555 123 4567 x9'), 'tel:5551234567');
  assert.equal(telHref(''), null);
  assert.equal(telHref('12'), null);
  assert.equal(telHref(null), null);
});

test('telHref cannot be turned into another scheme or carry script', () => {
  for (const evil of ['javascript:alert(1)', '555;javascript:alert(1)', '<script>1</script>', 'tel:555&x=1 evil']) {
    const h = telHref(evil);
    assert.ok(h === null || /^tel:\+?\d+$/.test(h), `unsafe: ${h}`);
  }
});

test('search links are https, encoded, and need no location', () => {
  const l = searchLinks();
  for (const u of Object.values(l)) {
    assert.ok(u.startsWith('https://'), u);
    assert.ok(u.includes('24%20hour%20emergency%20veterinarian'), u);
    assert.ok(!/lat|lng|ll=|location/i.test(u), `must not embed a location: ${u}`);
  }
});

test('directions links encode the destination and are null with nothing to navigate to', () => {
  const l = directionsLinks({ name: 'A&B Vet #1', address: '12 Main St, Springfield' });
  assert.ok(l.google.startsWith('https://www.google.com/maps/dir/'));
  assert.ok(l.google.includes('A%26B%20Vet%20%231%2C%2012%20Main%20St%2C%20Springfield'));
  assert.ok(l.apple.startsWith('https://maps.apple.com/'));
  assert.equal(directionsLinks({}), null);
  assert.equal(directionsLinks({ name: '  ', address: '' }), null);
  assert.equal(directionsLinks({ name: 'City 24h ER' }), null, 'a name alone is not enough to navigate to');
  assert.ok(directionsLinks({ address: '12 Main St' }).google.includes('12%20Main%20St'));
});

test('verifyState: unverified without a usable date, stale past the window, ok inside it', () => {
  const now = new Date(2026, 9, 2);
  assert.equal(verifyState({}, now), 'unverified');
  assert.equal(verifyState({ verified: 'last week' }, now), 'unverified');
  assert.equal(verifyState({ verified: '2026-10-01' }, now), 'ok');
  assert.equal(verifyState({ verified: '2027-01-01' }, now), 'unverified', 'a future date is not trusted');
  const edge = new Date(Date.UTC(2026, 9, 2) - VERIFY_AFTER_DAYS * 86400000);
  const iso = d => `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`;
  assert.equal(verifyState({ verified: iso(edge) }, now), 'ok', 'exactly at the limit is still ok');
  assert.equal(verifyState({ verified: iso(new Date(edge.getTime() - 86400000)) }, now), 'stale');
});

test('groupByArea groups by label and names blank areas Unlabeled', () => {
  const g = groupByArea([{ area: 'Home', name: 'a' }, { area: ' ', name: 'b' }, { area: 'Home', name: 'c' }]);
  assert.deepEqual(g.map(x => [x.area, x.items.map(i => i.name)]), [['Home', ['a', 'c']], ['Unlabeled', ['b']]]);
  assert.deepEqual(groupByArea(undefined), []);
});

test('saveDog keeps saved vet ERs, drops empty rows, and old profiles without the field still load', () => {
  prefs.clearAll();
  const d = { ...newDog(), name: 'Rex', vetEds: [{ ...newVetEd(), name: 'City 24h ER', phone: '5551234567' }, newVetEd(), { ...newVetEd(), address: '  ' }] };
  saveDog(d);
  const [saved] = listDogs();
  assert.equal(saved.vetEds.length, 1);
  assert.equal(saved.vetEds[0].name, 'City 24h ER');
  assert.ok(isUsableVetEd(saved.vetEds[0]));
  prefs.set('dogs', [{ id: 'old', name: 'Old' }]); // profile saved before this field existed
  saveDog({ id: 'old', name: 'Old' });
  assert.deepEqual(listDogs().find(x => x.id === 'old').vetEds, []);
});
