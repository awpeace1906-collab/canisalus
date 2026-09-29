// One flat index, substring match, ranked title > keywords > domain > summary (same approach as Kairos).
export function makeSearch(entries) {
  return function search(query, { domain = null } = {}) {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    const pool = domain ? entries.filter(e => e.domain === domain) : entries;
    const scored = [];
    for (const e of pool) {
      const rank = matchRank(e, q);
      if (rank > 0) scored.push({ e, rank });
    }
    scored.sort((a, b) => b.rank - a.rank || a.e.title.localeCompare(b.e.title));
    return scored.map(s => s.e);
  };
}

function matchRank(e, q) {
  const title = e.title.toLowerCase();
  if (title === q) return 100;
  if (title.startsWith(q)) return 80;
  if (title.includes(q)) return 60;
  if ((e.keywords || []).some(k => k.toLowerCase().includes(q))) return 40;
  if (e.domainLabel.toLowerCase().includes(q)) return 20;
  if ((e.summary || '').toLowerCase().includes(q)) return 10;
  return 0;
}
