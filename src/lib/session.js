// Scratch state that survives backgrounding but not a real closeout (same lifecycle as Kairos).
const KEY = 'canisalus.session.v1';
let mem = {};
const store = () => { try { return globalThis.sessionStorage ?? null; } catch { return null; } };
const readAll = () => {
  const s = store();
  if (!s) return { ...mem };
  try { return JSON.parse(s.getItem(KEY) || '{}'); } catch { return { ...mem }; }
};
const writeAll = o => { mem = o; try { store()?.setItem(KEY, JSON.stringify(o)); } catch { /* memory only */ } };

export const session = {
  get(route) { return readAll()[route] || {}; },
  patch(route, partial) { const all = readAll(); all[route] = { ...(all[route] || {}), ...partial }; writeAll(all); return all[route]; },
  clearScreen(route) { const all = readAll(); delete all[route]; writeAll(all); },
  clearAll() { writeAll({}); },
};
