# Research dossiers

One dossier per module, written so a veterinary reviewer and a physician reviewer can check every claim against its source.

## Rules

1. **Nothing here is approved.** Dossiers feed `status: draft` modules. Approval needs both signatures in the module JSON.
2. **Every claim traces to a retrieved source.** If I could not retrieve the source text, the claim is not written. It goes under "Not retrieved" instead.
3. **Abstract-level vs full-text.** Each source is marked `[abstract]` or `[full text]`. Most rank-1 guideline documents were not reachable in the research session, so their recommendations still need a reviewer to confirm against the document itself.
4. **No doses.** Dose ranges are not stated in any dossier unless a retrieved canine source gives them. None do yet. Drug fields stay `null`.
5. **Evidence grades** use the framework's source ranks: 1 guideline, 2 consensus statement or poison control, 3 peer-reviewed literature, 4 texts.

## Retrieval limits in the research session (2026-09-29)

| Source | Status |
| --- | --- |
| PubMed abstracts and metadata | Reachable |
| Consensus (abstract-level) | Reachable, rate-limited to 3 searches at a time |
| Scholar Gateway (full-text passages) | Failed: "Could not resolve user identity" |
| K9TCCC 2023 full text (jsomonline.org, allogy, crisis-medicine.com) | Blocked by the network egress proxy |
| K9-TECC 2016 (specialoperationsmedicine.org) | Blocked |
| RECOVER 2024 full guideline (acvecc-recover.org) | Did not resolve |
| RECOVER 2024 papers in PMC | No PMC full text available |

So the two most important rank-1 sources (K9TCCC and the RECOVER 2024 BLS clinical guideline) have **not** been read in full. Their content is not reproduced here.

## Citation verification

Sources in modules are resolved to a DOI or PubMed URL where PubMed could confirm the paper. Retrieval-tool metadata proved unreliable in two of about forty checks (wrong first author), so anything still carrying a `consensus.app` link is unverified and is flagged by `npm run validate`. See `pathophysiology-dog-vs-human.md` for the remaining list.

## Dossier index

| Module | File | Evidence status |
| --- | --- | --- |
| Heat stroke | `heat-stroke.md` | Strong rank-3 evidence; guideline not retrieved |
| Gastric dilatation-volvulus | `gastric-dilatation-volvulus.md` | Rank-3 evidence; consensus statements not retrieved |
| Opioids including fentanyl | `opioid-exposure.md` | Canine PK and case data; no guideline text retrieved; study doses listed, none adopted |
| MDR1 (ABCB1) sensitivity | `mdr1-abcb1.md` | Genotyping surveys; drug list not retrieved; breed evidence inconsistent |
| Hemorrhage control | `hemorrhage-control.md` | Two veterinary review articles; K9TCCC not retrieved |
| Pathophysiology: dog vs human | `pathophysiology-dog-vs-human.md` | Five compare-table modules; coverage gaps listed |
| CPR (RECOVER) | `cpr-recover.md` | 2024 RECOVER abstracts only; numeric recommendations deliberately omitted |
