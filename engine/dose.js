// Canine dose engine. Guardrail: never returns a human dose, never computes
// from an unapproved or unsourced entry, never computes without a weight.

export const RESULT = Object.freeze({
  OK: 'OK',
  NO_CANINE_DOSE: 'NO_CANINE_DOSE',   // show: "No verified canine dose. Contact a veterinarian or animal poison control."
  NEED_WEIGHT: 'NEED_WEIGHT',
  NOT_AT_THIS_TIER: 'NOT_AT_THIS_TIER',
});

export function computeDose(drug, { indication, route, weightKg, weightEstimated = false, tierRank, tierRanks, mdr1 = 'unknown', herdingBreed = false }) {
  if (!drug || drug.species !== 'canine' || drug.status !== 'approved' || !Array.isArray(drug.canine_source) || drug.canine_source.length === 0) {
    return { result: RESULT.NO_CANINE_DOSE };
  }
  const ind = drug.indications.find(i => i.indication === indication && i.route === route);
  if (!ind || !ind.dose_mg_per_kg || typeof ind.dose_mg_per_kg.low !== 'number') {
    return { result: RESULT.NO_CANINE_DOSE };
  }
  if (!(typeof weightKg === 'number' && weightKg > 0)) return { result: RESULT.NEED_WEIGHT };
  if (ind.min_tier && tierRanks && typeof tierRank === 'number' && tierRank < tierRanks[ind.min_tier]) {
    return { result: RESULT.NOT_AT_THIS_TIER };
  }
  const high = typeof ind.dose_mg_per_kg.high === 'number' ? ind.dose_mg_per_kg.high : ind.dose_mg_per_kg.low;
  let lowMg = ind.dose_mg_per_kg.low * weightKg;
  let highMg = high * weightKg;
  let capped = false;
  if (typeof ind.max_dose_mg === 'number') {
    if (highMg > ind.max_dose_mg) { highMg = ind.max_dose_mg; capped = true; }
    if (lowMg > ind.max_dose_mg) { lowMg = ind.max_dose_mg; capped = true; }
  }
  const warnings = [];
  if (weightEstimated) warnings.push('WEIGHT_ESTIMATED');
  if (capped) warnings.push('MAX_DOSE_CAPPED');
  if (drug.mdr1_caution && (mdr1 === 'positive' || (mdr1 === 'unknown' && herdingBreed))) warnings.push('MDR1_CAUTION');
  (drug.human_product_hazards || []).forEach(h => warnings.push('HUMAN_PRODUCT_HAZARD: ' + h));
  const out = { result: RESULT.OK, lowMg, highMg, warnings };
  if (ind.concentration_mg_per_ml) {
    out.lowMl = lowMg / ind.concentration_mg_per_ml;
    out.highMl = highMg / ind.concentration_mg_per_ml;
  }
  return out;
}

