// SBAR-style handoff text from the K9 profile plus a free-text timeline.
const line = (label, v) => (v === '' || v == null ? `${label}: not recorded` : `${label}: ${v}`);

export function buildHandoff({ dog, tierLabel, situation = '', timeline = '', assessment = '', now = new Date() }) {
  const out = [];
  out.push(`K9 HANDOFF (SBAR)  ${now.toISOString().slice(0, 16).replace('T', ' ')} UTC`);
  out.push(`Handing off from: ${tierLabel}`);
  out.push('', 'S - SITUATION', situation.trim() || 'not recorded');
  out.push('', 'B - BACKGROUND');
  if (dog) {
    out.push(line('Name', dog.name), line('Breed', dog.breed));
    out.push(dog.weightKg != null ? `Weight: ${dog.weightKg} kg${dog.weightEstimated ? ' (ESTIMATED)' : ''}` : 'Weight: not recorded');
    out.push(line('DEA 1 type', dog.dea1), `MDR1: ${dog.mdr1}${dog.mdr1 === 'unknown' && dog.herdingBreed ? ' (herding breed)' : ''}`);
    out.push(line('Current meds', dog.meds), line('Baseline labs', dog.baselineLabs));
    out.push(line('Veterinarian', [dog.vetName, dog.vetPhone].filter(Boolean).join(', ')));
  } else out.push('No K9 profile selected.');
  out.push('', 'Timeline and interventions', timeline.trim() || 'not recorded');
  out.push('', 'A - ASSESSMENT', assessment.trim() || 'not recorded');
  out.push('', 'R - RECOMMENDATION', 'Continue care and definitive treatment by a veterinarian. Local veterinary protocol overrides this summary.');
  return out.join('\n');
}
