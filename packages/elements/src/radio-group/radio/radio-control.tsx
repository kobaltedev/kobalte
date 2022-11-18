import { createPolymorphicComponent, mergeDefaultProps } from "@kobalte/utils";
import { splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

import { useRadioContext } from "./radio-context";

/**
 * The element that visually represents a radio button.
 */
export const RadioControl = createPolymorphicComponent<"div">(props => {
  const context = useRadioContext();

  props = mergeDefaultProps({ as: "div" }, props);

  const [local, others] = splitProps(props, ["as"]);

  return <Dynamic component={local.as} data-part="control" {...context.dataset()} {...others} />;
});
