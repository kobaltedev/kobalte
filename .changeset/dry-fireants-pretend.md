---
"@kobalte/core": patch
---

## v0.13.5 (August 27, 2024)

**New features**

- Tooltip: add skipDelayDuration prop ([#467](https://github.com/kobaltedev/kobalte/pull/467))

**Bug fixes**

- NumberField: only format when enabled ([#456](https://github.com/kobaltedev/kobalte/pull/456))
- NumberField: don't trigger `onRawValueChange` on mount when NaN ([#456](https://github.com/kobaltedev/kobalte/pull/456))
- Select: correct type definition & empty value for multiselect ([#456](https://github.com/kobaltedev/kobalte/pull/456))
- TextField: clear input when controlled value set to undefined ([#456](https://github.com/kobaltedev/kobalte/pull/456))
- Combobox: correct type definition & empty value for multiselect ([#456](https://github.com/kobaltedev/kobalte/pull/456))
- Skeleton: correct data-animate & data-visible attribute value ([#456](https://github.com/kobaltedev/kobalte/pull/456))
- Combobox: close list on outside click ([#456](https://github.com/kobaltedev/kobalte/pull/456))
- NavigationMenu: incorrect animation after closed ([#456](https://github.com/kobaltedev/kobalte/pull/456))
- Tabs: recalculate indicator styles on resize ([#458](https://github.com/kobaltedev/kobalte/pull/458))
- Pagination: correctly render fixedItems with low page count ([#464](https://github.com/kobaltedev/kobalte/pull/464))
- Combobox: prevent opening on input with triggerMode="manual" ([#465](https://github.com/kobaltedev/kobalte/pull/465))
- NumberField: precision handling with floating point offsets and value snapping ([#468](https://github.com/kobaltedev/kobalte/pull/468))
