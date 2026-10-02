import { el, card, moduleList, bridgeLine } from '../components.js';
import { makeSearch } from '../lib/search.js';

/** Home: "Can this be reversed?" first, domains second, search on top. */
export function renderHome(store) {
  const entries = store.searchEntries;
  const search = makeSearch(entries);
  const results = el('div', {});
  const rest = el('div', {});
  const q = el('input', { type: 'search', placeholder: 'Search modules', 'aria-label': 'Search modules', onInput: e => {
    const term = e.target.value;
    results.replaceChildren(term.trim() ? moduleList(search(term)) : '');
    rest.hidden = !!term.trim();
  } });

  rest.append(
    !entries.length && card(null, el('p', {}, 'No released modules yet. Content appears here once a veterinarian and a physician have both signed it off.'), 'warn'),
    el('h1', {}, 'Can this be reversed?'),
    el('p', { class: 'muted' }, 'Start with what can still be fixed before the dog reaches a veterinarian.'),
    card('Reversible now', moduleList(entries.filter(e => e.reversible))),
    el('h2', {}, 'Browse by domain'),
    el('ul', { class: 'grid' }, store.domains.map(d => el('li', {},
      el('a', { href: `#/domain/${d.id}` }, d.label, el('span', { class: 'muted small' }, ` ${entries.filter(e => e.domain === d.id).length}`))))),
    el('div', { class: 'row' },
      el('a', { class: 'button', href: '#/dose' }, 'Dose'),
      el('a', { class: 'button', href: '#/dogs' }, 'K9 profiles'),
      el('a', { class: 'button', href: '#/handoff' }, 'Handoff'),
      el('a', { class: 'button', href: '#/vet-ed' }, 'Vet ER')),
    bridgeLine());
  return el('div', { class: 'home' }, q, results, rest);
}

export function renderDomain(id, store) {
  const d = store.domains.find(x => x.id === id);
  return el('div', { class: 'detail' }, el('a', { href: '#/', class: 'back' }, '‹ Home'),
    el('h1', {}, d?.label ?? id), moduleList(store.searchEntries.filter(e => e.domain === id)));
}
