# Weight estimation

Module id: `weight-estimation`  |  Domain: foundations  |  Status: **draft**  |  Kind: clinical

> DRAFT for review. Nothing here is approved. Do not use for patient care.

## Why this matters

Every canine dose depends on body weight, and clinicians guess it poorly: only about a third to two-fifths of veterinary staff estimates fall within 10% of the true weight, while owners do much better [1][2].

## Claims that differ from human practice

- Ask the owner or handler for the weight. In an emergency room, 68% of owner estimates were within 10% of true weight, against 41% of attending clinicians and 35% of technicians and house officers [1].
- Clinician estimates get worse in big, heavy or long-coated dogs: estimators underestimated as dogs got heavier, and a longer coat reduced accuracy; only 32% of estimates in dogs were within 10% [2].

## Recognition

- Years of veterinary experience did not improve estimation accuracy [1].
- Veterinary professionals estimated large dogs more closely than small dogs [1].
- Estimates by veterinarians, nurses and students may be unreliable in the emergency department, especially in overweight animals [2].
- TODO: working dogs are often lean and muscular; no retrieved source gives estimation accuracy for working breeds or a field method (tape, body-size chart). Do not add a formula without a canine source.

## Management

- Prefer a measured weight; if none can be obtained quickly, ask the owner or handler [1][2].
- Any weight not measured on a scale must be treated as estimated. The dose engine already flags this (WEIGHT_ESTIMATED) and returns NEED_WEIGHT when no weight is entered.
- TODO: reviewer to decide the accuracy margin to display, and whether a handler's recorded kennel weight counts as measured.

## Sources

| # | Citation | Link status |
|---|----------|-------------|
| 1 | Blystone N et al. 2023. Pet owners provide a more reliable weight estimate for dogs compared to veterinary professionals in an emergency setting. J Am Vet Med Assoc. | record link (https://pubmed.ncbi.nlm.nih.gov/37495225/) |
| 2 | Wolf JM, Drobatz KJ. 2022. Body condition and hair coat length impact weight estimation in dogs and cats presented to an emergency department. J Am Vet Med Assoc. | record link (https://pubmed.ncbi.nlm.nih.gov/36563068/) |

## Open items (8)

- [ ] `content.recognition[4]`: TODO: working dogs are often lean and muscular; no retrieved source gives estimation accuracy for working breeds or a field method (tape, body-size chart). Do not add a formula without a canine source.
- [ ] `content.management[3]`: TODO: reviewer to decide the accuracy margin to display, and whether a handler's recorded kennel weight counts as measured.
- [ ] `lens.handler.transfer_trigger`: TODO: reviewer to set
- [ ] `lens.prehospital_als.transfer_trigger`: TODO: reviewer to set
- [ ] `lens.flight_cct.transfer_trigger`: TODO: reviewer to set
- [ ] `lens.human_ed.transfer_trigger`: TODO: reviewer to set
- [ ] `lens.vet_gp.transfer_trigger`: TODO: reviewer to set
- [ ] `lens.vet_ed.transfer_trigger`: TODO: reviewer to set

## Reviewer decisions

Approve / approve with changes / reject: ____________

Comments:


## Sign-off

| Role | Name | Credential | Date | Signature |
|------|------|------------|------|-----------|
| Veterinarian | | | | |
| Physician | | | | |

Approval requires both signatures, no open TODO, and every source resolved to a record link.
