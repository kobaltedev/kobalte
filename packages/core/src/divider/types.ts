import { ComponentProps } from "solid-js";

export interface DividerVariants {
  /** The orientation of the divider. */
  orientation?: "vertical" | "horizontal";

  /** Whether the divider has a label. */
  withLabel?: boolean;

  /** The placement of the label, if any. */
  labelPlacement?: "start" | "center" | "end";
}

export interface DividerProps extends ComponentProps<"hr">, Omit<DividerVariants, "withLabel"> {}

export type DividerConfig = Pick<DividerProps, "orientation" | "labelPlacement">;
