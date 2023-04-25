# @kobalte/core

## 0.9.3

### Patch Changes

- 218c6bd: ## Bug fixes

  - [#187](https://github.com/kobaltedev/kobalte/pull/187)
  - [#188](https://github.com/kobaltedev/kobalte/pull/188)
  - [#191](https://github.com/kobaltedev/kobalte/pull/191)

## 0.9.2

### Patch Changes

- 1b87fc6: fix exports in `@kobalte/utils`
- Updated dependencies [1b87fc6]
  - @kobalte/utils@0.7.1

## 0.9.1

### Patch Changes

- 24aeebb: v0.9.1

## 0.9.0

### Minor Changes

- 9b52a46: ## Breaking changes

  - Update minimum required `solid-js` version to `1.7.0`.
  - For all components having the following props:
    - `isDisabled` prop is now `disabled`.
    - `isRequired` prop is now `required`.
    - `isReadOnly` prop is now `readOnly`.
    - `isOpen` prop is now `open`.
    - `isPressed` prop is now `pressed`.
    - `isChecked` prop is now `checked`.
    - `isIndeterminate` prop is now `indeterminate`.
    - `isModal` prop is now `modal`.
    - `isPersistent` prop is now `persistent`.
    - `defaultIsOpen` prop is now `defaultOpen`.
    - `defaultIsChecked` prop is now `defaultChecked`.
    - `defaultIsPressed` prop is now `defaultPressed`.
    - `onValueChange` prop is now `onChange`.
    - `onCheckedChange` prop is now `onChange`.
    - `onPressedChange` prop is now `onChange`.
  - `MultiSelect` has been removed, use `<Select.Root multiple>` instead.
  - `Select`:
    - `value`, `defaultValue` and `onChange` prop uses same type as `Select` options instead of `string`.
    - `valueComponent` prop has been removed, use `Select.Value` render prop instead.

  ## New features

  - Added `Combobox` component.
  - Added `Tooltip` component.
  - Added support for multiple `Toast.Region`.

  ## Bug fixes

  - [#164](https://github.com/kobaltedev/kobalte/pull/164)
  - [#166](https://github.com/kobaltedev/kobalte/pull/166)
  - [#167](https://github.com/kobaltedev/kobalte/pull/167)
  - [#174](https://github.com/kobaltedev/kobalte/pull/174)

### Patch Changes

- Updated dependencies [9b52a46]
  - @kobalte/utils@0.7.0

## 0.8.2

### Patch Changes

- 8a1b75a: fix: #160

## 0.8.1

### Patch Changes

- 4d669ee: fix: `Select.Root` missing type definition

## 0.8.0

### Minor Changes

- 721c0ad: ## Breaking changes

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

## 0.7.4

### Patch Changes

- 2b46afb: Unnecessary re-renders when using polymorphic `<As>` component.

## 0.7.3

### Patch Changes

- 20cd441: fix #118

## 0.7.2

### Patch Changes

- 81d2e40: fix: nexgen ts module resolutions
- Updated dependencies [81d2e40]
  - @kobalte/utils@0.6.1

## 0.7.1

### Patch Changes

- b8fd112: New scroll-lock implementation + export all components props type

## 0.7.0

### Minor Changes

- 0a1b042: New Select and Polymorphism API

### Patch Changes

- Updated dependencies [0a1b042]
  - @kobalte/utils@0.6.0

## 0.6.2

### Patch Changes

- 1734b1e: fix: #119

## 0.6.1

### Patch Changes

- 056ed63: Add `data-closed` attribute.
- Updated dependencies [056ed63]
  - @kobalte/utils@0.5.1

## 0.6.0

### Minor Changes

- 975d526: v0.6.0

### Patch Changes

- Updated dependencies [975d526]
  - @kobalte/utils@0.5.0

## 0.5.0

### Minor Changes

- 3b9d8de: - Added `Accordion` component.
  - Added `Breadcrumbs` component.
  - Added `Collapsible` component.
  - Added `Image` component.
  - Added `Progress` component.
  - Fix #78

### Patch Changes

- Updated dependencies [3b9d8de]
  - @kobalte/utils@0.4.0

## 0.4.0

### Minor Changes

- a71c1fb: fix #57, #58, #62, #64

## 0.3.1

### Patch Changes

- 6457a2b: fix #39 and #50

## 0.3.0

### Minor Changes

- 828eba6: Improve tree shaking

### Patch Changes

- Updated dependencies [828eba6]
  - @kobalte/utils@0.3.0

## 0.2.0

### Minor Changes

- b2ecae7: - Added `TextField` component.
  - Performance improvement.

### Patch Changes

- Updated dependencies [b2ecae7]
  - @kobalte/utils@0.2.0

## 0.1.0

### Minor Changes

- bb44c6a: Initial release

### Patch Changes

- Updated dependencies [bb44c6a]
  - @kobalte/utils@0.1.0
