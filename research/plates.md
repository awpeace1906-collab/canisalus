# Anatomy plates (public domain), method and plan

## Method (same as Kairos)

Plates are public-domain historical engravings from Wikimedia Commons. Each carries a credit line, a `sourceUrl`, a `license` of `public-domain` and a `sha1` of the exact file, so `tools/validate.js` can prove the file on disk is the one credited. Overlays (landmarks, needle paths) are drawn as vector shapes on top and are original work.

Public-domain status is jurisdiction-specific. This project treats a plate as usable only if **Commons tags it public domain and the operator asserts a first-publication year of 1930 or earlier** (US public domain as of 2026). `tools/fetch-plate.js` refuses anything else, including share-alike licences.

## Status: no canine plate has been fetched

**Wikimedia Commons and archive.org are blocked by this environment's network policy**, so no canine plate could be located, viewed or downloaded in the research session. Nothing in this repo claims a canine plate exists. Once those hosts are allowed, run `node tools/fetch-plate.js` for each plate (usage in the script header). It records the checksum and adds the plate to `content/plates.json`.

Hosts to allow: `commons.wikimedia.org`, `upload.wikimedia.org`. `archive.org` is only needed to read source books.

## What is in the repo now (human side of the contrast)

Six Gray's Anatomy plates (1918, public domain) copied from the Kairos repo, checksums matching its records: neck (1195), back (1211), left chest with arm raised (1215), left lateral chest and upper abdomen (1217), anterior chest (1218), abdominal regions (1220). They are registered in `content/plates.json` and not yet attached to any module, because a human plate is only useful next to its canine counterpart.

## Candidate canine sources to check (from memory, unverified)

I could not verify any of these. Treat as leads only.

- Sisson, *The Anatomy of the Domestic Animals* (first published 1910; later editions differ). Only editions published 1930 or earlier qualify.
- Ellenberger and Baum, *Handbuch der vergleichenden Anatomie der Haustiere* (early editions).
- Any 19th to early 20th century veterinary anatomy atlas already on Commons under a public-domain tag.

Whether a given Commons file is a real scan of one of these, and its true first-publication year, must be checked when the file is opened.

## Plates needed, by module

| Need | Module(s) | Human pair (already held) |
| --- | --- | --- |
| Forelimb: cephalic vein; hindlimb: lateral saphenous | peripheral IV access | none |
| Ventral neck: external jugular, trachea, larynx | jugular access, intubation, surgical tracheotomy | 1195 |
| Lateral thorax: ribs, intercostal spaces, heart position | needle and tube thoracostomy, CPR hand position | 1215, 1217 |
| Heart and pericardium, right side | pericardiocentesis | 1218 |
| Abdomen: stomach position, left flank | GDV decompression | 1220 |
| Medial thigh: femoral artery | canine normal vitals (femoral pulse) | none |
| Humerus, tibia | intraosseous access | none |
| Thoracic conformation (barrel, deep, keel) | CPR (chest-shape-dependent compressions) | none; likely an original schematic, since no historical plate is expected |

## Original schematics as a fallback

Where no public-domain plate exists (chest conformation, tourniquet placement, weight-estimation zones), original SVG schematics are unencumbered. They need the same reviewer sign-off as any other figure.
