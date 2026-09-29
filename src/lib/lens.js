// Environment lens: one content set viewed through the user's tier and site capability flags.

/** `sometimes` and `jurisdiction` count as false until the user confirms them in Settings. */
export function resolveFlag(value, override) {
  if (typeof override === 'boolean') return override;
  return value === true;
}

export function resolveFlags(tier, overrides = {}) {
  return Object.fromEntries(Object.entries(tier.flags).map(([k, v]) => [k, resolveFlag(v, overrides[k])]));
}

/**
 * Render a module's lens for a tier.
 * `requires` gates the whole do_here list: if the site lacks a required flag, every do_here item
 * is demoted into leave_for_next. `hidden` hides the module's guidance at that tier.
 * Returns null when the module has no lens entry for the tier.
 */
export function renderLens(module, tierId, flags) {
  const e = module.lens?.[tierId];
  if (!e) return null;
  if (e.hidden) return { hidden: true, doHere: [], leaveForNext: [], demoted: [], unmetFlags: [], transferTrigger: '' };
  const unmet = (e.requires || []).filter(f => flags[f] !== true);
  if (unmet.length) {
    return { hidden: false, doHere: [], leaveForNext: [...e.do_here, ...e.leave_for_next], demoted: [...e.do_here], unmetFlags: unmet, transferTrigger: e.transfer_trigger };
  }
  return { hidden: false, doHere: [...e.do_here], leaveForNext: [...e.leave_for_next], demoted: [], unmetFlags: [], transferTrigger: e.transfer_trigger };
}
