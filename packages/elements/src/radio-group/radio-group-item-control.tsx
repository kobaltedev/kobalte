import { createPolymorphicComponent, mergeDefaultProps } from "@kobalte/utils";
import { splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

/**
 * The element in the radio item that visually represents a radio/radio button.
 */
export const RadioGroupItemControl = createPolymorphicComponent<"div">(props => {
  props = mergeDefaultProps({ as: "div" }, props);

  const [local, others] = splitProps(props, ["as"]);

  return <Dynamic component={local.as} data-part="item-control" {...others} />;
});
