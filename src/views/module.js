import { el, card, list, banner, back } from '../components.js';
import { staleness } from '../lib/staleness.js';
import { renderLens, resolveFlags } from '../lib/lens.js';
import { activeTierId, flagOverrides } from '../lib/prefs.js';
import { flagOutdatedURL } from '../lib/appConfig.js';

/** Module template: header, why, what changes from human, content, environment lens, takeaway. */
export function renderModule(m, store) {
  const tier = store.tier(activeTierId(store.environments.default_tier));
  const lens = renderLens(m, tier.id, resolveFlags(tier, flagOverrides()));
  const domain = store.domains.find(d => d.id === m.domain);
  const st = staleness(m);
  const rec = m.content.recognition ?? [], mgmt = m.content.management ?? [];

  return el('article', { class: 'detail module' },
    back(`#/domain/${m.domain}`, domain?.label ?? 'Back'),
    el('header', { class: 'mhead' },
      el('h1', {}, m.title, m.status !== 'approved' && el('span', { class: 'badge' }, m.status)),
      el('p', { class: 'meta' },
        m.reversible && el('span', { class: 'tag' }, 'Reversible'),
        el('span', {}, m.last_verified ? `Verified ${m.last_verified}` : 'Not verified'),
        m.signoff.vet && el('span', {}, `Vet: ${m.signoff.vet.name}, ${m.signoff.vet.credential}`),
        m.signoff.physician && el('span', {}, `Physician: ${m.signoff.physician.name}, ${m.signoff.physician.credential}`))),
    st.state === 'stale' && banner(`Past review interval by ${st.overdueBy} month${st.overdueBy === 1 ? '' : 's'} (last verified ${m.last_verified}). Confirm against current veterinary guidance and local protocol.`),
    st.state === 'unverified' && !store.releaseBuild && banner('Not yet verified. Development build only: released content is always verified.'),
    card('Why this matters', el('p', {}, m.why_this_matters)),
    m.what_changes_from_human.length > 0 && card('What changes from human', el('ol', {}, m.what_changes_from_human.map(w => el('li', {}, w.point))), 'change'),
    (rec.length || mgmt.length) > 0 && card('Content', [rec.length > 0 && [el('h3', {}, 'Recognition'), list(rec)], mgmt.length > 0 && [el('h3', {}, 'Management'), list(mgmt)]]),
    card(`At your setting: ${tier.label}`, lensBody(lens)),
    m.drug_refs.length > 0 && card('Drugs', el('a', { href: '#/dose' }, 'Open dose calculator')),
    card('Clinical takeaway', el('p', {}, m.takeaway), 'takeaway'),
    m.sources.length > 0 && card('Sources', el('ol', {}, m.sources.map(s => el('li', {}, `[${s.rank}] `, s.url ? el('a', { href: s.url, target: '_blank', rel: 'noopener' }, s.citation) : s.citation)))),
    el('p', { class: 'small' }, el('a', { href: '#/jurisdiction' }, 'Who may treat a K9 here? Jurisdiction card'), ' · ',
      el('a', { href: flagOutdatedURL(m), target: '_blank', rel: 'noopener' }, 'Flag as outdated')));
}

function lensBody(lens) {
  if (!lens) return el('p', { class: 'muted' }, 'No guidance for this setting.');
  if (lens.hidden) return el('p', { class: 'muted' }, 'This module does not apply at your setting.');
  return [
    lens.unmetFlags.length > 0 && banner(`Your site lacks: ${lens.unmetFlags.join(', ')}. Actions that need it are moved to "Leave for next level".`),
    el('h3', {}, 'Do here'), lens.doHere.length ? list(lens.doHere) : el('p', { class: 'muted' }, 'Nothing at this setting.'),
    el('h3', {}, 'Leave for next level'), lens.leaveForNext.length ? list(lens.leaveForNext) : el('p', { class: 'muted' }, 'Nothing.'),
    el('h3', {}, 'Transfer trigger'), el('p', {}, lens.transferTrigger),
  ];
}
