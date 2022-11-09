import { clsx } from "clsx";
import { children, ComponentProps, splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

import { mergeComponentConfigProps } from "../component-config";
import { dividerLabelClass, dividerStyles } from "./divider.styles";
import { DividerProps } from "./types";

export const Divider = (props: DividerProps) => {
  props = mergeComponentConfigProps("Divider", {}, props);

  const [local, variantProps, others] = splitProps(
    props,
    ["class", "children"],
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
      {resolvedChildren()}
    </Dynamic>
  );
};

const DividerLabel = (props: ComponentProps<"span">) => {
  const [local, others] = splitProps(props, ["class"]);

  return <span class={clsx(dividerLabelClass, local.class)} {...others} />;
};

Divider.Label = DividerLabel;
