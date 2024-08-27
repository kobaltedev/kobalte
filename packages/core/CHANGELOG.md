# @kobalte/core

## 0.13.6

### Patch Changes

- 512b844d: ## v0.13.6 (August 27, 2024)

  **Bug fixes**

  - Update missing export from `@kobalte/utils` ([#477](https://github.com/kobaltedev/kobalte/pull/477))

- Updated dependencies [512b844d]
  - @kobalte/utils@0.9.1

## 0.13.5

### Patch Changes

- aa6f894e: ## v0.13.5 (August 27, 2024)

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

## 0.13.4

### Patch Changes

- 1b888fa5: ## v0.13.4 (June 22, 2024)

  **New features**

  - Add source exports ([#408](https://github.com/kobaltedev/kobalte/pull/408))
  - Support string style prop ([#432](https://github.com/kobaltedev/kobalte/pull/432))

  **Bug fixes**

  - Combobox: convert textValue with optionTextValue ([#436](https://github.com/kobaltedev/kobalte/pull/436))
  - Polymorphic: override the `component` prop of `<Dynamic />` ([#437](https://github.com/kobaltedev/kobalte/pull/437))
  - Slider: inverted slider thumb in the wrong position ([#441](https://github.com/kobaltedev/kobalte/pull/441))
  - Wait for presence to finish before enabling scroll ([#447](https://github.com/kobaltedev/kobalte/pull/447))

## 0.13.3

### Patch Changes

- bd6999e: ## v0.13.3 (June 3, 2024)

  **New features**

  - [New `NavigationMenu` component](/docs/core/components/navigation-menu) ([#354](https://github.com/kobaltedev/kobalte/pull/409))

## 0.13.2

### Patch Changes

- a430a78: ## v0.13.2 (May 29, 2024)

  **Bug fixes**

  - Refactored polymorphic element type in CommonProps ([#420](https://github.com/kobaltedev/kobalte/pull/420))

## 0.13.1

### Patch Changes

- 16789fb: ## v0.13.1 (May 3, 2024)

  **New features**

  - NumberField: improve input handling ([#379](https://github.com/kobaltedev/kobalte/pull/379)) ([#395](https://github.com/kobaltedev/kobalte/pull/395))

  **Bug fixes**

  - Slider: call `onChangeEnd` on blur after changing value ([#402](https://github.com/kobaltedev/kobalte/pull/402))
  - Select: `options` non reactive inside suspense ([#401](https://github.com/kobaltedev/kobalte/pull/401))
  - Combobox: close on select with `focus` trigger mode ([#400](https://github.com/kobaltedev/kobalte/pull/400))
  - Menu: open link menu items ([#397](https://github.com/kobaltedev/kobalte/pull/397))

## 0.13.0

### Minor Changes

- dbf06fa: ## v0.13.0 (May 1, 2024)

  **Breaking changes**

  - [#381](https://github.com/kobaltedev/kobalte/pull/381)
  - Removed `asChild` and `<As/>`: [Polymorphism documentation](/docs/core/overview/polymorphism)
  - Refactored `as` prop: [Polymorphism documentation](/docs/core/overview/polymorphism)
  - [New component types](/docs/core/overview/polymorphism#types)

  **New features**

  - Allow importing individual components ([#391](https://github.com/kobaltedev/kobalte/pull/391))
  - [New `ToggleGroup` component](/docs/core/components/toggle-group) ([#378](https://github.com/kobaltedev/kobalte/pull/378))

## 0.12.6

### Patch Changes

- 570a6e9: ## v0.12.6 (March 16, 2024)

  **New features**

  - NumberField: `allowedInput` defaults to locale and format characters. ([#372](https://github.com/kobaltedev/kobalte/pull/372))

## 0.12.5

### Patch Changes

- eae01e1: ## v0.12.5 (March 14, 2024)

  **Bug fixes**

  - NumberField: value stuck on NaN ([#364](https://github.com/kobaltedev/kobalte/pull/370))
  - NumberField: locale decimal value ([#369](https://github.com/kobaltedev/kobalte/pull/369))

## 0.12.4

### Patch Changes

- 459d05b: ## v0.12.4 (March 9, 2024)

  **New features**

  - NumberField: add `rawValue` prop ([#364](https://github.com/kobaltedev/kobalte/pull/364))

  **Bug fixes**

  - NumberField: fix SSR ([#364](https://github.com/kobaltedev/kobalte/pull/364))

## 0.12.3

### Patch Changes

- c182d05: ## v0.12.3 (March 5, 2024)

  **New features**

  - Update to Solid Start `0.6.1` ([#354](https://github.com/kobaltedev/kobalte/pull/354))
  - [New `NumberField` component](/docs/core/components/number-field) ([#354](https://github.com/kobaltedev/kobalte/pull/354))

## 0.12.2

### Patch Changes

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
