# Structured vet handoff

Module id: `structured-vet-handoff`  |  Domain: handoff  |  Status: **draft**  |  Kind: clinical

> DRAFT for review. Nothing here is approved. Do not use for patient care.

## Why this matters

A dog moving from a handler or medic to a veterinarian needs the same structured handoff a person gets; no veterinary handoff study was retrieved, and human evidence for SBAR is only moderate [1].

## Claims that differ from human practice

- Canine handoffs must carry facts a human handoff does not: breed, measured or estimated weight, DEA 1 blood type if known, MDR1 status and the regular veterinarian, all of which change what the receiving vet can safely give.
- A systematic review of SBAR in human care found moderate evidence for improved patient safety, especially for telephone communication, but a lack of high-quality research (human data) [1].

## Recognition

- The app's handoff builder uses the SBAR order: Situation, Background (dog profile), Timeline and interventions, Assessment, Recommendation. This is a design choice, supported only by human data [1].
- Weight is marked ESTIMATED when it was not measured; blank fields print as not recorded rather than being guessed.
- TODO: veterinary evidence on handoff content (what emergency veterinarians say they need first), and a reviewer-approved minimum data set.

## Management

- Give the receiving veterinarian: what happened and when, every intervention and time, every drug given (including any human-labelled drug), weight and whether estimated, MDR1 and DEA 1 status, and the dog's regular veterinarian.
- TODO: HEMS and ground transport policy, loading and restraint of a working dog. No source retrieved for these; not started.

## Sources

| # | Citation | Link status |
|---|----------|-------------|
| 1 | Müller M et al. 2018. Impact of the communication and patient hand-off tool SBAR on patient safety: a systematic review (human data). BMJ Open. | record link (https://pubmed.ncbi.nlm.nih.gov/30139905/) |

## Open items (8)

- [ ] `content.recognition[3]`: TODO: veterinary evidence on handoff content (what emergency veterinarians say they need first), and a reviewer-approved minimum data set.
- [ ] `content.management[2]`: TODO: HEMS and ground transport policy, loading and restraint of a working dog. No source retrieved for these; not started.
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
