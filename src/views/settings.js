import { el, card, back, bridgeLine } from '../components.js';
import { prefs, activeTierId, setTier, flagOverrides, setFlagOverride, applyTheme } from '../lib/prefs.js';
import { resolveFlag } from '../lib/lens.js';
import { session } from '../lib/session.js';
import { APP_VERSION, GITHUB_REPO } from '../lib/appConfig.js';

export function renderSettings(store, rerender) {
  const tierId = activeTierId(store.environments.default_tier);
  const tier = store.tier(tierId);
  const ov = flagOverrides();

  const tierPicker = el('div', { class: 'choices', role: 'radiogroup', 'aria-label': 'Setting' }, store.tiers.map(t =>
    el('label', { class: 'choice' },
      el('input', { type: 'radio', name: 'tier', checked: t.id === tier.id, onChange: () => { setTier(t.id); rerender(); } }),
      el('span', {}, t.label + (t.id === store.environments.default_tier ? ' (default)' : '')))));

  const flags = Object.entries(store.environments.capability_flags).map(([flag, label]) => {
    const def = tier.flags[flag];
    const needsConfirm = (def === 'sometimes' || def === 'jurisdiction') && !(flag in ov);
    return el('label', { class: 'choice' },
      el('input', { type: 'checkbox', checked: resolveFlag(def, ov[flag]), onChange: e => { setFlagOverride(flag, e.target.checked); rerender(); } }),
      el('span', {}, label.replace(/\s*\(.*\)$/, ''), needsConfirm && el('em', { class: 'confirm' }, ` confirm (${def})`), flag in ov && el('em', { class: 'confirm' }, ' changed')));
  });

  return el('div', { class: 'detail' },
    back('#/', 'Home'), el('h1', {}, 'Settings'),
    card('Your setting', [tierPicker, el('p', { class: 'muted small' }, "Changing setting resets the site capabilities below to that setting's defaults.")]),
    card('Site capabilities', [
      el('p', { class: 'muted small' }, 'Guides key off what your site can do, not your rank. Values marked "confirm" count as unavailable until you turn them on.'),
      el('div', { class: 'choices' }, flags),
      el('button', { disabled: !Object.keys(ov).length, onClick: () => { prefs.set('flagOverrides', null); rerender(); } }, 'Reset to defaults')]),
    card('Appearance', el('select', { 'aria-label': 'Theme', onChange: e => { prefs.set('theme', e.target.value); applyTheme(); } },
      ['system', 'light', 'dark'].map(v => el('option', { value: v, selected: prefs.get('theme', 'system') === v }, v[0].toUpperCase() + v.slice(1))))),
    card(`About ${store.config.name}`, [el('a', { href: '#/about' }, `About ${store.config.name}`), ' · ', el('a', { href: '#/jurisdiction' }, 'Jurisdiction card')]),
    card('On-device data', [
      el('p', { class: 'muted small' }, 'K9 profiles and settings are stored only on this device.'),
      el('button', { class: 'danger', onClick: () => { if (confirm('Erase all K9 profiles and settings on this device?')) { prefs.clearAll(); session.clearAll(); location.hash = '#/'; location.reload(); } } }, 'Erase all local data')]),
    el('p', { class: 'muted small' }, `Version ${APP_VERSION} · `, el('a', { href: `https://github.com/${GITHUB_REPO}/issues/new`, target: '_blank', rel: 'noopener' }, 'Report an issue'), store.releaseBuild ? '' : ' · development build'),
    bridgeLine());
}

export function renderAbout(store) {
  const a = store.about.settings_about;
  return el('div', { class: 'detail' }, back('#/settings', 'Settings'), el('h1', {}, a.title),
    a.sections.map(s => [s.heading && el('h2', {}, s.heading), el('p', {}, s.body)]), bridgeLine());
}

export function renderJurisdiction(store) {
  return el('div', { class: 'detail' }, back('#/', 'Home'), el('h1', {}, 'Jurisdiction card'),
    card(null, el('p', {}, 'Who may treat a K9, and how far, varies widely by state. Check your state law, your local protocol and your medical direction before treating.'), 'warn'),
    store.hasModule('jurisdiction-card')
      ? el('p', {}, el('a', { href: '#/module/jurisdiction-card' }, 'Open the state-by-state jurisdiction card'))
      : el('p', { class: 'muted' }, 'State-by-state content is still being reviewed and is not yet released.'));
}
