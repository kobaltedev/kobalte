import { createPolymorphicComponent, mergeDefaultProps } from "@kobalte/utils";
import { splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

/**
 * The root container for a radio group's item.
 */
export const RadioGroupItem = createPolymorphicComponent<"label">(props => {
  props = mergeDefaultProps({ as: "label" }, props);

  const [local, others] = splitProps(props, ["as"]);

  return <Dynamic component={local.as} data-part="item" {...others} />;
});
