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

## Coagulation and bleeding disorders (added 2026-09-30)

New compare module `coagulation-and-bleeding-disorders`. Sources: Zdenek 2020 (in vitro procoagulant venoms on dog, cat and human plasma; abstract level), Mattoso 2010 (vWD prevalence, 350 dogs, Brazil), and two case reports (Conti-Patara 2020, Kochi 2021) used only for the breed and clinical illustration.
- **Weak spots:** the vWD prevalence is one regional survey of mixed breeds; the Doberman prevalence statement comes from a case report's conclusion, not a survey. Neither gives breed-specific numbers.
- **Searches that returned nothing usable:** reference intervals and thromboelastography in healthy dogs vs humans; canine platelet function and aspirin or clopidogrel species differences; a general canine-vs-human hemostasis review.
- **Gaps:** canine hemophilia, platelet function, fibrinolysis and hypercoagulability in dogs, and DIC. Reviewers should nominate a comparative hemostasis review.

## Blood chemistry and acid-base reference ranges (added 2026-09-30)

New module `blood-chemistry-and-acid-base-reference-ranges`, planned as "renal and acid-base". The evidence retrieved supports reference-range interpretation, not a kidney comparison, so it was scoped that way.
Sources (abstract level): O'Brien 2014 (68 puppies), Mesa-Sanchez 2012 (Galgo Espanol), Bachmann 2018 (tube vs syringe, 51 dogs), Vanova-Uhrikova 2017 (224 healthy dogs; the abstract gives no numbers, so none are entered).
- **Not used:** Kokubo 1984 (renal inner medulla histology of man, swine, dog, hamster; correlates with concentrating ability but states no clear dog-vs-human result), Shaw 1989 (ammonium chloride acid load; a diagnostic test dose, not a field topic).
- **Gaps:** dog vs human kidney physiology (concentrating ability, GFR, creatinine), renal toxin handling, and actual canine reference numbers.

## Blood glucose in the sick dog (added 2026-09-30)

New module `blood-glucose-in-the-sick-dog`. Sources (abstract level): Hagley 2020 (660 ER dogs), Parratt 2018 (386 coma or stupor animals, 168 dogs), Verkinderen 2025 (49 dogs with insulin-induced hypoglycemic seizures).
- **Scope:** the retrievable dog evidence is clinical epidemiology, not a physiological dog-vs-human comparison. The human column is general knowledge and flagged as such. Study cut-offs (80 and 120 mg/dL) are study definitions, not reference ranges.
- **Seen, not used:** a 2026 review of pancreatic nerves across species (PMID 42626230; says canine pancreatic nerve organization resembles humans but differs in fiber type proportions; too general), xylitol and mushroom toxicosis papers that mention hypoglycemia (covered in toxicology modules).
- **Gaps:** canine glucose reference values, working-dog exertional and fasting glucose (two searches returned nothing), and dog-vs-human counter-regulation.
