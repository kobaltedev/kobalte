import { styled } from "@kobalte/core";

export const Callout = styled("div", {
  base: "flex items-center rounded mt-6 p-4 text-base",
  variants: {
    type: {
      note: [
        "bg-primary-50 text-primary-800",
        "dark:bg-primary-500/60 text-primary-200",
      ],
      warning: [
        "bg-warning-50 text-warning-800",
        "dark:bg-warning-500/20 text-warning-400",
      ],
    },
  },
  defaultVariants: {
    type: "note",
  },
});
