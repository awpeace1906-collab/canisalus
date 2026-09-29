import { ContentStore } from './lib/contentStore.js';
import { createRouter, match } from './lib/router.js';
import { onboarded, applyTheme, activeTierId } from './lib/prefs.js';
import { el } from './components.js';
import { renderOnboarding } from './views/onboarding.js';
import { renderHome, renderDomain } from './views/home.js';
import { renderModule } from './views/module.js';
import { renderSettings, renderAbout, renderJurisdiction } from './views/settings.js';
import { renderDogs, renderDogEditor } from './views/dogs.js';
import { renderDose } from './views/dose.js';
import { renderHandoff } from './views/handoff.js';

const app = document.getElementById('app');
const tabBar = document.getElementById('tab-bar');
const topbar = document.getElementById('topbar');
const store = await new ContentStore().init();

document.title = store.config.store_title;
applyTheme();

const TABS = [['/', 'Home', '⌂'], ['/dose', 'Dose', '⚕'], ['/dogs', 'K9', '♥'], ['/handoff', 'Handoff', '✉'], ['/settings', 'Settings', '⚙']];

function chrome(route) {
  const on = onboarded();
  tabBar.hidden = topbar.hidden = !on;
  if (!on) return;
  topbar.replaceChildren(el('a', { class: 'brand', href: '#/' }, store.config.name),
    el('a', { class: 'tier-pill', href: '#/settings' }, store.tier(activeTierId(store.environments.default_tier)).label),
    !store.releaseBuild && el('span', { class: 'devflag' }, 'DEV: drafts visible'));
  const cur = '/' + (route.split('/')[1] ?? '');
  tabBar.replaceChildren(...TABS.map(([p, label, icon]) => el('a', { class: 'tab-item' + ((p === '/' ? cur === '/' || route.startsWith('/module') || route.startsWith('/domain') : cur === p) ? ' active' : ''), href: `#${p}` },
    el('span', { class: 'tab-icon', 'aria-hidden': 'true' }, icon), el('span', { class: 'tab-label' }, label))));
}

const router = createRouter(async route => {
  window.scrollTo(0, 0);
  chrome(route);
  const rerender = () => router.start();
  try {
    let p;
    if (!onboarded()) app.replaceChildren(renderOnboarding(store, () => { router.go('/'); rerender(); }));
    else if (route === '/') app.replaceChildren(renderHome(store));
    else if ((p = match(route, '/domain/:id'))) app.replaceChildren(renderDomain(p.id, store));
    else if ((p = match(route, '/module/:id'))) app.replaceChildren(renderModule(await store.module(p.id), store));
    else if (route === '/dose') app.replaceChildren(renderDose(store, await store.drugs()));
    else if (route === '/dogs') app.replaceChildren(renderDogs(rerender));
    else if ((p = match(route, '/dogs/:id'))) app.replaceChildren(renderDogEditor(p.id, router.go));
    else if (route === '/handoff') app.replaceChildren(renderHandoff(store));
    else if (route === '/settings') app.replaceChildren(renderSettings(store, rerender));
    else if (route === '/about') app.replaceChildren(renderAbout(store));
    else if (route === '/jurisdiction') app.replaceChildren(renderJurisdiction(store));
    else app.replaceChildren(el('section', { class: 'detail' }, el('h1', {}, 'Not found'), el('a', { href: '#/' }, 'Back to home')));
  } catch (err) {
    app.replaceChildren(el('section', { class: 'detail' }, el('h1', {}, 'Not available'), el('p', { class: 'muted' }, 'This content is not released.'), el('a', { href: '#/' }, 'Back to home')));
  }
});
router.start();

window.addEventListener('canisalus:content-updated', () => router.start());
if ('serviceWorker' in navigator) navigator.serviceWorker.register('./sw.js').catch(() => {});
