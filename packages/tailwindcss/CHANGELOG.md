# @kobalte/tailwindcss

## 0.6.4

### Patch Changes

- 817f3f2: fix: remove tailwind warnings

## 0.6.3

### Patch Changes

- 38933c8: fix: tailwind color not exported when using kobalte ui colors

## 0.6.2

### Patch Changes

- de2ba76: Add Kobalte UI color palettes

## 0.6.1

### Patch Changes

- 24aeebb: v0.9.1

## 0.6.0

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

## 0.5.0

### Minor Changes

- 0a1b042: New Select and Polymorphism API

## 0.4.2

### Patch Changes

- 056ed63: Add `data-closed` attribute.

## 0.4.1

### Patch Changes

- 72b390e: fix: #101

## 0.4.0

### Minor Changes

- 975d526: v0.6.0

## 0.3.0

### Minor Changes

- 3b9d8de: - Added `Accordion` component.
  - Added `Breadcrumbs` component.
  - Added `Collapsible` component.
  - Added `Image` component.
  - Added `Progress` component.
  - Fix #78

## 0.2.0

### Minor Changes

- b2ecae7: - Added `TextField` component.
  - Performance improvement.

## 0.1.0

### Minor Changes

- bb44c6a: Initial release
