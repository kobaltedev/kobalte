import { createPolymorphicComponent, mergeDefaultProps } from "@kobalte/utils";
import { splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

import { useCheckboxContext } from "./checkbox-context";

/**
 * The indicator that is used to visually indicate whether the checkbox is checked or not.
 */
export const CheckboxIndicator = createPolymorphicComponent<"div">(props => {
  const context = useCheckboxContext();

  props = mergeDefaultProps(
    {
      as: "div",
      id: context.generateId("indicator"),
    },
    props
  );

  const [local, others] = splitProps(props, ["as"]);

  return <Dynamic component={local.as} {...context.dataset()} {...others} />;
});
