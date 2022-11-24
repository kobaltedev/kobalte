import { createPolymorphicComponent, mergeDefaultProps } from "@kobalte/utils";
import { createEffect, on, onCleanup, splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

import { useRadioGroupContext } from "./radio-group-context";

/**
 * A label that gives the user information on the radio group.
 */
export const RadioGroupLabel = createPolymorphicComponent<"span">(props => {
  const context = useRadioGroupContext();

  props = mergeDefaultProps(
    {
      as: "span",
      id: context.getPartId("label"),
    },
    props
  );

  const [local, others] = splitProps(props, ["as", "id"]);

  createEffect(() => onCleanup(context.registerLabel(local.id!)));

  return <Dynamic component={local.as} id={local.id} {...context.dataset()} {...others} />;
});
