# @kobalte/tailwindcss

A TailwindCSS plugin for styling Kobalte Elements with `data-*` attributes by using modifiers like `ui-expanded:*`.

## Installation

```bash
npm install -D @kobalte/tailwindcss
# or
yarn add -D @kobalte/tailwindcss
# or
pnpm add -D @kobalte/tailwindcss
```

## Usage

Add the plugin to your `tailwind.config.js`:

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [],
  theme: {
    extend: {},
  },
  plugins: [
    require("@kobalte/tailwindcss"),

    // Or with a custom prefix:
    require("@kobalte/tailwindcss")({ prefix: "ui" }),
  ],
};
```

Style your component:

```tsx
import { Popover } from "@kobalte/elements";

export const MyPopover = () => (
  <Popover>
    <Popover.Trigger class="ui-disabled:bg-slate-100">Open</Popover.Trigger>
    <Popover.Content class="ui-expanded:shadow-md">...</Popover.Content>
  </Popover>
);
```

You can use the following modifiers:

| Modifier           | Inverse modifier       | Target data attribute |
| :----------------- | :--------------------- | :-------------------- |
| `ui-valid`         | `ui-not-valid`         | `data-valid`          |
| `ui-invalid`       | `ui-not-invalid`       | `data-invalid`        |
| `ui-required`      | `ui-not-required`      | `data-required`       |
| `ui-disabled`      | `ui-not-disabled`      | `data-disabled`       |
| `ui-readonly`      | `ui-not-readonly`      | `data-readonly`       |
| `ui-checked`       | `ui-not-checked`       | `data-checked`        |
| `ui-indeterminate` | `ui-not-indeterminate` | `data-indeterminate`  |
| `ui-selected`      | `ui-not-selected`      | `data-selected`       |
| `ui-pressed`       | `ui-not-pressed`       | `data-pressed`        |
| `ui-expanded`      | `ui-not-expanded`      | `data-expanded`       |
| `ui-hover`         | `ui-not-hover`         | `data-hover`          |
| `ui-focus`         | `ui-not-focus`         | `data-focus`          |
| `ui-focus-visible` | `ui-not-focus-visible` | `data-focus-visible`  |
| `ui-active`        | `ui-not-active`        | `data-active`         |

## Documentation

For full documentation, visit [kobalte.dev](https://kobalte.dev/).

## Acknowledgment

This plugin is an adaptation of [@headlessui/tailwindcss](https://github.com/tailwindlabs/headlessui), MIT Licensed, Copyright (c) 2020 Tailwind Labs.

## Changelog

All notable changes are described in the [CHANGELOG.md](./CHANGELOG.md) file.
