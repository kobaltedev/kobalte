import { createPolymorphicComponent, mergeDefaultProps } from "@kobalte/utils";
import { splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

import { useSwitchContext } from "./switch-context";

/**
 * The label that gives the user information on the switch.
 */
export const SwitchLabel = createPolymorphicComponent<"span">(props => {
  const context = useSwitchContext();

  props = mergeDefaultProps({ as: "span" }, props);

  const [local, others] = splitProps(props, ["as"]);

  return <Dynamic component={local.as} {...context.dataset()} {...others} />;
});
