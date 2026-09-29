// ContentStore (Kairos delivery pattern): render from cache always -> check the manifest when online ->
// background-fetch only modules whose hash changed -> swap the cache silently.
// The bundled copy (precached by the service worker) is the offline fallback.
const BUNDLED_BASE = new URL('../../content/', import.meta.url).href;
// Same-origin by default: the service worker refreshes content stale-while-revalidate.
// Set to a cross-origin URL only if content moves off the app's own host.
const REMOTE_BASE = null;
const LS_HASHES = 'canisalus.hashes.v1';
const CACHE_NAME = 'canisalus-content-v1';

export class ContentStore {
  #manifest; #search; #index; #env; #about; #config;
  #cache = new Map();

  async init() {
    [this.#manifest, this.#search, this.#index, this.#env, this.#about, this.#config] = await Promise.all([
      this.#json('manifest.json'), this.#json('search-index.json'), this.#json('index.json'),
      this.#json('environments.json'), this.#json('about.json'), this.#json('app.config.json'),
    ]);
    this.#checkForUpdates().catch(e => console.info('[content] update check skipped:', e.message));
    return this;
  }

  get config() { return this.#config; }
  get about() { return this.#about; }
  get environments() { return this.#env; }
  get tiers() { return this.#env.tiers; }
  get domains() { return this.#index.domains; }
  get searchEntries() { return this.#search.entries; }
  get manifest() { return this.#manifest; }
  get releaseBuild() { return this.#manifest.release === true; }

  tier(id) { return this.tiers.find(t => t.id === id) ?? this.tiers.find(t => t.id === this.#env.default_tier); }
  get tierRanks() { return Object.fromEntries(this.tiers.map(t => [t.id, t.rank])); }
  hasModule(id) { return id in this.#manifest.modules; }

  async module(id) { return this.#load('modules', id); }
  async drugs() { return Promise.all(Object.keys(this.#manifest.drugs).map(id => this.#load('drugs', id))); }

  async #load(kind, id) {
    const key = `${kind}/${id}`;
    if (this.#cache.has(key)) return this.#cache.get(key);
    const meta = this.#manifest[kind][id];
    if (!meta) throw new Error(`"${id}" is not available`);
    const json = await this.#json(meta.path);
    this.#cache.set(key, json);
    return json;
  }

  async #json(rel) {
    if ('caches' in self) {
      try {
        const hit = await (await caches.open(CACHE_NAME)).match(new URL(rel, REMOTE_BASE || BUNDLED_BASE).href);
        if (hit) return hit.json();
      } catch { /* fall through to bundled */ }
    }
    const res = await fetch(new URL(rel, BUNDLED_BASE).href, { cache: 'no-cache' });
    if (!res.ok) throw new Error(`${rel}: ${res.status}`);
    return res.json();
  }

  async #checkForUpdates() {
    if (!REMOTE_BASE || !navigator.onLine) return;
    const res = await fetch(new URL('manifest.json', REMOTE_BASE).href, { cache: 'no-store' });
    if (!res.ok) return;
    const remote = await res.json();
    const seen = JSON.parse(localStorage.getItem(LS_HASHES) || '{}');
    const cache = await caches.open(CACHE_NAME);
    const changed = [];
    for (const kind of ['modules', 'drugs']) {
      for (const [id, m] of Object.entries(remote[kind])) {
        if (seen[`${kind}/${id}`] === m.hash) continue;
        try {
          await cache.add(new URL(m.path, REMOTE_BASE).href);
          seen[`${kind}/${id}`] = m.hash; this.#cache.delete(`${kind}/${id}`); changed.push(id);
        } catch (e) { console.info(`[content] failed to update ${id}:`, e.message); }
      }
    }
    if (changed.length) {
      await cache.put(new URL('manifest.json', REMOTE_BASE).href, new Response(JSON.stringify(remote), { headers: { 'content-type': 'application/json' } }));
      localStorage.setItem(LS_HASHES, JSON.stringify(seen));
      this.#manifest = remote;
      window.dispatchEvent(new CustomEvent('canisalus:content-updated', { detail: { changed } }));
    }
  }
}
