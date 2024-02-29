---
"@kobalte/core": patch
"@kobalte/tests": minor
---

## v0.12.2 (February 29, 2024)

**New features**

- Update to Solid `1.8.15` and Solid
  Start `0.5.10` ([#300](https://github.com/kobaltedev/kobalte/pull/300)) ([#337](https://github.com/kobaltedev/kobalte/pull/337))
- Use `solid-prevent-scroll` for scroll lock ([#345](https://github.com/kobaltedev/kobalte/pull/345))
- Allow configurable combobox and select components close after
  selection ([#339](https://github.com/kobaltedev/kobalte/pull/339))

**Bug fixes**

- Slider: fix onChangeEnd getting called twice ([#324](https://github.com/kobaltedev/kobalte/pull/324))
- Slider: focus the correct thumb `onSlideEnd` ([#331](https://github.com/kobaltedev/kobalte/pull/331))
- Slider: fix `getClosestValueIndex` ambiguity ([#331](https://github.com/kobaltedev/kobalte/pull/331))
- Slider: fix `Home/End/PageDown/PageUp` keys ([#331](https://github.com/kobaltedev/kobalte/pull/331))
- Skeleton: update exports from index.tsx ([#331](https://github.com/kobaltedev/kobalte/pull/331))
- ContextMenu: add context.setAnchorRect call on pointer down ([#338](https://github.com/kobaltedev/kobalte/pull/338))
- DropdownMenu: scroll into view when triggered by keyboard ([#337](https://github.com/kobaltedev/kobalte/pull/337))
- Menubar: expand hightlighted trigger ([#337](https://github.com/kobaltedev/kobalte/pull/337))
- Menubar: dont auto open when closed from trigger ([#337](https://github.com/kobaltedev/kobalte/pull/337))
- Modal: correctly unlock scroll when disposed in different
  order ([#337](https://github.com/kobaltedev/kobalte/pull/337))
- Combobox: pass virtualized to listbox ([#341](https://github.com/kobaltedev/kobalte/pull/341))

## @kobalte/tests

Use vitest
