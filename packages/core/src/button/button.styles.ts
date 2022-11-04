import { bem, cva } from "../utils";
import { ButtonParts, ButtonVariants } from "./types";

const bemButton = bem("kb-button");

export const buttonStyles = cva<ButtonParts, ButtonVariants>(
  {
    root: {
      base: bemButton.block(),
      variants: {
        variant: {
          primary: bemButton.withModifier("primary"),
          secondary: bemButton.withModifier("secondary"),
          tertiary: bemButton.withModifier("tertiary"),
          default: bemButton.withModifier("default"),
        },
        size: {
          xs: bemButton.withModifier("xs"),
          sm: bemButton.withModifier("sm"),
          md: bemButton.withModifier("md"),
          lg: bemButton.withModifier("lg"),
        },
        isDestructive: {
          true: bemButton.withModifier("destructive"),
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
