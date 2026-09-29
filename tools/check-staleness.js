#!/usr/bin/env node
// Release tripwire (same idea as Kairos's check-staleness): fail when any approved
// module is past its review interval. Unapproved content is never shipped, so it is not checked.
import { loadAll } from './lib/content.js';
import { staleness } from '../src/lib/staleness.js';

export function overdue(modules, today = new Date()) {
  return modules.filter(m => m.status === 'approved')
    .map(m => ({ id: m.id, s: staleness(m, today) }))
    .filter(x => x.s.state === 'stale' || x.s.state === 'unverified');
}

if (process.argv[1] && import.meta.url.endsWith(process.argv[1].split('/').pop())) {
  const bad = overdue(loadAll().modules.map(m => m.json));
  bad.forEach(b => console.error(`OVERDUE ${b.id}: ${b.s.state === 'stale' ? `${b.s.overdueBy} month(s) past review` : 'approved but unverified'}`));
  console.log(`check-staleness: ${bad.length} overdue`);
  process.exit(bad.length ? 1 : 0);
}
