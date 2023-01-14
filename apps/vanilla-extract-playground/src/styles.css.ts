import { style } from "@vanilla-extract/css";
import { componentStateStyles } from "@kobalte/vanilla-extract";

export const container = style({
  padding: "2rem",
  selectors: {
    "&[data-kb-theme=dark]": {
      backgroundColor: "#1a1a1a",
    },
  },
});

export const button = style([
  {
    appearance: "none",
    display: "inline-flex",
    justifyContent: "center",
    alignItems: "center",
    border: "unset",
    height: "40px",
    width: "auto",
    outline: "none",
    borderRadius: "6px",
    padding: "0 16px",
    backgroundColor: "hsl(200 98% 39%)",
    color: "white",
    fontSize: "16px",
    lineHeight: "0",
    transition: "250ms background-color",
  },
  componentStateStyles({
    hover: {
      backgroundColor: "hsl(201 96% 32%)",
    },
    "focus-visible": {
      outline: "2px solid hsl(200 98% 39%)",
    },
    active: {
      backgroundColor: "hsl(201 90% 27%)",
    },
  }),
  componentStateStyles(
    {
      hover: {
        backgroundColor: "hsl(200 98% 39%)",

        not: {
          backgroundColor: "red",
        },
      },
      active: {
        backgroundColor: "hsl(199 89% 48%)",
      },
    },
    { parentSelector: '[data-kb-theme="dark"]' }
  ),
]);
