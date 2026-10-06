# Private install (test build, no clinical content)

`node tools/build.js --release` writes `dist/`. Today it holds 0 modules and 0 drugs:
an empty shell for testing install, dog profiles, handoff and the Vet ER screen.
Do not use it for patient care. Never publish a `node tools/build.js` (dev) build: it shows drafts.

All asset paths are relative, so `dist/` works at any URL or subpath.

iPhone install needs HTTPS: open the URL in Safari, Share, Add to Home Screen.

## Keep it private (pick one; each needs your own account)
- Tailscale: run `npx serve dist` on a computer, then `tailscale serve --bg 3000`. Only your tailnet devices can open the HTTPS URL.
- Cloudflare Pages + Cloudflare Access: upload `dist/`, restrict to your email.
- Netlify or Vercel with password/SSO protection (paid tiers on some plans).
- GitHub Pages ("unlisted"): the repo is public, so the site is public but not linked or listed anywhere; anyone with the URL can open it. Acceptable only while the release build has no clinical content. One-time: repo Settings > Pages > Source: GitHub Actions. Then Actions > pages > Run workflow. URL: https://awpeace1906-collab.github.io/canisalus/

Dog profiles and Vet ER lists are stored only in the phone's browser; nothing is sent anywhere.
