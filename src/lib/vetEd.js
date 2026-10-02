// Emergency vet list per K9 plus map hand-offs. Nothing here looks anything up:
// saved entries are the handler's own data, and the search links just open the
// phone's maps app (the app never reads location and sends nothing itself).
export const VERIFY_AFTER_DAYS = 180; // product default: how old a "last verified" date may be before we flag it

export const SEARCH_QUERY = '24 hour emergency veterinarian';

export function newVetEd() {
  return { id: globalThis.crypto?.randomUUID?.() ?? String(Date.now() + Math.random()),
    area: '', name: '', phone: '', address: '', verified: '', note: '' };
}

/** An entry is worth keeping if it has a name, phone or address. */
export const isUsableVetEd = e => [e?.name, e?.phone, e?.address].some(v => String(v ?? '').trim() !== '');

/** tel: link from free text. Drops anything after the first letter (extensions), keeps only digits and a leading +. */
export function telHref(phone) {
  const head = String(phone ?? '').split(/[a-zA-Z]/)[0].trim();
  const digits = head.replace(/\D/g, '');
  if (digits.length < 3) return null;
  return `tel:${head.startsWith('+') ? '+' : ''}${digits}`;
}

const enc = encodeURIComponent;

/** For unfamiliar territory: open the device's maps app searching for emergency vets near the user. */
export function searchLinks() {
  return {
    google: `https://www.google.com/maps/search/?api=1&query=${enc(SEARCH_QUERY)}`,
    apple: `https://maps.apple.com/?q=${enc(SEARCH_QUERY)}`,
  };
}

/** Directions to a saved ER. Needs an address: a name alone can resolve to a same-named clinic in another town. */
export function directionsLinks(ed) {
  const address = String(ed?.address ?? '').trim();
  if (!address) return null;
  const dest = [String(ed?.name ?? '').trim(), address].filter(Boolean).join(', ');
  return {
    google: `https://www.google.com/maps/dir/?api=1&destination=${enc(dest)}`,
    apple: `https://maps.apple.com/?daddr=${enc(dest)}`,
  };
}

/** 'unverified' (no or unusable date), 'stale' (older than VERIFY_AFTER_DAYS) or 'ok'. */
export function verifyState(ed, now = new Date()) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(ed?.verified ?? ''));
  if (!m) return 'unverified';
  const t = Date.UTC(+m[1], +m[2] - 1, +m[3]);
  if (Number.isNaN(t)) return 'unverified';
  const days = (Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) - t) / 86400000;
  if (days < 0) return 'unverified';
  return days > VERIFY_AFTER_DAYS ? 'stale' : 'ok';
}

/** Group saved ERs by area label (blank area -> 'Unlabeled'), keeping entry order. */
export function groupByArea(list) {
  const groups = new Map();
  for (const e of list ?? []) {
    const k = String(e.area ?? '').trim() || 'Unlabeled';
    if (!groups.has(k)) groups.set(k, []);
    groups.get(k).push(e);
  }
  return [...groups].map(([area, items]) => ({ area, items }));
}
