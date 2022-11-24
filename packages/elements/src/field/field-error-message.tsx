import { createPolymorphicComponent, mergeDefaultProps } from "@kobalte/utils";
import { createEffect, onCleanup, splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

import { useFieldContext } from "./field-context";

/**
 * An error message that gives the user information about how to fix a validation error on the field.
 */
export const FieldErrorMessage = createPolymorphicComponent<"div">(props => {
  const context = useFieldContext();

  props = mergeDefaultProps(
    {
      as: "div",
      id: context.generateFieldPartId("error-message"),
    },
    props
  );

  const [local, others] = splitProps(props, ["as", "id"]);

  createEffect(() => onCleanup(context.registerErrorMessage(local.id!)));

  return <Dynamic component={local.as} id={local.id} {...context.dataset()} {...others} />;
});
