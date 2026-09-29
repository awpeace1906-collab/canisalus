# MDR1 (ABCB1) sensitivity

Module id: `mdr1-abcb1-sensitivity`  |  Domain: foundations  |  Status: **draft**  |  Kind: clinical

> DRAFT for review. Nothing here is approved. Do not use for patient care.

## Why this matters

Some dogs, especially collie-lineage herding breeds, carry a gene mutation that lets drugs reach the brain, so a drug that is safe in most dogs can cause neurotoxicity [2][4].

## Claims that differ from human practice

- Breed lineage can predict drug neurotoxicity: a drug that is safe in most dogs can poison an MDR1-affected dog [2][7].
- MDR1 status can be tested by genotyping, so record it in the K9 profile ahead of time [2][5].

## Recognition

- A 4-base-pair deletion in ABCB1 (MDR1) produces a nonfunctional P-glycoprotein at the blood-brain barrier. Affected dogs are more susceptible to neurotoxic effects of ivermectin, moxidectin and loperamide [2][4].
- Most dogs with adverse reactions are homozygous, but heterozygotes can be affected [4].
- Mutant allele frequency varies by breed and country. In one European survey: Smooth Collie 58.5%, Rough Collie 48.3%, Australian Shepherd 35%, Shetland Sheepdog 30.3%; Border Collie 0% in that survey [1]. The mutation was found in Border Collies in an Italian survey [3].
- German Shepherd findings conflict: not detected in a Belgian sample [6], but reported in later work cited by a UK survey [4]. No source retrieved covers Belgian Malinois.
- In 7,378 dogs screened in Germany, mutant MDR1 allele frequency was 59% in Collies, 45% in Longhaired Whippets, 30% in Shetland Sheepdogs, 24% in Miniature Australian Shepherds, 22% in Australian Shepherds, 17% in Wallers, 14% in White Swiss Shepherds, 4% in Old English Sheepdogs and 1% in Border Collies; 8% in herding-breed mixes and 2% in other mixed breeds. It was not found in Bearded Collies, Kelpies, Australian Cattle Dogs, Greyhounds and several other related breeds screened [8]. German data; other countries may differ.
- Because the mutation is widespread across breeds and also occurs in mixed breeds, it is difficult for veterinarians and owners to tell whether MDR1-related drug sensitivity applies to an individual dog [8].

## Management

- One MDR1-mutant Collie had severe neurotoxicity after a single butorphanol dose and needed about 40 hours of continuous naloxone (single case) [7].
- TODO: reviewer list of the drugs that should carry mdr1_caution. The list retrieved so far is only what the abstracts name.
- TODO: reviewer decision on which working breeds should raise the caution when MDR1 status is unknown. The app currently uses a user-ticked herding-breed flag.

## Sources

| # | Citation | Link status |
|---|----------|-------------|
| 1 | Firdova Z et al. 2016. The prevalence of ABCB1:c.227_230delATAG mutation in affected dog breeds from European countries. Res Vet Sci. | record link (https://doi.org/10.1016/j.rvsc.2016.03.016) |
| 2 | Geyer J et al. 2005. Frequency of the nt230 (del4) MDR1 mutation in Collies and related dog breeds in Germany. J Vet Pharmacol Ther. | record link (https://doi.org/10.1111/j.1365-2885.2005.00692.x) |
| 3 | Marelli SP et al. 2020. Genotypic and allelic frequencies of MDR1 gene in dogs in Italy. Vet Rec Open. | record link (https://doi.org/10.1136/vetreco-2019-000375) |
| 4 | Tappin SW et al. 2012. Frequency of the mutant MDR1 allele in dogs in the UK. Vet Rec. | record link (https://doi.org/10.1136/vr.100633) |
| 5 | Palocz O et al. 2026. Association between the nt230(del4) mutation and c.-6-180T>G polymorphism in the canine ABCB1 gene. Vet Med Int. | record link (https://doi.org/10.1155/vmi/1075604) |
| 6 | Van Poucke M et al. 2009. Presence of the ABCB1 (MDR1) deletion mutation causing ivermectin hypersensitivity in certain dog breeds in Belgium. Vlaams Diergeneeskd Tijdschr. | UNRESOLVED (search link) (https://pubmed.ncbi.nlm.nih.gov/?term=Presence%20of%20the%20ABCB1%20%28MDR1%29%20deletion%20mutation%20causing%20ivermectin%20hypersensitivity%20in%20certain%20dog%20breeds%20in%20Belgium) |
| 7 | Nelson TS et al. 2025. Case report: adverse reaction to butorphanol in a Collie homozygous for the ABCB1-1Δ (MDR1) mutation. Front Vet Sci. | record link (https://doi.org/10.3389/fvets.2025.1603375) |
| 8 | Gramer I et al. 2010. Breed distribution of the nt230(del4) MDR1 mutation in dogs. Vet J. | record link (https://pubmed.ncbi.nlm.nih.gov/20655253/) |

## Open items (9)

- [ ] `content.management[2]`: TODO: reviewer list of the drugs that should carry mdr1_caution. The list retrieved so far is only what the abstracts name.
- [ ] `content.management[3]`: TODO: reviewer decision on which working breeds should raise the caution when MDR1 status is unknown. The app currently uses a user-ticked herding-breed flag.
- [ ] `lens.handler.transfer_trigger`: TODO
- [ ] `lens.prehospital_als.transfer_trigger`: TODO
- [ ] `lens.flight_cct.transfer_trigger`: TODO
- [ ] `lens.human_ed.transfer_trigger`: TODO
- [ ] `lens.vet_gp.transfer_trigger`: TODO
- [ ] `lens.vet_ed.transfer_trigger`: TODO
- [ ] `takeaway`: TODO

## Reviewer decisions

Approve / approve with changes / reject: ____________

Comments:


## Sign-off

| Role | Name | Credential | Date | Signature |
|------|------|------------|------|-----------|
| Veterinarian | | | | |
| Physician | | | | |

Approval requires both signatures, no open TODO, and every source resolved to a record link.
