import { el, card, back, field, input, banner } from '../components.js';
import { activeDog } from '../lib/dogs.js';
import { searchLinks, directionsLinks, telHref, verifyState, groupByArea, newVetEd, VERIFY_AFTER_DAYS } from '../lib/vetEd.js';

const ext = (href, text, cls = 'button') => el('a', { class: cls, href, target: '_blank', rel: 'noopener noreferrer' }, text);
const STATE_TEXT = {
  ok: null,
  stale: `Last verified over ${VERIFY_AFTER_DAYS} days ago. Call to confirm before you drive.`,
  unverified: 'Not verified. Call to confirm before you drive.',
};

/** Two ways to find a 24/7 vet ER: the saved list for this K9 (known areas) and a maps search (unfamiliar territory). */
export function renderVetEd() {
  const dog = activeDog();
  const links = searchLinks();

  const unfamiliar = card('In unfamiliar territory',
    el('div', {},
      el('p', {}, 'Search for emergency veterinarians near where you are right now. This opens your phone\'s maps app.'),
      el('div', { class: 'row' }, ext(links.google, 'Search in Google Maps', 'button primary'), ext(links.apple, 'Search in Apple Maps')),
      el('p', { class: 'muted small' }, 'This app does not read your location or send anything itself. Opening hours shown in maps can be wrong or out of date: call before you drive and confirm they are open and can see your dog.')));

  const saved = dog && (dog.vetEds ?? []).length
    ? groupByArea(dog.vetEds).map(g => card(g.area, el('ul', { class: 'list' }, g.items.map(entry => {
        const tel = telHref(entry.phone), dir = directionsLinks(entry), state = verifyState(entry);
        return el('li', { class: 'vet-ed' },
          el('strong', {}, entry.name || 'Unnamed clinic'),
          entry.address && el('div', { class: 'muted small' }, entry.address),
          entry.note && el('div', { class: 'small' }, entry.note),
          el('div', { class: 'muted small' }, entry.verified ? `Verified ${entry.verified}` : 'No verification date'),
          STATE_TEXT[state] && banner(STATE_TEXT[state]),
          el('div', { class: 'row' },
            tel ? el('a', { class: 'button primary', href: tel }, `Call ${entry.phone.trim()}`) : el('span', { class: 'muted small' }, 'No phone saved'),
            dir && ext(dir.google, 'Directions (Google)'), dir && ext(dir.apple, 'Directions (Apple)')));
      }))))
    : card('Saved for this K9', el('p', {}, dog
        ? `No emergency vets saved for ${dog.name || 'this K9'} yet.`
        : 'No K9 selected. Pick or add a K9 profile to keep a list of 24/7 emergency vets for each work area.')); 

  return el('div', { class: 'detail' }, back('#/', 'Home'), el('h1', {}, 'Find a 24/7 vet ER'),
    el('p', { class: 'muted' }, dog ? `Saved list for ${dog.name || 'this K9'}, or search near you.` : 'Search near you, or save a list per K9.'),
    el('h2', {}, 'Local missions: your saved list'),
    el('p', { class: 'muted small' }, 'Record the 24/7 emergency vets for each area you work before you need them, and re-verify by phone.'),
    saved,
    dog && el('a', { class: 'button', href: `#/dogs/${dog.id}` }, 'Edit saved vets'),
    unfamiliar);
}

/** Editor block for the K9 profile form. Mutates d.vetEds in place; saveDog drops empty rows. */
export function vetEdEditor(d) {
  d.vetEds ??= [];
  const box = el('div', {});
  const draw = () => box.replaceChildren(
    ...d.vetEds.map((e, i) => el('div', { class: 'card' },
      field('Area or mission (for example Home base, Training site)', input({ value: e.area, onInput: v => { e.area = v; } })),
      field('Clinic name', input({ value: e.name, onInput: v => { e.name = v; } })),
      field('Phone', input({ type: 'tel', value: e.phone, onInput: v => { e.phone = v; } })),
      field('Address', input({ value: e.address, onInput: v => { e.address = v; } })),
      field('Last verified (date you confirmed they are open 24/7)', input({ type: 'date', value: e.verified, onInput: v => { e.verified = v; } })),
      field('Note (for example accepts working dogs, entrance)', input({ value: e.note, onInput: v => { e.note = v; } })),
      el('button', { type: 'button', class: 'danger', onClick: () => { d.vetEds.splice(i, 1); draw(); } }, 'Remove'))),
    el('button', { type: 'button', onClick: () => { d.vetEds.push(newVetEd()); draw(); } }, 'Add emergency vet'));
  draw();
  return el('div', {}, el('h2', {}, '24/7 emergency vets'),
    el('p', { class: 'muted small' }, 'Kept on this device only. Opening hours change: verify by phone and update the date.'), box);
}
