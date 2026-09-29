// App-level constants that are not clinical content. The app NAME is not here: it comes from app.config.json.
export const GITHUB_REPO = 'awpeace1906-collab/canisalus';
export const APP_VERSION = '0.1.0';

export function flagOutdatedURL(mod) {
  const title = `Outdated: ${mod.title} (${mod.id})`;
  const body = [`**Module:** ${mod.id}`, `**Last verified:** ${mod.last_verified ?? '-'}`, `**Status:** ${mod.status}`, '', "**What's outdated / newer source:**", ''].join('\n');
  return `https://github.com/${GITHUB_REPO}/issues/new?${new URLSearchParams({ labels: 'content,needs-review', title, body })}`;
}
