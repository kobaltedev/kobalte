import { createPolymorphicComponent, mergeDefaultProps } from "@kobalte/utils";
import { splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

import { useRadioGroupItemContext } from "./radio-group-item-context";

/**
 * The element that visually represents a radio button.
 */
export const RadioGroupItemControl = createPolymorphicComponent<"div">(props => {
  const context = useRadioGroupItemContext();

  props = mergeDefaultProps(
    {
      as: "div",
      id: context.generateId("control"),
    },
    props
  );

  const [local, others] = splitProps(props, ["as"]);

  return <Dynamic component={local.as} {...context.dataset()} {...others} />;
});
