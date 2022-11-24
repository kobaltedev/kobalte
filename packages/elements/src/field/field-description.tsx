import { createPolymorphicComponent, mergeDefaultProps } from "@kobalte/utils";
import { createEffect, onCleanup, splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

import { useFieldContext } from "./field-context";

/**
 * A description that gives the user more information on the field.
 */
export const FieldDescription = createPolymorphicComponent<"div">(props => {
  const context = useFieldContext();

  props = mergeDefaultProps(
    {
      as: "div",
      id: context.generateFieldPartId("description"),
    },
    props
  );

  const [local, others] = splitProps(props, ["as", "id"]);

  createEffect(() => {
    const cleanup = context.registerFieldDescription(local.id!);
    onCleanup(cleanup);
  });

  return <Dynamic component={local.as} id={local.id} {...context.dataset()} {...others} />;
});
