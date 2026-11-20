---
"@kobalte/core": patch
---

Breadcrumbs: fall back to the default `separator` and `translations` when they are passed as `undefined`. Solid 2's `merge` keeps an explicit `undefined`, so `translations={undefined}` threw and `separator={undefined}` rendered an empty separator.
