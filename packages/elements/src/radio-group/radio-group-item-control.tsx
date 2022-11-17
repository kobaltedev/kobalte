import { createPolymorphicComponent, mergeDefaultProps } from "@kobalte/utils";
import { splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

import { useRadioGroupItemContext } from "./radio-group-item-context";

/**
 * The element in the radio item that visually represents a radio/radio button.
 */
export const RadioGroupItemControl = createPolymorphicComponent<"div">(props => {
  const context = useRadioGroupItemContext();

  props = mergeDefaultProps({ as: "div" }, props);

  const [local, others] = splitProps(props, ["as"]);

  return (
    <Dynamic
      component={local.as}
      data-part="item-control"
      data-focus={context.isFocused() ? "" : undefined}
      data-focus-visible={context.isFocusVisible() ? "" : undefined}
      {...others}
    />
  );
});
