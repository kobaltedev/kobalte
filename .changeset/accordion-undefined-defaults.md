---
"@kobalte/core": patch
---

Accordion: fall back to the default `id` and `shouldFocusWrap` when they are passed as `undefined`. Solid 2's `merge` keeps an explicit `undefined`, so `id={undefined}` on an item or trigger left the trigger without an id and broke `aria-labelledby`, and `shouldFocusWrap={undefined}` turned focus wrapping off.
