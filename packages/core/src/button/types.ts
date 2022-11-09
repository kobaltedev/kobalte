import { Accessor, ComponentProps, JSX } from "solid-js";

export type ButtonParts =
  | "root"
  | "icon"
  | "leftIcon"
  | "rightIcon"
  | "loaderWrapper"
  | "loaderIcon";

export interface ButtonVariants {
  /** The color of the button. */
  color?: "primary" | "secondary" | "danger";

  /** The visual style of the button. */
  variant?: "solid" | "soft" | "outlined" | "plain";

  /** The size of the button. */
  size?: "xs" | "sm" | "md" | "lg";

  /** Whether the button should take all available width. */
  isFullWidth?: boolean;

  /** Whether the button is an icon only button. */
  isIconOnly?: boolean;

  /** Whether the button has an icon at the left of the label. */
  hasLeftIcon?: boolean;

  /** Whether the button has an icon at the right of the label. */
  hasRightIcon?: boolean;

  /** Whether the button has a loading text next to the loader icon. */
  hasLoadingText?: boolean;
}

export interface ButtonProps
  extends Omit<ButtonVariants, "hasLeftIcon" | "hasRightIcon" | "hasLoadingText"> {
  /** The placement of the loader when `isLoading` is true. */
  loaderPlacement?: "start" | "end";

  /** Whether the button is in a loading state. */
  isLoading?: boolean;

  /** Whether the button should be disabled. */
  isDisabled?: boolean;

  /** The label to show in the button when `loading` is true. */
  loadingText?: string;

  /** Replace the loader component when `isLoading` is set to `true`. */
  loader?: JSX.Element;

  /** If added, the button will show an icon before the button's label. */
  leftIcon?: JSX.Element;

  /** If added, the button will show an icon after the button's label. */
  rightIcon?: JSX.Element;

  /** The content of the button. */
  children?: JSX.Element;
}

export type ButtonContentProps = Pick<ButtonProps, "leftIcon" | "rightIcon" | "children">;

export interface ButtonContextValue {
  /** The CSS class names to apply. */
  classNames: Accessor<Record<ButtonParts, string>>;
}

export type ButtonConfig = Pick<ButtonProps, "color" | "variant" | "size" | "loaderPlacement">;

export interface IconButtonProps
  extends Omit<
    ButtonProps,
    | "loadingText"
    | "loaderPlacement"
    | "leftIcon"
    | "rightIcon"
    | "isFullWidth"
    | "isIconOnly"
    | "children"
  > {
  /** A label that describes the button. */
  "aria-label": string;

  /** The icon to be used in the button. */
  children?: JSX.Element;
}

export interface ButtonGroupVariants {
  /** The orientation of the group. */
  orientation?: "horizontal" | "vertical";
}

export type ButtonGroupContextValue = Pick<
  ButtonProps,
  "color" | "variant" | "size" | "isDisabled"
>;

export type ButtonGroupProps = ComponentProps<"div"> &
  ButtonGroupVariants &
  ButtonGroupContextValue;
