# @kobalte/utils

## 0.9.1

### Patch Changes

**Bug fixes**

- Update missing export from `@kobalte/utils` ([#477](https://github.com/kobaltedev/kobalte/pull/477))

## 0.9.0

### Minor Changes

- fb427bf: fix #249, #250, #252

## 0.8.0

### Minor Changes

- d0e2414: Add Pagination component + bug fixes

## 0.7.2

### Patch Changes

- 2ad7923: fix #213, #214

## 0.7.1

### Patch Changes

- 1b87fc6: fix exports in `@kobalte/utils`

## 0.7.0

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

## 0.6.1

### Patch Changes

- 81d2e40: fix: nexgen ts module resolutions

## 0.6.0

### Minor Changes

- 0a1b042: New Select and Polymorphism API

## 0.5.1

### Patch Changes

- 056ed63: Add `data-closed` attribute.

## 0.5.0

### Minor Changes

- 975d526: v0.6.0

## 0.4.0

### Minor Changes

- 3b9d8de: - Added `Accordion` component.
  - Added `Breadcrumbs` component.
  - Added `Collapsible` component.
  - Added `Image` component.
  - Added `Progress` component.
  - Fix #78

## 0.3.0

### Minor Changes

- 828eba6: Improve tree shaking

## 0.2.0

### Minor Changes

- b2ecae7: - Added `TextField` component.
  - Performance improvement.

## 0.1.0

### Minor Changes

- bb44c6a: Initial release
