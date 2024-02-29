# @kobalte/tests

## 0.6.0

### Minor Changes

- 21ad251: ## v0.12.2 (February 29, 2024)

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

## 0.5.0

### Minor Changes

- fb427bf: fix #249, #250, #252

## 0.4.0

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

## 0.3.1

### Patch Changes

- 81d2e40: fix: nexgen ts module resolutions

## 0.3.0

### Minor Changes

- 0a1b042: New Select and Polymorphism API

## 0.2.1

### Patch Changes

- 056ed63: Add `data-closed` attribute.

## 0.2.0

### Minor Changes

- 975d526: v0.6.0

## 0.1.0

### Minor Changes

- bb44c6a: Initial release
