import { createPolymorphicComponent, mergeDefaultProps } from "@kobalte/utils";
import { splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

import { useRadioGroupItemContext } from "./radio-group-item-context";

/**
 * A label that gives the user information on the radio item.
 */
export const RadioGroupItemLabel = createPolymorphicComponent<"span">(props => {
  const context = useRadioGroupItemContext();

  props = mergeDefaultProps({ as: "span" }, props);

  const [local, others] = splitProps(props, ["as"]);

  return (
    <Dynamic
      component={local.as}
      data-part="item-label"
      data-focus={context.isFocused() ? "" : undefined}
      data-focus-visible={context.isFocusVisible() ? "" : undefined}
      {...others}
    />
  );
});
