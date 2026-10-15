---
"@kobalte/core": patch
"@kobalte/utils": patch
---

Update Solid 2 primitive dependencies to preserve hydration owner IDs for client-only effects and settled callbacks. This fixes hydration mismatches in components including Tabs with Indicator, expanded Accordion, and open Popover.
