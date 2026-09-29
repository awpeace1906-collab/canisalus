// Plate helpers: license classification, image size, and registry building. Pure functions (no network),
// so they are unit-tested. The network step lives in tools/fetch-plate.js.
import crypto from 'node:crypto';

export const sha1 = buf => crypto.createHash('sha1').update(buf).digest('hex');

/** PNG (IHDR) and JPEG (SOF) dimensions. Returns null for anything else. */
export function imageSize(buf) {
  if (buf.length > 24 && buf.readUInt32BE(0) === 0x89504e47) return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
  if (buf.length > 4 && buf[0] === 0xff && buf[1] === 0xd8) {
    let i = 2;
    while (i + 9 < buf.length) {
      if (buf[i] !== 0xff) { i++; continue; }
      const marker = buf[i + 1];
      if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) return { height: buf.readUInt16BE(i + 5), width: buf.readUInt16BE(i + 7) };
      i += 2 + buf.readUInt16BE(i + 2);
    }
  }
  return null;
}

/**
 * Decide whether a Wikimedia Commons file may be used. Conservative: the file must be tagged public domain,
 * and the operator must separately assert US public-domain status (publication year <= 1930 as of 2026, or a
 * US-government work). Commons license tags alone are not enough: PD is jurisdiction-specific.
 * `meta` is the `extmetadata` object from the Commons imageinfo API.
 */
export function classifyLicense(meta = {}, { assertedPublicationYear } = {}) {
  const val = k => (meta[k]?.value ?? '').toString();
  const short = val('LicenseShortName'), usage = val('UsageTerms'), copyrighted = val('Copyrighted');
  const tagged = /^(public domain|pd[-\s]|cc0)/i.test(short) || /public domain/i.test(usage);
  if (/^cc[- ]by/i.test(short) || /share.?alike/i.test(short + usage)) return { ok: false, reason: `licence '${short}' is not public domain (attribution/share-alike licences are not accepted here)` };
  if (copyrighted && /^true$/i.test(copyrighted) && !tagged) return { ok: false, reason: 'Commons marks the file as copyrighted' };
  if (!tagged) return { ok: false, reason: `licence '${short || 'unknown'}' is not tagged public domain` };
  if (!Number.isInteger(assertedPublicationYear)) return { ok: false, reason: 'pass --published-year <YYYY> to assert the first US publication year of the original plate' };
  if (assertedPublicationYear > 1930) return { ok: false, reason: `original published in ${assertedPublicationYear}; only works first published in 1930 or earlier are treated as US public domain` };
  return { ok: true, reason: `${short}; original first published ${assertedPublicationYear}` };
}

const slug = s => s.toLowerCase().replace(/^file:/, '').replace(/\.[a-z0-9]+$/, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export function buildPlateEntry({ title, buf, ext, kind, subject, credit, sourceUrl, plannedUse = [] }) {
  const size = imageSize(buf);
  const id = slug(title);
  return {
    id, src: `assets/figures/${id}.${ext}`, kind, subject, credit, license: 'public-domain', sourceUrl,
    sha1: sha1(buf), ...(size ?? {}), ...(plannedUse.length ? { planned_use: plannedUse } : {}),
  };
}
