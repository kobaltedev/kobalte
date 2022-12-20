import { createPolymorphicComponent, mergeDefaultProps } from "@kobalte/utils";
import { createEffect, onCleanup, splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

import { useFormControlContext } from "./form-control-context";

/**
 * The description that gives the user more information on the form control.
 */
export const FormControlDescription = createPolymorphicComponent<"div">(props => {
  const context = useFormControlContext();

  props = mergeDefaultProps(
    {
      as: "div",
      id: context.generateId("description"),
    },
    props
  );

  const [local, others] = splitProps(props, ["as", "id"]);

  createEffect(() => onCleanup(context.registerDescription(local.id!)));

  return <Dynamic component={local.as} id={local.id} {...context.dataset()} {...others} />;
});
