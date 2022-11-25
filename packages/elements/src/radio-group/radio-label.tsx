import { createPolymorphicComponent, mergeDefaultProps } from "@kobalte/utils";
import { splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

import { useRadioContext } from "./radio-context";

/**
 * A label that gives the user information on the radio button.
 */
export const RadioLabel = createPolymorphicComponent<"span">(props => {
  const context = useRadioContext();

  props = mergeDefaultProps({ as: "span" }, props);

  const [local, others] = splitProps(props, ["as"]);

  return <Dynamic component={local.as} {...context.dataset()} {...others} />;
});
