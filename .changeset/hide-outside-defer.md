---
"@kobalte/core": patch
---

Defer applying `aria-hidden` to the next frame in `ariaHideOutside` so it lands after focus has moved into the overlay. Previously it was applied synchronously on open, briefly placing `aria-hidden` on an ancestor of the still-focused trigger — which browsers block (Chromium logs "Blocked aria-hidden on an element because its descendant retained focus" the first time any modal overlay opens). Steady-state hiding is unchanged.
