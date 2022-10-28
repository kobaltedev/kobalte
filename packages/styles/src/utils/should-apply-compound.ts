/** Return whether a compound variant should be applied. */
export function shouldApplyCompound<T extends Record<string, any>>(
  compoundCheck: T,
  selections: T
) {
  for (const key of Object.keys(compoundCheck)) {
    if (compoundCheck[key] !== selections[key]) {
      return false;
    }
  }

  return true;
}
