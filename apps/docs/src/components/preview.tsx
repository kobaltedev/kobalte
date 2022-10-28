import { hope } from "@kobalte/core";

export const Preview = hope("div", ({ vars }) => ({
  baseStyle: {
    mt: 4,
    roundedTop: "lg",
    border: `1px solid ${vars.colors.neutral[200]}`,
    overflowY: "auto",
    p: 4,

    // the second `pre.shiki` is for dark mode
    "& + pre.shiki, & + pre.shiki + pre.shiki": {
      mt: 0,
      mx: 0,
      mb: 4,
      p: 4,
      borderTop: "none",
      borderTopRadius: "none",
    },

    _dark: {
      borderColor: "neutral.700",
      bg: "common.black",
    },
  },
  variants: {
    isCentered: {
      true: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      },
    },
    isFullRounded: {
      true: {
        rounded: "lg",
      },
    },
  },
}));
