# @kobalte/tailwindcss

Vanilla Extract utils to style Kobalte Elements easily.

## Installation

```bash
npm install -D @kobalte/vanilla-extract
# or
yarn add -D @kobalte/vanilla-extract
# or
pnpm add -D @kobalte/vanilla-extract
```

> **Note** In order to use these utils you need to configure Vanilla Extract in your project. https://vanilla-extract.style

## Usage

### componentStateStyles

Create vanilla-extract complaint styles for styling data-\* attributes of Kobalte Elements.

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
    disabled: { opacity: 0.4 },
    hover: {
      backgroundColor: "red",
      not: {
        backgroundColor: "yellow",
      },
    },
  }),
  componentStateStyles(
    { hover: { backgroundColor: "red" } },
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
