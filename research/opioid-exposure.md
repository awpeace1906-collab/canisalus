# Opioids including fentanyl (tox-duty / reversible)

Module: `content/modules/tox-duty/opioids-including-fentanyl.json` and drug `content/drugs/naloxone.json`. Status: draft. Not reviewed.

**Dose policy.** Several canine studies below report naloxone doses. They are recorded so reviewers can see what exists. **They are study conditions, not recommendations, and none has been entered into `naloxone.json`.** The drug file stays `dose_mg_per_kg: null` until a vet reviewer selects a source and signs off.

## Evidence retrieved

| # | Source | Design | Rank | Level |
| --- | --- | --- | --- | --- |
| O1 | Palmer L et al. 2017. Clinical update: the risk of opioid toxicity and naloxone use in operational K9s. *J Spec Oper Med* | Clinical update | 2/3 | abstract |
| O2 | Wahler BM et al. 2019. Pharmacokinetics and pharmacodynamics of intranasal and intravenous naloxone in healthy dogs. *Am J Vet Res* | Blinded crossover, 6 dogs | 3 | abstract |
| O3 | Mills T et al. 2025. Naloxone, naltrexone and nalmefene in methadone-sedated working dogs. *J Vet Pharmacol Ther* | Randomized blinded placebo-controlled crossover, 8 working dogs | 3 | abstract |
| O4 | Freise KJ et al. 2012. Naloxone reversal of an overdose of a long-acting transdermal fentanyl solution in laboratory Beagles. *J Vet Pharmacol Ther* | Randomized, 24 Beagles | 3 | abstract |
| O5 | Essler JL et al. 2021. First responder exposure to contaminating powder on dog fur during intranasal and intramuscular naloxone administration. *J Vet Emerg Crit Care* | Prospective crossover, 10 dogs | 3 | abstract |
| O6 | Essler JL et al. 2019. IM versus IN naloxone reversal of IV fentanyl on odor detection in working dogs. *Animals* | Randomized crossover | 3 | abstract |
| O7 | Voronkov M et al. 2025. Is fentanyl rebound an intrinsic feature of naloxone reversal? *Pharmaceuticals* | PK crossover in fentanyl-sedated dogs | 3 | abstract |
| O8 | Nelson TS et al. 2025. Case report: adverse reaction to butorphanol in a Collie homozygous for ABCB1-1Δ (MDR1). *Front Vet Sci* | Case report | 3 | abstract |

## What the sources support

- **Hazard (O1).** Illicit opioids (fentanyl, carfentanil) endanger operational K9s of all disciplines. The most serious effect is respiratory depression, up to respiratory arrest. Naloxone is the antidote in humans and operational K9s.
- **Signs (O4).** In a dog overdose model: excessive sedation, bradycardia, hypothermia. Naloxone raised body temperature and heart rate.
- **Renarcotization is real (O4, O7).** In O4, narcotic effects returned within 1-3 h after hourly naloxone regimens stopped (long-acting transdermal fentanyl). O7: delay in re-sedation correlated with naloxone exposure.
- **Intranasal naloxone is absorbed in dogs (O2).** A 4 mg fixed-dose atomizer (mean 0.17 mg/kg) was well absorbed after a 2.3 min lag; Tmax 22.5 min; bioavailability 32 ± 13%; no notable changes in behavior or heart/respiratory rate in healthy dogs. IV was 0.04 mg/kg. The authors call for studies of efficacy and effective doses in intoxicated dogs, so **efficacy of IN naloxone in opioid-poisoned dogs is not established by this paper.**
- **Reversal agents work in sedated working dogs (O3).** With IV methadone 1 mg/kg, naloxone, naltrexone or nalmefene at 0.1 mg/kg IM lowered sedation scores within 5 minutes and reversal was maintained for the study. The authors say the findings cannot be interpreted for fentanyl and higher-potency opioids.
- **Responder contamination risk (O5).** Both IN and IM naloxone delivery contaminated responders with simulated powder; IN more, especially on the chest. The authors recommend PPE and decontamination after treatment.
- **Olfaction (O6).** No detectable effect of fentanyl sedation and naloxone reversal on odor detection in the study dogs, and no IN vs IM difference. *Return-to-work decision is not addressed by one small study.*
- **Study doses as reported, for reviewer reference only.** O2: 4 mg IN (about 0.17 mg/kg), 0.04 mg/kg IV. O3: 0.1 mg/kg IM. O4: 40 or 160 µg/kg IM hourly for 8 h after a fivefold overdose of transdermal fentanyl solution in Beagles; the 160 µg/kg regimen had nearly threefold lower odds of sedation.
- **MDR1 overlap (O8).** A Collie homozygous for ABCB1-1Δ had severe neurotoxicity after 0.2 mg/kg butorphanol and needed about 40 h of continuous naloxone. See `mdr1-abcb1.md`.

## What changes from human (candidates)

1. Naloxone has been studied at mg/kg doses in dogs, with weight-based dosing, and a fixed 4 mg intranasal device delivered about 0.17 mg/kg in 6 healthy dogs (O2). A human clinician's habit of a fixed device dose does not transfer directly. **Reviewer decision needed.**
2. Renarcotization should be expected and monitoring must continue after reversal (O4, O7).
3. Decontaminate the dog and protect the responder (O5).

## Not retrieved

- K9TCCC or other guideline text on opioid exposure. O1 was seen only as an abstract.
- Any evidence on intranasal naloxone efficacy in real opioid-poisoned dogs, or on dosing in dogs for fentanyl analogs and carfentanil.
- Xylazine co-exposure in dogs.
- Methamphetamine, cocaine and cannabis evidence for the other tox-duty modules (not yet searched).

## Questions for reviewers

- Vet: which canine source, if any, should support an IN and an IV naloxone dose for the app? Is O2 an adequate basis for a handler (Tier 0) intranasal dose given its authors' own caveat?
- Vet and physician: repeat-dose criteria and observation period after reversal.
- Physician: is a section on responder PPE and decontamination in scope for this audience? O5 suggests yes.

## Proposed sources array (all `rank: 3` unless a reviewer re-ranks O1 to 2)

O1-O8, DOIs to be added.

## RECOVER 2026 first-aid guideline (naloxone, section 3.9) read in full text (added 2026-09-30)

Thawley 2026, JVECC 36 Suppl 1 (PMID 42640821, PMC13505872). Recommendations copied into the module: naloxone IN or IM for altered mentation or respiratory rate below 10 per minute when opioid exposure is suspected (strong, low quality); BLS first if apneic or agonal; IN or IM when no vascular access (weak, low quality); none if rescuer risk is high.
The recommendations state **no dose**. Dose information in the text, for the vet reviewer only and not adopted: Barr et al. gave working dogs a sedative dose of fentanyl (0.3 mg IV) and found IN or IM naloxone 4 mg reversed sedation within 5 minutes; respiratory depression was not assessed.
