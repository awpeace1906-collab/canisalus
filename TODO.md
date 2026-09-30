# Running to-do list

Last updated: 2026-09-29 (citation waves 1-2: 19 sources resolved to PubMed records; ~70 remain). Owner column: **You** = needs Andrew, **Reviewer** = vet or physician, **Claude** = I can do it next.

## Blocked on you

| # | Item | Owner |
|---|------|-------|
| 1 | ~~Create `main`~~ done; draft PR opens once the branch has a commit beyond main | Claude |
| 2 | Allow `commons.wikimedia.org` and `upload.wikimedia.org` in the environment network settings so canine plates can be fetched | You |
| 3 | Allow `jsomonline.org`, `specialoperationsmedicine.org`, `learning-media.allogy.com`, `crisis-medicine.com`, `acvecc-recover.org`, or upload the K9TCCC 2023, K9-TECC and RECOVER 2024 PDFs | You |
| 4 | Approve the new **Pathophysiology: dog vs human** domain as an addition to the reviewer framework | You |
| 5 | Name vet and physician reviewers per domain | You |
| 6 | USPTO and App Store trademark check on CaniSalus | You |
| 7 | Decide: naloxone dose source for the app (vet reviewer picks; study doses are in `research/opioid-exposure.md`) | Reviewer |
| 8 | Decide: replace the "herding breed" tick with an explicit breed list for the MDR1 caution. Gramer 2010 breed allele frequencies are now in the MDR1 module to support it | Reviewer |
| 9 | Decide: trocar decompression scope at Tier 2 and Tier 3 (GDV) | Reviewer |
| 10 | Decide: the temperature at which to stop active cooling (heat stroke), with a source | Reviewer |
| 11 | Decide: human blood products and colloids as a bridge (framework open question; no source retrieved) | Reviewer |

## New reviewer decisions from batch 2

| # | Item | Owner |
|---|------|-------|
| 12 | Status epilepticus: benzodiazepine drug, route and dose for Tier 0 and ALS; is an atomizer realistic for a handler kit | Reviewer |
| 13 | Snake envenomation: field first aid, and a region setting so the right snake syndromes are shown | Reviewer, You |
| 14 | Chocolate: ingestion thresholds and decontamination window (only second-hand thresholds retrieved) | Reviewer |
| 15 | Grapes and raisins: how to word risk when the amount is unknown (early series vs 2019 series differ a lot) | Reviewer |
| 16 | Rodenticides: vitamin K1 route, dose, duration (retrieved sources conflict on IV safety) | Reviewer |
| 17 | Tension pneumothorax: is needle decompression in scope at Tier 1 to 3, and with what canine landmarks and equipment (no canine source found) | Reviewer |
| 18 | Hypothermia: definition thresholds and rewarming targets for dogs (only human and animal-model rewarming data found) | Reviewer |
| 20 | Cannabis: any role for CBD or lipid emulsion; ingestion thresholds; how a positive test is handled in a K9 unit | Reviewer, You |
| 21 | Stimulants: sedation, cooling and blood-pressure plan by tier (only case reports for methamphetamine) | Reviewer |
| 22 | Smoke: intubation triggers; whether the app mentions cyanide antidotes for dogs at all (no canine evidence) | Reviewer |
| 23 | Anaphylaxis: epinephrine dose and concentration by tier. Full text now read (PMC, open access): graded recommendations are in the module, but it states no treatment dose; study doses are in research/anaphylaxis.md | Reviewer |
| 24 | Hemoabdomen: what a non-veterinary clinician should do en route (no source found) | Reviewer |
| 19 | Exertional rhabdomyolysis and hypoglycemia: canine signs and treatment (two small studies, no treatment evidence) | Reviewer |

## In progress

- Nothing running. Batch 3 candidates are the unchecked items below.

## Next modules to research

Priority is working-dog relevance and how often the presentation occurs.

- [x] Status epilepticus (draft, dossier written)
- [x] Snake envenomation (draft, dossier written)
- [x] Chocolate and methylxanthines (draft, dossier written)
- [x] Grapes and raisins (draft, dossier written)
- [x] Anticoagulant rodenticides (draft, dossier written)
- [x] Exertional rhabdomyolysis (draft, thin evidence)
- [ ] Exertional hypoglycemia (no canine source retrieved; still a stub)
- [x] Tension pneumothorax (draft; no canine decompression evidence)
- [x] Hypothermia (draft; one veterinary review)
- [x] Canine normal vitals (draft, respiratory rate only; heart rate, temperature, CRT still TODO)
- [x] Weight estimation (draft, two sources; field method and margins TODO)
- [x] Smoke inhalation, CO and cyanide (two drafts)
- [x] Methamphetamine, cocaine, cannabis (duty toxicology; three drafts)
- [x] Anaphylaxis, hemoabdomen (drafts)
- [x] Pericardial effusion (draft, two sources)
- [x] Airway (draft, three sources; technique and scope TODO)
- [~] Burns (draft, thin evidence, two sources); blast, gunshot and stab wounds not started
- [~] Structured vet handoff (draft, human-data source only); HEMS policy, loading and restraint not started
- [ ] Pathophysiology gaps: respiratory and airway, coagulation, renal and acid-base, glucose, seizures

## Verification debt (Claude)

- [ ] Resolve remaining citations (~33 still carry search links; `npm run validate` lists them). Done so far: chocolate, grapes (Wegenast 2022 PMID still unresolved), cannabis (first author corrected to Amissah), 6 anaphylaxis and hemoabdomen sources. Wave 3 done (smoke, snake, seizures; Padula 2020 corrected to Finney, Bhatti to Kähn). Next waves: blood groups, rodenticides, stimulants, hypothermia, pneumothorax
- [ ] Read K9TCCC 2023, RECOVER 2024 and the 2026 RECOVER anaphylaxis first-aid guideline in full once reachable, then fill the numeric parameters marked `TODO`
- [ ] Fetch canine anatomy plates (tool built; needs host access)
- [x] Reviewer sign-off packets: `npm run packets` writes `docs/signoff/` (one page per drafted module, blank signature block). Regenerate after content changes
- [x] Gramer 2010 added to MDR1 module (breed allele frequencies; informs decision 8)

## Done

- [x] Repo created, package imported, standalone PWA on the Kairos pattern
- [x] Dossiers and cited draft content: heat stroke, GDV, opioids, MDR1, hemorrhage control, CPR
- [x] Pathophysiology domain with five compare-table modules
- [x] Plate registry, fetch tool, license and checksum gates
