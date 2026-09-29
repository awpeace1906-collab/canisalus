// Hash router (same as Kairos). The hash is the route, e.g. #/module/<id>.
export function createRouter(onRoute) {
  const current = () => decodeURIComponent(location.hash.replace(/^#/, '')) || '/';
  const go = path => (current() === path ? onRoute(path) : (location.hash = path));
  window.addEventListener('hashchange', () => onRoute(current()));
  return { current, go, start: () => onRoute(current()) };
}

/** match('/module/abc', '/module/:id') -> {id:'abc'} | null */
export function match(path, pattern) {
  const a = path.split('/').filter(Boolean), b = pattern.split('/').filter(Boolean);
  if (a.length !== b.length) return null;
  const params = {};
  for (let i = 0; i < b.length; i++) {
    if (b[i].startsWith(':')) params[b[i].slice(1)] = a[i];
    else if (a[i] !== b[i]) return null;
  }
  return params;
}
