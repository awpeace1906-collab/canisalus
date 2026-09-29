# CaniSalus — Build Handoff for Claude Code

**CaniSalus** (kay-nih-SAY-lus; "Salus" in speech) is a canine emergency reference for human-trained clinicians, built on the Kairos content engine. It is a bridge to veterinary care, not a replacement. The reviewer-facing framework doc (the source of truth for clinical scope) lives separately as a Claude Doc; this package is the technical scaffold.

## Name and intro copy

- The name lives in `app.config.json` (`name`, `short_name`, `pronunciation`, `store_title`). **Never hardcode the name** in UI or metadata; read it from config so a rename is one edit.
- Intro copy lives in `content/about.json`, mirroring the Kairos pattern:
  - **Onboarding screen:** short, skippable, with the pronunciation line. It deliberately omits the "why" paragraph.
  - **Settings → About CaniSalus:** the full copy (pronunciation, meaning of the name, why it exists, bridge-to-vet statement).
- This is literal static copy. It needs no remote refresh, unlike clinical modules.
- Trademark: web search is clear; USPTO and App Store searches are still pending (Andrew).

## Decisions already made (do not relitigate)

1. **Environment ladder, 6 tiers (0–5).** Handler (0) → Prehospital ALS (1) → Flight/CCT (2) → **Human ED (3, default)** → Local vet office (4) → Vet ED (5). Defined in `content/environments.json`.
2. **Capability flags, not rank.** Modules key behavior off flags (`lens.<tier>.requires`). Users may override their site's flags in Settings. Values `"sometimes"` and `"jurisdiction"` are treated as `false` until the user confirms.
3. **Kairos lens pattern.** Environment is a lens over one content set, not a content fork. Reuse Kairos's module loader, search index, remote content delivery, offline cache, and staleness tooling. Do not copy them into a new codebase if they can be shared as a package.
4. **Module template** (`schema/module.schema.json`): header → Why this matters → What changes from human (≤3, each with an `objective_id` that the course reuses) → content → environment lens → clinical takeaway.
5. **Home screen** is organized around "Can this be reversed?" (`reversible: true` modules), with domains as the secondary nav.

## Hard safety rules (tests enforce these; do not weaken them)

- **No human dose anywhere.** The drug schema has no human-dose field; `species` must be `"canine"`; the validator rejects `human_dose`/`adult_dose`/`pediatric_dose` keys.
- **`engine/dose.js` never falls back.** Unapproved, unsourced, non-canine, or missing-route entries return `NO_CANINE_DOSE`. The UI copy for that state is: *"No verified canine dose. Contact a veterinarian or animal poison control."*
- **No weight, no dose.** Returns `NEED_WEIGHT`. Estimated weights carry a `WEIGHT_ESTIMATED` warning on every result screen.
- **MDR1 warning** when the drug has `mdr1_caution` and the K9 profile is MDR1-positive, or unknown in a herding breed.
- **Dual sign-off gating.** A module or drug is `approved` only with vet + physician signatures, `last_verified`, sources, and no `TODO`. **Unapproved content is hidden in production builds, not shown as drafts.** `npm run validate:release` must pass before any release build.
- Do not author clinical content or doses. All clinical values come from Andrew and the reviewers.

## What's in the package

| Path | Purpose |
| --- | --- |
| `app.config.json` | App name, short name, pronunciation, store title |
| `content/about.json` | Onboarding and About copy |
| `content/environments.json` | Tiers, ranks, default capability flags |
| `content/index.json` | Domain list and module order (flat search index source) |
| `content/modules/<domain>/*.json` | 75 module stubs; `medical/gastric-dilatation-volvulus.json` is the one worked lens example |
| `content/drugs/naloxone.json` | Drug stub (doses null by design) |
| `schema/*.schema.json` | Module and drug schemas |
| `engine/dose.js` | Guarded canine dose engine |
| `tools/validate.js` | Guardrail validator (`--release` for ship gate) |
| `tools/gen_stubs.py` | Regenerates stubs (**overwrites**; only run on a clean content tree) |
| `tests/guardrails.test.js` | 14 tests (synthetic data only) |

Run: `npm test && npm run validate`

## Build tasks for Claude Code

1. **Wire into Kairos's engine.** Load `content/` with Kairos's module loader; add JSON Schema validation (ajv) alongside `tools/validate.js` in CI.
2. **Setting picker.** First-run screen choosing a tier (default Human ED; Tier 0 Handler is a full, always-visible option), plus Settings for per-site flag overrides.
3. **Lens renderer.** For the active tier, render `do_here`, `leave_for_next`, `transfer_trigger`. Demote any `do_here` item whose `requires` flag is false at the user's site into `leave_for_next`. Respect `hidden`.
4. **Module view.** Kairos entry template plus a visually distinct "What changes from human" card.
5. **K9 profile.** Local, on-device storage of weight, breed, DEA 1 type, MDR1 status (positive/negative/unknown), meds, baseline labs, vet contact. Multiple dogs supported. Feeds the dose engine and handoff.
6. **Dose UI.** Calls `computeDose` only. Render every `RESULT` state and warning; never compute doses in UI code.
7. **Handoff generator.** SBAR-style summary from the profile plus a free-text timeline, shareable as text.
8. **Jurisdiction card** linked from every module (content to come; render a placeholder that says scope varies by state).
9. **Onboarding + About screens** from `content/about.json`; onboarding doubles as the launch disclaimer (bridge to veterinary care).
10. **Staleness banner** from `last_verified` + `review_interval_months`, reusing Kairos tooling.

## Open items for Andrew (not Claude Code)

- Reviewer answers to the open questions in the framework doc (tier order, trocar decompression scope, human blood products/colloids as a bridge, review intervals, first jurisdictions).
- Named vet and physician reviewers per domain.
- USPTO/App Store trademark check on CaniSalus.
- Whether this ships standalone on the Kairos engine or as a module inside Kairos.
