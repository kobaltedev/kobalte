---
"@kobalte/core": patch
---

Use `inert` instead of `aria-hidden` when hiding outside content for modal overlays (Dialog, DropdownMenu, Select, Popover, …), when the browser supports it. This resolves the console warning "Blocked aria-hidden on an element because its descendant retained focus" that Chrome logs the first time an overlay opens (the trigger is still focused for a tick before focus moves into the overlay). Falls back to `aria-hidden` when `inert` is unsupported.
