---
"@kobalte/core": minor
---

## Breaking changes

- `Select` and `MultiSelect`:
  - `.Root` component renders a `div` by default.
  - renderItem prop is now itemComponent.
  - renderSection prop is now sectionComponent.
  - renderValue prop is now valueComponent.

## New features

- Added `AlertDialog` component.
- Added `Toast` component.
- Ability to clear and remove an item from selection in `Select.Value` and `MultiSelect.Value` using the `.Root`’s valueComponent prop.
- `Select` and `MultiSelect` better integration with form libraries.

## Bug fixes

- #146
- #147
- #148
- #150
- #152
- #153
