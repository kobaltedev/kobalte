import { bem, cva } from "../utils";
import { ButtonParts, ButtonVariants } from "./types";

const bemButton = bem("kb-button");

export const buttonStyles = cva<ButtonParts, ButtonVariants>(
  {
    root: {
      base: bemButton.block(),
      variants: {
        color: {
          primary: bemButton.withModifier("primary"),
          secondary: bemButton.withModifier("secondary"),
          danger: bemButton.withModifier("danger"),
        },
        variant: {
          solid: bemButton.withModifier("solid"),
          soft: bemButton.withModifier("soft"),
          outlined: bemButton.withModifier("outlined"),
          plain: bemButton.withModifier("plain"),
          default: bemButton.withModifier("default"),
        },
        size: {
          xs: bemButton.withModifier("xs"),
          sm: bemButton.withModifier("sm"),
          md: bemButton.withModifier("md"),
          lg: bemButton.withModifier("lg"),
        },
        isFullWidth: {
          true: bemButton.withModifier("full-width"),
        },
        isIconOnly: {
          true: bemButton.withModifier("icon-only"),
        },
      },
    },
    icon: {
      base: bemButton.withElement("icon"),
    },
    leftIcon: {
      base: bemButton.withElement("left-icon"),
    },
    rightIcon: {
      base: bemButton.withElement("right-icon"),
    },
    loaderWrapper: {
      base: bemButton.withElement("loader-wrapper"),
      variants: {
        hasLoadingText: {
          true: bemButton.withElementModifier("loader-wrapper", "has-loading-text"),
        },
      },
    },
    loaderIcon: {
      base: bemButton.withElement("loader-icon"),
    },
  },
  {
    variant: "default",
    size: "md",
  }
);
