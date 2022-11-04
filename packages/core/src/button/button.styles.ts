import { cva } from "../utils";

type ButtonParts = "root" | "icon" | "loaderWrapper" | "loaderIcon";

export interface ButtonVariants {
  /** The color of the button. */
  color?: "primary" | "secondary" | "success" | "warning" | "danger";

  /** The visual style of the button. */
  variant?: "solid" | "soft" | "outlined" | "plain";

  /** The size of the button. */
  size?: "xs" | "sm" | "md" | "lg";

  /** Whether the button should take all available width. */
  isFullWidth?: boolean;

  /** Whether the button is an icon only button. */
  isIconOnly?: boolean;
}

export const buttonStyles = cva<ButtonParts, ButtonVariants>(
  {
    root: {
      base: "kb-button",
      variants: {
        color: {
          primary: "kb-button--primary",
          secondary: "kb-button--secondary",
          success: "kb-button--success",
          warning: "kb-button--warning",
          danger: "kb-button--danger",
        },
        variant: {
          solid: "kb-button--solid",
          soft: "kb-button--soft",
          outlined: "kb-button--outlined",
          plain: "kb-button--plain",
        },
        size: {
          xs: "kb-button--xs",
          sm: "kb-button--sm",
          md: "kb-button--md",
          lg: "kb-button--lg",
        },
        isFullWidth: {
          true: "kb-button--full-width",
        },
        isIconOnly: {
          true: "kb-button--icon-only",
        },
      },
    },
    icon: {
      base: "kb-button__icon",
    },
    loaderWrapper: {
      base: "kb-button__loader-wrapper",
    },
    loaderIcon: {
      base: "kb-button__loader-icon",
    },
  },
  {
    color: "secondary",
    variant: "soft",
    size: "md",
  }
);
