# MDR1 (ABCB1) sensitivity (foundations)

Module: `content/modules/foundations/mdr1-abcb1-sensitivity.json`. Status: draft. Not reviewed.

## Evidence retrieved

| # | Source | Design | Rank | Level |
| --- | --- | --- | --- | --- |
| M1 | Firdova Z et al. 2016. Prevalence of the ABCB1:c.227_230delATAG mutation in affected dog breeds from European countries. *Res Vet Sci* | Genotyping survey, 4,729 dogs | 3 | abstract |
| M2 | Geyer J et al. 2005. Frequency of the nt230 (del4) MDR1 mutation in Collies and related breeds in Germany. *J Vet Pharmacol Ther* | Genotyping survey, 1,500 dogs | 3 | abstract |
| M3 | Polli M et al. 2020. Genotypic and allelic frequencies of the MDR1 gene in dogs in Italy. *Vet Rec Open* | Genotyping, 811 dogs, 32 breeds | 3 | abstract |
| M4 | Tappin SW et al. 2012. Frequency of the mutant MDR1 allele in dogs in the UK. *Vet Rec* | Genotyping survey | 3 | abstract (partial) |
| M5 | Palocz O et al. 2026. Association between the nt230(del4) mutation and c.-6-180T>G polymorphism in canine ABCB1. *Vet Med Int* | Genotyping, 263 dogs, 17 breeds | 3 | abstract |
| M6 | Nelson TS et al. 2025. Case report: adverse reaction to butorphanol in a Collie homozygous for ABCB1-1Δ. *Front Vet Sci* | Case report | 3 | abstract |
| M7 | Van Poucke M et al. 2009. ABCB1 (MDR1) deletion mutation in certain dog breeds in Belgium. *Vlaams Diergeneeskd Tijdschr* | Genotyping, 92 dogs | 3 | abstract |

## What the sources support

- **Mechanism (M2, M4, M5).** A 4-bp deletion in ABCB1 (MDR1) produces a nonfunctional P-glycoprotein. P-gp protects the blood-brain barrier, so affected dogs are more susceptible to neurotoxic effects of ivermectin, moxidectin and loperamide (M2); vincristine, doxorubicin, digoxin and mexiletine are also cited as P-gp substrates (M4).
- **Heterozygotes can be affected (M4).** Most dogs with adverse reactions are homozygous, but heterozygotes can be affected, and dose reductions have been suggested for both. *Cited second-hand in the M4 abstract; primary source not retrieved.*
- **Breeds carrying the mutation.** M1 (mutant allele frequency): Smooth Collie 58.5%, Rough Collie 48.3%, Australian Shepherd 35%, Shetland Sheepdog 30.3%, Silken Windhound 28.1%, Miniature Australian Shepherd 26.1%, Longhaired Whippet 24.3%, White Swiss Shepherd 16.2%, Border Collie 0% in that sample; Akita-Inu negative. M3 (Italy): found in 9 of 31 breeds, including Border Collie, Bearded Collie, Old English Sheepdog, Whippet and crossbreeds. M5: found only in collie-lineage breeds in that cohort. M7: not detected in German Shepherds or Border Collies in the Belgian sample. M4's abstract mentions later findings in German Shepherds and others (text truncated).
- **The mutation shows up in Border Collies in some populations and not others** (M1 0%; M3 and a Mexican cohort found it). Breed alone is therefore an imperfect proxy.
- **Opioid sensitivity is poorly understood (M6).** One Collie homozygous for the mutation had severe neurotoxicity (profound sedation, ataxia, hypersalivation, seizures) after a single 0.2 mg/kg butorphanol dose; metoclopramide and maropitant, also P-gp substrates, may have contributed. Recovery needed about 40 h of continuous naloxone.
- **Testing exists** (M2, M5): genotyping of the nt230(del4) deletion.

## Design note for the app (for reviewers and for Andrew)

The app currently uses a user-ticked **"herding breed"** flag plus MDR1 status (positive / negative / unknown) to raise `MDR1_CAUTION` on drugs marked `mdr1_caution`. Evidence retrieved suggests:
- Carrier breeds are collie-lineage herding breeds, but frequency varies widely between breeds and by country (M1, M3, M7).
- Many operational K9 breeds (for example Belgian Malinois, German Shepherds) are not the classic carriers. M7 did not detect the mutation in German Shepherds. M4's abstract says it was later found in German Shepherds. **The evidence I retrieved is inconsistent for German Shepherds, and I retrieved nothing on Belgian Malinois.**
- The safest reading is that "unknown status in a herding breed" is a reasonable trigger but should not be read as "other breeds are safe". Reviewer decision needed on wording.

## What changes from human (candidates)

1. Genetic drug sensitivity keyed to breed lineage has no human analogue in routine practice. A drug that is safe in most dogs can cause neurotoxicity in an MDR1-affected dog (M2, M6).
2. Status can be unknown. The profile field should be filled in ahead of time (K9 profile).

## Not retrieved

- The list of drugs that are P-gp substrates and warrant caution in dogs, beyond those named in the M2 and M4 abstracts. **The drug list that would set `mdr1_caution: true` must come from the reviewer or a pharmacology reference.**
- Any guidance on dose adjustment for heterozygotes.
- Breed-specific data for common working breeds.

## Questions for reviewers

- Vet: which working-dog breeds should prompt the caution when MDR1 status is unknown? Should the app replace the single "herding breed" tick with an explicit list?
- Vet: which emergency drugs should carry `mdr1_caution`?

## Proposed sources array (all `rank: 3`)

M1-M7, DOIs to be added.
