# @kobalte/tailwindcss

Vanilla Extract utils for styling Kobalte Elements easily.

> **Note** In order to use these utils you need to install @vanilla-extract/css and it's plugin to process the css (e.g. @vanilla-extract/vite-plugin). https://vanilla-extract.style

## Installation

```bash
npm install -D @kobalte/vanilla-extract
# or
yarn add -D @kobalte/vanilla-extract
# or
pnpm add -D @kobalte/vanilla-extract
```

## Usage

### componentStateStyles

In order to style kobalte elements with data-\* attributes you can use the `componentStateStyles` function in your `.css.ts` files.

```ts
// styles.css
import { style } from "@vanilla-extract/css";
import { componentStateStyles } from "@kobalte/vanilla-extract";

const button = style([
  {
    background: "blue",
    padding: "2px 6px",
  },
  componentStateStyles({
    // { selectors: { &[data-disabled] {} }
    disabled: {
      opacity: 0.4,
    },
    // { selectors: { &[data-hover] {} }
    hover: {
      backgroundColor: "red",
      // { selectors: { &:not([data-hover]) {} }
      not: {
        backgroundColor: "yellow",
      },
    },
  }),
  componentStateStyles(
    {
      // { selectors: { '[data-theme=dark] &[data-hover]'  {} }
      hover: {
        backgroundColor: "red",
      },
    },
    { parentSelector: "[data-theme=dark]" }
  ),
]);
```

Then apply your styles to the component:

```tsx
import { Button } from "@kobalte/core";
import { button } from "./styles.css";

export const MyButton = () => <Button.Root class={button}>...</Button.Root>;
```

## Documentation

For full documentation, visit [kobalte.dev](https://kobalte.dev/docs/overview/styling#using-the-tailwindcss-plugin).

## Changelog

All notable changes are described in the [CHANGELOG.md](./CHANGELOG.md) file.
