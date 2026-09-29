// Staleness from last_verified + review_interval_months.
export function monthsBetween(a, b) {
  return (b.getFullYear() - a.getFullYear()) * 12 + (b.getMonth() - a.getMonth());
}

/** -> {state:'unverified'} | {state:'ok', months} | {state:'stale', months, overdueBy} */
export function staleness(m, today = new Date()) {
  if (!m.last_verified) return { state: 'unverified' };
  const months = monthsBetween(new Date(m.last_verified), today);
  return months > m.review_interval_months
    ? { state: 'stale', months, overdueBy: months - m.review_interval_months }
    : { state: 'ok', months };
}
