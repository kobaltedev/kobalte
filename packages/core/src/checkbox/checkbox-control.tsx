import { createPolymorphicComponent, mergeDefaultProps } from "@kobalte/utils";
import { splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

import { useCheckboxContext } from "./checkbox-context";

/**
 * The element that visually represents a checkbox.
 */
export const CheckboxControl = createPolymorphicComponent<"div">(props => {
  const context = useCheckboxContext();

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
