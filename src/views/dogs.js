import { el, card, back, field, input } from '../components.js';
import { vetEdEditor } from './vetEd.js';
import { listDogs, getDog, newDog, saveDog, deleteDog, activeDogId, setActiveDog, MDR1 } from '../lib/dogs.js';

export function renderDogs(rerender) {
  const dogs = listDogs(), active = activeDogId();
  return el('div', { class: 'detail' }, back('#/', 'Home'), el('h1', {}, 'K9 profiles'),
    el('p', { class: 'muted small' }, 'Stored on this device only. The active K9 feeds the dose calculator and the handoff.'),
    dogs.length === 0 && card(null, el('p', {}, 'No K9 profiles yet.')),
    el('ul', { class: 'list' }, dogs.map(d => el('li', {},
      el('label', { class: 'choice' }, el('input', { type: 'radio', name: 'active', checked: d.id === active, onChange: () => { setActiveDog(d.id); rerender(); } }),
        el('span', {}, el('strong', {}, d.name || 'Unnamed'), el('span', { class: 'muted small' }, ` ${d.weightKg != null ? `${d.weightKg} kg${d.weightEstimated ? ' est.' : ''}` : 'no weight'}`))),
      el('a', { href: `#/dogs/${d.id}` }, 'Edit')))),
    el('a', { class: 'button primary', href: `#/dogs/${newDog().id}` }, 'Add K9'));
}

export function renderDogEditor(id, go) {
  const existing = getDog(id);
  const d = existing ? { ...existing } : { ...newDog(), id };
  const set = (k, transform = v => v) => v => { d[k] = transform(v); };
  const select = (opts, value, onChange) => el('select', { onChange: e => onChange(e.target.value) }, opts.map(o => el('option', { value: o, selected: o === value }, o[0].toUpperCase() + o.slice(1))));
  const check = (label, k) => el('label', { class: 'choice' }, el('input', { type: 'checkbox', checked: d[k], onChange: e => { d[k] = e.target.checked; } }), el('span', {}, label));

  return el('form', { class: 'detail', onSubmit: e => { e.preventDefault(); saveDog(d); go('/dogs'); } },
    back('#/dogs', 'K9 profiles'), el('h1', {}, existing ? d.name || 'K9' : 'New K9'),
    field('Name', input({ value: d.name, required: true, onInput: set('name') })),
    field('Weight (kg)', input({ type: 'number', value: d.weightKg ?? '', min: 0, step: 0.1, onInput: set('weightKg', v => v === '' ? null : Number(v)) })),
    check('Weight is estimated', 'weightEstimated'),
    field('Breed', input({ value: d.breed, onInput: set('breed') })),
    check('Herding breed (matters when MDR1 status is unknown)', 'herdingBreed'),
    field('DEA 1 blood type', input({ value: d.dea1, onInput: set('dea1') })),
    field('MDR1 status', select(MDR1, d.mdr1, v => { d.mdr1 = v; })),
    field('Current medications', input({ rows: 2, value: d.meds, onInput: set('meds') })),
    field('Baseline labs', input({ rows: 2, value: d.baselineLabs, onInput: set('baselineLabs') })),
    field('Veterinarian', input({ value: d.vetName, onInput: set('vetName') })),
    field('Veterinarian phone', input({ type: 'tel', value: d.vetPhone, onInput: set('vetPhone') })),
    vetEdEditor(d),
    el('div', { class: 'row' },
      el('button', { class: 'primary', type: 'submit' }, 'Save'),
      existing && el('button', { type: 'button', class: 'danger', onClick: () => { if (confirm(`Delete ${d.name || 'this K9'}?`)) { deleteDog(d.id); go('/dogs'); } } }, 'Delete')));
}
