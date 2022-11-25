import { createPolymorphicComponent, mergeDefaultProps } from "@kobalte/utils";
import { splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

import { useSwitchContext } from "./switch-context";

/**
 * The element that visually represents a switch.
 */
export const SwitchControl = createPolymorphicComponent<"div">(props => {
  const context = useSwitchContext();

  props = mergeDefaultProps({ as: "div" }, props);

  const [local, others] = splitProps(props, ["as"]);

  return <Dynamic component={local.as} {...context.dataset()} {...others} />;
});
