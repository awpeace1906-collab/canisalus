// Durable, on-device state (survives closeout). Nothing leaves the device.
// Works without localStorage (private mode, tests): falls back to memory.
const KEY = 'canisalus.prefs.v1';
let mem = {};

// Accessing localStorage can throw (blocked site data) or be absent; either way fall back to memory.
const store = () => { try { return globalThis.localStorage ?? null; } catch { return null; } };

function readAll() {
  const ls = store();
  if (!ls) return { ...mem };
  try { return JSON.parse(ls.getItem(KEY) || '{}'); } catch { return { ...mem }; }
}
function writeAll(obj) {
  mem = obj;
  try { store()?.setItem(KEY, JSON.stringify(obj)); } catch { /* memory only */ }
}

export const prefs = {
  get(key, fallback = null) { const v = readAll()[key]; return v === undefined ? fallback : v; },
  set(key, value) {
    const all = readAll();
    if (value === null || value === undefined) delete all[key]; else all[key] = value;
    writeAll(all);
  },
  clearAll() { writeAll({}); },
};

export const onboarded = () => prefs.get('onboarded', false) === true;
export const finishOnboarding = tierId => { if (tierId) setTier(tierId); prefs.set('onboarded', true); };

export const activeTierId = defaultId => prefs.get('tier', defaultId);
/** Changing tier resets site-capability overrides to that tier's defaults. */
export function setTier(id) { prefs.set('tier', id); prefs.set('flagOverrides', null); }

export const flagOverrides = () => prefs.get('flagOverrides', {});
export function setFlagOverride(flag, value) {
  const o = { ...flagOverrides() };
  if (value === null) delete o[flag]; else o[flag] = value;
  prefs.set('flagOverrides', Object.keys(o).length ? o : null);
}

export function applyTheme(theme = prefs.get('theme', 'system')) {
  const root = globalThis.document?.documentElement;
  if (!root) return;
  if (theme === 'light' || theme === 'dark') root.dataset.theme = theme; else delete root.dataset.theme;
}
