import { createPolymorphicComponent, mergeDefaultProps } from "@kobalte/utils";
import { splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

import { useProgressContext } from "./progress-context";

/**
 * The accessible label text representing the current value in a human-readable format.
 */
export const ProgressValueLabel = createPolymorphicComponent<"div">(props => {
  const context = useProgressContext();

  props = mergeDefaultProps({ as: "div" }, props);

  const [local, others] = splitProps(props, ["as"]);

  return (
    <Dynamic
      component={local.as}
      children={context.valueLabel()}
      {...context.dataset()}
      {...others}
    />
  );
});
