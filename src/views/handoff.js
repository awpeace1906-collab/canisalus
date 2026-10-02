import { el, back, field, input } from '../components.js';
import { activeDog } from '../lib/dogs.js';
import { activeTierId } from '../lib/prefs.js';
import { buildHandoff } from '../lib/handoff.js';
import { session } from '../lib/session.js';

export function renderHandoff(store) {
  const S = { situation: '', timeline: '', assessment: '', ...session.get('/handoff') };
  const dog = activeDog(), tier = store.tier(activeTierId(store.environments.default_tier));
  const pre = el('pre', { class: 'handoff' });
  const shareBtn = el('button', { class: 'primary' }, 'Share as text');
  const update = () => { session.patch('/handoff', S); pre.textContent = buildHandoff({ dog, tierLabel: tier.label, ...S }); };
  const bind = k => v => { S[k] = v; update(); };
  shareBtn.addEventListener('click', async () => {
    const text = pre.textContent;
    try {
      if (navigator.share) await navigator.share({ text });
      else { await navigator.clipboard.writeText(text); shareBtn.textContent = 'Copied'; setTimeout(() => { shareBtn.textContent = 'Share as text'; }, 2000); }
    } catch { /* cancelled */ }
  });
  update();
  return el('div', { class: 'detail' }, back('#/', 'Home'), el('h1', {}, 'Handoff'),
    el('p', { class: 'muted small' }, dog ? `K9: ${dog.name}` : 'No K9 profile selected. Add one under K9 profiles to fill in background.'),
    field('Situation', input({ rows: 3, value: S.situation, onInput: bind('situation') })),
    field('Timeline and interventions (times, findings, treatments, drugs given)', input({ rows: 6, value: S.timeline, onInput: bind('timeline') })),
    field('Assessment', input({ rows: 3, value: S.assessment, onInput: bind('assessment') })),
    el('h2', {}, 'Summary'), pre, shareBtn,
    el('p', {}, el('a', { class: 'button', href: '#/vet-ed' }, 'Find a 24/7 vet ER')));
}
