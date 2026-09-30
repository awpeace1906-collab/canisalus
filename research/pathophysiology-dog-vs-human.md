# Pathophysiology: dog vs human (reference and contrast)

Domain: `pathophysiology` (new; not in the reviewer framework's nine domains, so it needs reviewer sign-off as an addition).
Modules: `content/modules/pathophysiology/*.json`. All `draft`. Not reviewed.

## Purpose

Two uses, per the product brief: (1) a reference for how canine physiology works, and (2) a contrast-and-compare aid so a human-trained clinician can see where their instincts stop applying. Each module carries a **Dog vs human** table. Each row has a human statement, a canine statement with numbered source references, and "what changes".

## Method and honesty rules

- The **canine** side of every row is drawn from a retrieved abstract, and its numbers are as stated in that abstract.
- The **human** side is marked `general-medical-knowledge` unless a retrieved source states it, in which case it is `cited`. The physician reviewer confirms every `general-medical-knowledge` cell at sign-off.
- No dose appears in any compare row. The validator rejects dose-like figures (mg/kg etc.) in compare text.
- Numeric toxic-ingestion thresholds (for example xylitol) are kept out of the module and listed below for reviewers to decide.

## What is covered

| Module | Rows | Strongest contrast |
| --- | --- | --- |
| Thermoregulation and heat dissipation | 5 | Panting, not sweating, is the main cooling route |
| Hemorrhagic shock and the canine spleen | 5 | A contractile spleen can hide early blood loss; hemoglobin may not fall |
| Blood groups and transfusion | 4 | No natural anti-DEA 1 antibodies, but sensitization within days |
| Cardiac rhythm and sinus arrhythmia | 3 | Large respiratory sinus arrhythmia is normal at rest |
| Drug metabolism and toxic mechanisms | 4 | Xylitol and acetaminophen behave differently in dogs |

## Not covered yet (needs research and a reviewer)

Respiratory anatomy and physiology (upper airway, brachycephalic breeds), coagulation and DIC differences, renal and acid-base differences, glucose regulation in working dogs (exertional hypoglycemia), seizure physiology, chocolate/methylxanthines, grapes and raisins, NSAID toxicosis, canine normal vital-sign ranges (no source retrieved; the `canine-normal-vitals` module has none), and canine neonatal physiology.

## Extra findings that did not go in a module (reviewer decisions)

- **Xylitol ingestion thresholds** (Campbell 2010 abstract, Vet Rec, retrieval link only): hypoglycemia has been reported with ingestion above 0.1 g/kg, and dogs ingesting above 0.5 g/kg are at risk of hepatotoxicosis; severity of hepatotoxicity may be idiosyncratic. Decide whether an ingestion threshold belongs in the app.
- **Hypoglycemia can be delayed after xylitol gum** (Bates 2019, retrieval link only). Included in the module without a number.
- **Additional MDR1 breed evidence:** Gramer 2010 (Vet J, doi 10.1016/j.tvjl.2010.06.012) screened 7,378 dogs in Germany and did not detect the mutation in Bearded Collie, Anatolian Shepherd, Greyhound, Belgian Tervuren, Kelpie, Borzoi, Australian Cattle Dog or Irish Wolfhound, and found allele frequencies of 59% (Collie), 30% (Shetland Sheepdog) and 1% (Border Collie). Not yet added to the MDR1 module's sources.
- **Human blood products in dogs** (a framework open question): no retrieved source addresses it. The blood-groups module says only what canine sources support.
- **Hemostatic resuscitation** is proposed for dogs by review articles (Edwards 2021 Transfusion; Hall and Drobatz 2021) but explicitly flagged as needing more work.

## Citation status

Verified to a DOI or PubMed record against PubMed metadata: the citations with `https://doi.org/` or `pubmed.ncbi.nlm.nih.gov` URLs. Two retrieval-tool authorship errors were caught and corrected during verification (the Italian MDR1 survey is Marelli et al., and the mitral-valve RSA study is Baisan et al.). **Sixteen citations still carry a retrieval link** (Van Poucke 2009, Ramos 2023 abstract, Gavazza 2017, Baran 2018, Spada 2017, Guidetti 2019, Martinez 2021, Bates 2019, Mealey 2019 chapter, Edwards 2021 Transfusion, Pottecher 2013 letter, Bar-Joseph 1985, Robertshaw 2006, Goldberg 1981, Blatt 1972, Russo 2024). Their author and year details are unverified against PubMed. `npm run validate` warns on them, and blocks approval of any module that still has one.

## Respiratory mechanics and oxygen transport (added 2026-09-30)

New compare module `respiratory-mechanics-and-oxygen-transport`. Sources: Clerbaux 1993 (oxygen dissociation curve, man vs dog, 4 species; abstract level), von Recum 1977 (39 dogs, mediastinum), Boysen 2019 (6 dogs, bilateral pneumothorax), Thawley 2026 (oxygen target).
- **Contested point:** the widely taught idea that a dog's two pleural cavities communicate is *not* settled. The only experiment retrieved says disease stays in one cavity unless the mediastinum is injured; a small clinical series found bilateral pneumothorax in 5 of 6 dogs. The module presents both and asserts neither.
- **Not used:** two PubMed hits on collateral ventilation (Port 1977, Leakakos 1994) say nothing specific about dogs in their abstracts. Collateral ventilation in dogs remains unsourced.
- **Gaps:** panting mechanics beyond the thermoregulation module, brachycephalic airway physiology, lung volumes and compliance.
