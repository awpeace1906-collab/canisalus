import { el, card, back, banner, field, input } from '../components.js';
import { activeDog } from '../lib/dogs.js';
import { activeTierId } from '../lib/prefs.js';
import { doseFor, RESULT, NO_CANINE_DOSE_COPY, warningText } from '../lib/dose.js';
import { session } from '../lib/session.js';

const fmt = n => String(Number(n.toPrecision(3)));
const range = (lo, hi, unit) => `${fmt(lo)}${hi !== lo ? `–${fmt(hi)}` : ''} ${unit}`;

/** Calls computeDose (via lib/dose.js) only. Renders every RESULT state and warning. */
export function renderDose(store, drugs) {
  if (!drugs.length) return el('div', { class: 'detail' }, back('#/', 'Home'), el('h1', {}, 'Dose'), card(null, el('p', {}, el('strong', {}, NO_CANINE_DOSE_COPY)), 'warn'));

  const S = session.get('/dose');
  let drugIdx = Math.min(S.drug ?? 0, drugs.length - 1), indIdx = S.ind ?? 0, manual = S.manual ?? '';
  const out = el('div', {});
  const tier = store.tier(activeTierId(store.environments.default_tier));

  const renderResult = () => {
    session.patch('/dose', { drug: drugIdx, ind: indIdx, manual });
    const drug = drugs[drugIdx], ind = drug.indications[indIdx], dog = activeDog();
    const kg = manual !== '' && Number(manual) > 0 ? Number(manual) : null;
    const r = doseFor({ drug, indication: ind.indication, route: ind.route, dog, weightOverrideKg: kg, tier, tierRanks: store.tierRanks });
    out.replaceChildren(card('Result', [
      r.result === RESULT.NO_CANINE_DOSE && el('p', {}, el('strong', {}, NO_CANINE_DOSE_COPY)),
      r.result === RESULT.NEED_WEIGHT && el('p', {}, el('strong', {}, 'Weight required. '), 'Enter a weight or add one to the K9 profile. No weight, no dose.'),
      r.result === RESULT.NOT_AT_THIS_TIER && el('p', {}, el('strong', {}, 'Not for your setting. '), 'Hand this to the next level of care.'),
      r.result === RESULT.OK && [el('p', { class: 'dose' }, range(r.lowMg, r.highMg, 'mg')), r.lowMl != null && el('p', {}, range(r.lowMl, r.highMl, 'mL')), ind.repeat && el('p', {}, `Repeat: ${ind.repeat}`)],
      (r.warnings ?? []).map(w => banner(warningText(w))),
    ], r.result === RESULT.OK ? '' : 'warn'));
  };

  const indSelect = el('select', { onChange: e => { indIdx = Number(e.target.value); renderResult(); } });
  const fillInds = () => indSelect.replaceChildren(...drugs[drugIdx].indications.map((i, k) => el('option', { value: k, selected: k === indIdx }, `${i.indication} (${i.route})`)));
  fillInds();
  const dog = activeDog();
  renderResult();
  return el('div', { class: 'detail' }, back('#/', 'Home'), el('h1', {}, 'Dose'),
    el('p', { class: 'muted small' }, 'Canine doses only, from a reviewed veterinary source. Never substitute a human dose.'),
    field('Drug', el('select', { onChange: e => { drugIdx = Number(e.target.value); indIdx = 0; fillInds(); renderResult(); } },
      drugs.map((d, k) => el('option', { value: k, selected: k === drugIdx }, d.name)))),
    field('Indication and route', indSelect),
    el('p', {}, dog ? ['K9: ', el('strong', {}, dog.name), ` ${dog.weightKg != null ? `${dog.weightKg} kg${dog.weightEstimated ? ' (estimated)' : ''}` : '(no weight on profile)'}`] : 'No K9 profile selected.'),
    field('Weight override (kg, treated as estimated)', input({ type: 'number', min: 0, step: 0.1, value: manual, onInput: v => { manual = v; renderResult(); } })),
    out);
}
