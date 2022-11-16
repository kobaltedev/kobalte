import { createPolymorphicComponent, mergeDefaultProps } from "@kobalte/utils";
import { splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

/**
 * A label that gives the user information on the radio item.
 */
export const RadioGroupItemLabel = createPolymorphicComponent<"span">(props => {
  props = mergeDefaultProps({ as: "span" }, props);

  const [local, others] = splitProps(props, ["as"]);

  return <Dynamic component={local.as} data-part="item-label" {...others} />;
});
