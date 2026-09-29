# CaniSalus

Canine emergency reference for human-trained clinicians (kay-nih-SAY-lus, "Salus" for short). A bridge to veterinary care, not a replacement for it.

Standalone offline-first PWA built on the Kairos engine pattern: vanilla JS, hash router, content-as-data, a generated manifest and search index, a service worker that precaches everything, and a staleness tripwire in CI. The name lives only in `app.config.json`.

## Commands

| Command | What it does |
| --- | --- |
| `npm install` | Installs the two dev dependencies (ajv, ajv-formats). The app itself has none. |
| `npm run dev` | Builds `dist/` (drafts visible, flagged DEV) and serves it on :5173 |
| `npm test` | Guardrail tests, lens, dose adapter, handoff, search, staleness, build gating |
| `npm run validate` | Schema and guardrail validation of `content/` |
| `npm run validate:release` | Same, and fails unless every module and drug is `approved` |
| `npm run build:release` | Release gate, staleness check, then a build that ships approved content only |
| `npm run ci` | Everything CI runs |
| `node tools/fetch-plate.js` | Fetch a verified public-domain plate from Wikimedia Commons (needs the host allowed) |

## Layout

```
app.config.json      name, short name, pronunciation, store title (single source of truth)
content/             clinical content as JSON (schema/ validates it)
engine/dose.js       guarded canine dose engine (the only place doses are computed)
src/lib/             lens, dose adapter, handoff, search, staleness, prefs, K9 profiles, content store
src/views/           screens
tools/               validate, build, staleness check, dev server, stub generator
tests/               node:test suites
docs/                HANDOFF.md (build brief), framework.txt (reviewer framework text)
```

## Release gating

Unapproved content is hidden, not shown as a draft. `tools/build.js --release` drops every module and drug that is not `approved` before anything is copied, so drafts never reach the shipped bundle. Until reviewers sign modules off, a release build is an empty shell. That is expected.

## Research and reviewer material

`research/` holds one dossier per module: every claim traced to a retrieved source, retrieval limits recorded, and open questions for the veterinary and physician reviewers. Start with `research/README.md`. Pathophysiology (dog vs human) modules carry a compare table; plates are documented in `research/plates.md`.

## What Kairos pieces are ported

Content store with hash-based OTA refresh, search (title > keywords > domain), hash router, prefs and session stores, the service-worker precache, the manifest generator and the staleness tripwire. They are adapted to CaniSalus's content shape, not copied verbatim. If Kairos later ships these as a package, `src/lib/contentStore.js`, `search.js`, `router.js` and `staleness.js` are the seams to swap.
