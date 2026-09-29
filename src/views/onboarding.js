import { el, bridgeLine } from '../components.js';
import { finishOnboarding } from '../lib/prefs.js';

/** First run: short intro, launch disclaimer (bridge to veterinary care), setting picker. */
export function renderOnboarding(store, onDone) {
  const o = store.about.onboarding;
  let tier = store.environments.default_tier;
  const radios = store.tiers.map(t => el('label', { class: 'choice' },
    el('input', { type: 'radio', name: 'tier', checked: t.id === tier, onChange: () => { tier = t.id; } }),
    el('span', {}, t.label + (t.id === store.environments.default_tier ? ' (default)' : ''))));
  return el('div', { class: 'detail onboarding' },
    el('h1', {}, o.title),
    el('p', { class: 'pron' }, o.pronunciation_line),
    el('p', {}, o.body),
    el('section', { class: 'card warn' }, el('strong', {}, 'Before you start. '),
      `${store.config.name} is a bridge to veterinary care, not a replacement for it. Get the dog to a veterinarian. Local veterinary protocol overrides anything here.`),
    el('h2', {}, 'Your setting'),
    el('p', { class: 'muted small' }, 'You can change this any time in Settings.'),
    el('div', { class: 'choices', role: 'radiogroup', 'aria-label': 'Setting' }, radios),
    el('div', { class: 'row' },
      el('button', { class: 'primary', onClick: () => { finishOnboarding(tier); onDone(); } }, 'I understand. Continue'),
      el('button', { onClick: () => { finishOnboarding(); onDone(); } }, 'Skip')),
    bridgeLine());
}
