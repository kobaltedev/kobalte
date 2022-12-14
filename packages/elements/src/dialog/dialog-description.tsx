import { createPolymorphicComponent, mergeDefaultProps } from "@kobalte/utils";
import { createEffect, onCleanup, splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

import { useDialogContext } from "./dialog-context";

/**
 * An optional accessible description to be announced when the dialog is open.
 */
export const DialogDescription = createPolymorphicComponent<"p">(props => {
  const context = useDialogContext();

  props = mergeDefaultProps(
    {
      as: "p",
      id: context.generateId("description"),
    },
    props
  );

  const [local, others] = splitProps(props, ["as", "id"]);

  createEffect(() => onCleanup(context.registerDescription(local.id!)));

  return <Dynamic component={local.as} id={local.id} {...others} />;
});
