import { createPolymorphicComponent, mergeDefaultProps } from "@kobalte/utils";
import { JSX, splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

import { useProgressContext } from "./progress-context";

export interface ProgressFillOptions {
  /** The HTML styles attribute (object form only). */
  style?: JSX.CSSProperties;
}

/**
 * The component that visually represents the progress value.
 * Used to visually show the fill of `Progress.Track`.
 */
export const ProgressFill = createPolymorphicComponent<"div", ProgressFillOptions>(props => {
  const context = useProgressContext();

  props = mergeDefaultProps({ as: "div" }, props);

  const [local, others] = splitProps(props, ["as", "style"]);

  return (
    <Dynamic
      component={local.as}
      style={{
        "--kb-progress-fill-width": context.progressFillWidth(),
        ...local.style,
      }}
      {...context.dataset()}
      {...others}
    />
  );
});
