// K9 profiles. Stored on-device only (via prefs). Feed the dose engine and the handoff.
import { prefs } from './prefs.js';
import { isUsableVetEd } from './vetEd.js';

export const MDR1 = ['unknown', 'negative', 'positive'];

export function newDog() {
  return {
    id: globalThis.crypto?.randomUUID?.() ?? String(Date.now()),
    name: '', weightKg: null, weightEstimated: false,
    breed: '', herdingBreed: false, dea1: '', mdr1: 'unknown',
    meds: '', baselineLabs: '', vetName: '', vetPhone: '',
    vetEds: [], // saved 24/7 emergency vets by area (see vetEd.js)
  };
}

export const listDogs = () => prefs.get('dogs', []);
export const activeDogId = () => prefs.get('activeDogId', null);
export const getDog = id => listDogs().find(d => d.id === id) ?? null;
export const activeDog = () => getDog(activeDogId());

export function saveDog(dog) {
  const dogs = listDogs();
  const clean = { ...dog, weightKg: dog.weightKg > 0 ? Number(dog.weightKg) : null, vetEds: (dog.vetEds ?? []).filter(isUsableVetEd) };
  prefs.set('dogs', dogs.some(d => d.id === clean.id) ? dogs.map(d => d.id === clean.id ? clean : d) : [...dogs, clean]);
  if (!activeDogId()) prefs.set('activeDogId', clean.id);
}
export function deleteDog(id) {
  const dogs = listDogs().filter(d => d.id !== id);
  prefs.set('dogs', dogs);
  if (activeDogId() === id) prefs.set('activeDogId', dogs[0]?.id ?? null);
}
export const setActiveDog = id => prefs.set('activeDogId', id);
