# CaniSalus: rules for working in this repo

Canine emergency reference for human-trained clinicians. Read `docs/HANDOFF.md` first. Do not relitigate its decisions.

## Hard safety rules (tests enforce these; never weaken them)

- No human dose anywhere. Drug entries are `species: "canine"`; `human_dose`/`adult_dose`/`pediatric_dose` keys are rejected.
- All dose maths lives in `engine/dose.js`. View code and `src/lib/dose.js` must never compute, default or fall back to a dose.
- No weight, no dose (`NEED_WEIGHT`). Estimated weights carry `WEIGHT_ESTIMATED` on every result.
- Unapproved, unsourced, non-canine or missing-route entries return `NO_CANINE_DOSE`.
- A module or drug is `approved` only with vet and physician sign-off, `last_verified`, sources and no `TODO`.
- Unapproved content is hidden in release builds. `npm run validate:release` must pass before a release.
- Clinical content may be drafted only from retrieved, cited sources (see `research/`), and stays `draft`. Never set `approved`, never add a signature, and never enter a dose that has no canine source chosen by the veterinary reviewer. Gaps are written as explicit `TODO` items, which block approval by design.
- A source URL must be a DOI or PubMed link before approval. `consensus.app` retrieval links are unverified and are rejected for approved modules.
- Plates must be verified public domain (`tools/fetch-plate.js` enforces this). Never add a plate by hand.
- Never hardcode the app name; read it from `app.config.json`.

## Commands

`npm test`, `npm run validate`, `npm run dev`, `npm run ci`. Run `npm run ci` before pushing.

## Conventions

Vanilla JS ES modules, no framework. Keep `src/lib/*` free of DOM access at import time so it stays testable in Node. `tools/gen_stubs.py` overwrites content; only run it on a clean content tree.
