# @kobalte/core

## 0.12.1

### Patch Changes

- 86827c8: ## v0.12.1 (January 18, 2024)

  **Bug fixes**

  - Rerelease [`Menubar`](https://kobalte.dev/docs/core/components/menubar), removed by mistake in `0.12.0`.

## 0.12.0

### Minor Changes

- 7252051: ## v0.12.0 (January 14, 2024)

  **Breaking changes**

  - [#299](https://github.com/kobaltedev/kobalte/pull/299)
  - `"@internationalized/message"` is no longer required in `ssr.noExternal` for [SSR with vite/SolidStart](https://kobalte.dev/docs/core/overview/ssr).
  - `Breadcrumbs.Root` exposes a new [`translations` prop for localization](https://kobalte.dev/docs/core/components/breadcrumbs#breadcrumbsroot).
  - `Combobox.Root` exposes a new [`translations` prop for localization](https://kobalte.dev/docs/core/components/combobox#comboboxroot).
  - `Dialog.Root` exposes a new [`translations` prop for localization](https://kobalte.dev/docs/core/components/dialog#dialogroot).
  - `Popover.Root` exposes a new [`translations` prop for localization](https://kobalte.dev/docs/core/components/popover#popoverroot).
  - `Toast.Region` exposes a new [`translations` prop for localization](https://kobalte.dev/docs/core/components/toast#toastregion).
  - `Toast.Root` exposes a new [`translations` prop for localization](https://kobalte.dev/docs/core/components/toast#toastroot).

  **New features**

  - [#301](https://github.com/kobaltedev/kobalte/pull/301)

  **Bug fixes**

  - [#292](https://github.com/kobaltedev/kobalte/pull/292)
  - [#295](https://github.com/kobaltedev/kobalte/pull/295)

## 0.11.2

### Patch Changes

- 677f256: added `Slider` component

## 0.11.1

### Patch Changes

- 321e54c: changeset v0.11.1

  **New features**

  - Added `Skeleton` component.

  **Bug fixes**

  - [#264](https://github.com/kobaltedev/kobalte/pull/264)
  - [#272](https://github.com/kobaltedev/kobalte/pull/272)

## 0.11.0

### Minor Changes

- fb427bf: fix #249, #250, #252

### Patch Changes

- Updated dependencies [fb427bf]
  - @kobalte/utils@0.9.0

## 0.10.0

### Minor Changes

- d0e2414: Add Pagination component + bug fixes

### Patch Changes

- Updated dependencies [d0e2414]
  - @kobalte/utils@0.8.0

## 0.9.8

### Patch Changes

- d6b6a64: fix #230

## 0.9.7

### Patch Changes

- 9096706: fix: #226

## 0.9.6

### Patch Changes

- 2ad7923: fix #213, #214
- Updated dependencies [2ad7923]
  - @kobalte/utils@0.7.2

## 0.9.5

### Patch Changes

- db7cc8d: fix:

  - #205
  - #206
  - #207
  - remove Kobalte UI colors

## 0.9.4

### Patch Changes

- ae0ca30: fix: #195

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
