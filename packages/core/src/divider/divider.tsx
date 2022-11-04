import { clsx } from "clsx";
import { children, ComponentProps, Show, splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

import { mergeComponentConfigProps } from "../component-config";
import { bem, cva } from "../utils";

type DividerParts = "root" | "label";

interface DividerVariants {
  /** The orientation of the divider. */
  orientation?: "vertical" | "horizontal";

  /** Whether the divider has a label. */
  withLabel?: boolean;

  /** The placement of the label, if any. */
  labelPlacement?: "start" | "center" | "end";
}

export interface DividerProps extends ComponentProps<"hr">, Omit<DividerVariants, "withLabel"> {
  /** Props to be spread on the label component. */
  labelProps?: ComponentProps<"span">;
}

export type DividerConfig = Pick<DividerProps, "orientation" | "labelPlacement" | "labelProps">;

const bemDivider = bem("kb-divider");

const dividerStyles = cva<DividerParts, DividerVariants>(
  {
    root: {
      base: bemDivider.block(),
      variants: {
        orientation: {
          horizontal: bemDivider.withModifier("horizontal"),
          vertical: bemDivider.withModifier("vertical"),
        },
        withLabel: {
          true: bemDivider.withModifier("with-label"),
        },
        labelPlacement: {
          start: bemDivider.withModifier("label-start"),
          end: bemDivider.withModifier("label-end"),
        },
      },
    },
    label: {
      base: bemDivider.withElement("label"),
    },
  },
  {
    orientation: "horizontal",
    labelPlacement: "start",
    withLabel: false,
  }
);

export const Divider = (props: DividerProps) => {
  props = mergeComponentConfigProps("Divider", {}, props);

  const [local, variantProps, others] = splitProps(
    props,
    ["class", "children", "labelProps"],
    ["orientation", "labelPlacement"]
  );

  const resolvedChildren = children(() => props.children);
  const withLabel = () => !!resolvedChildren();

  const isVertical = () => variantProps.orientation === "vertical";

  const classNames = dividerStyles({
    get orientation() {
      return variantProps.orientation;
    },
    get labelPlacement() {
      return variantProps.labelPlacement;
    },
    get withLabel() {
      return withLabel();
    },
  });

  return (
    <Dynamic
      component={withLabel() ? "div" : "hr"}
      role={withLabel() ? "separator" : undefined}
      aria-orientation={isVertical() ? "vertical" : "horizontal"}
      class={clsx(classNames().root, local.class)}
      {...others}
    >
      <Show when={withLabel()}>
        <span {...local.labelProps} class={clsx(classNames().label, local.labelProps?.class)}>
          {resolvedChildren()}
        </span>
      </Show>
    </Dynamic>
  );
};
