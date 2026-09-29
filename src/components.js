// Small DOM helpers (Kairos pattern: no framework).
export function el(tag, props = {}, ...children) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(props)) {
    if (k === 'class') node.className = v;
    else if (k.startsWith('on') && typeof v === 'function') node.addEventListener(k.slice(2).toLowerCase(), v);
    else if (k === 'value') node.value = v ?? '';
    else if (k === 'checked') node.checked = !!v;
    else if (v != null && v !== false) node.setAttribute(k, v === true ? '' : v);
  }
  return mount(node, ...children);
}

/** Append children, skipping null/false/undefined. */
export function mount(parent, ...children) {
  for (const c of children.flat(Infinity)) {
    if (c == null || c === false || c === true) continue;
    parent.append(c.nodeType ? c : document.createTextNode(String(c)));
  }
  return parent;
}

export const card = (title, body, tone) => el('section', { class: `card ${tone ?? ''}` }, title && el('h2', {}, title), body);
export const list = items => el('ul', {}, items.map(i => el('li', {}, i)));
export const banner = (text, tone = 'warn') => el('p', { class: `banner ${tone}` }, text);
export const back = (href, label) => el('a', { href, class: 'back' }, `‹ ${label}`);
export const bridgeLine = () => el('p', { class: 'muted small' }, 'A bridge to veterinary care, not a replacement. Local veterinary protocol always overrides this app.');

export function field(label, control, hint) {
  return el('label', { class: 'field' }, el('span', { class: 'field-label' }, label), control, hint && el('span', { class: 'muted small' }, hint));
}

/** Labeled input/textarea/select with a change callback. */
export function input({ type = 'text', value = '', rows, onInput, ...rest }) {
  const tag = rows ? 'textarea' : 'input';
  return el(tag, { type: rows ? null : type, rows, value, inputmode: type === 'number' ? 'decimal' : null, onInput: e => onInput?.(e.target.value), ...rest });
}

export function moduleList(entries) {
  if (!entries.length) return el('p', { class: 'muted' }, 'No released modules here yet.');
  return el('ul', { class: 'list' }, entries.map(e => el('li', {}, el('a', { href: `#${e.route}` }, e.title), e.status !== 'approved' && el('span', { class: 'badge' }, e.status))));
}
