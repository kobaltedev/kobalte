---
"@kobalte/core": patch
"@kobalte/utils": patch
---

Scroll the focused item into view only within the collection's own scroll container again, as on 0.13, instead of calling the native `scrollIntoView`, which also scrolled the window, e.g. to every `Tabs` when it mounted.
