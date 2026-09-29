// Dose UI adapter. ALL dose maths lives in engine/dose.js (the guarded engine).
// Never compute or default a dose in view code.
import { computeDose, RESULT } from '../../engine/dose.js';

export { RESULT };
export const NO_CANINE_DOSE_COPY = 'No verified canine dose. Contact a veterinarian or animal poison control.';

export function doseFor({ drug, indication, route, dog, weightOverrideKg = null, tier, tierRanks }) {
  const weightKg = weightOverrideKg ?? dog?.weightKg ?? undefined;
  return computeDose(drug, {
    indication, route,
    weightKg,
    weightEstimated: weightOverrideKg != null ? true : dog?.weightEstimated ?? false,
    tierRank: tier.rank, tierRanks,
    mdr1: dog?.mdr1 ?? 'unknown',
    herdingBreed: dog?.herdingBreed ?? false,
  });
}

export const WARNING_COPY = {
  WEIGHT_ESTIMATED: 'Weight is estimated. Recheck against a measured weight as soon as possible.',
  MAX_DOSE_CAPPED: 'Capped at the maximum dose for this drug.',
  MDR1_CAUTION: 'MDR1 caution: this dog is MDR1-positive, or its status is unknown in a herding breed. Confirm with a veterinarian.',
};
const HAZ = 'HUMAN_PRODUCT_HAZARD: ';
export const warningText = w => w.startsWith(HAZ) ? `Human product hazard: ${w.slice(HAZ.length)}` : WARNING_COPY[w] ?? w;
