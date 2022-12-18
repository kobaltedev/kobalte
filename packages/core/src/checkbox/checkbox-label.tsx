import { createPolymorphicComponent, mergeDefaultProps } from "@kobalte/utils";
import { splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

import { useCheckboxContext } from "./checkbox-context";

/**
 * The label that gives the user information on the checkbox.
 */
export const CheckboxLabel = createPolymorphicComponent<"span">(props => {
  const context = useCheckboxContext();

  props = mergeDefaultProps(
    {
      as: "span",
      id: context.generateId("label"),
    },
    props
  );

  const [local, others] = splitProps(props, ["as"]);

  return <Dynamic component={local.as} {...context.dataset()} {...others} />;
});
