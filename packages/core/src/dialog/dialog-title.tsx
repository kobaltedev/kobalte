import { createPolymorphicComponent, mergeDefaultProps } from "@kobalte/utils";
import { createEffect, onCleanup, splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

import { useDialogContext } from "./dialog-context";

/**
 * An accessible title to be announced when the dialog is open.
 */
export const DialogTitle = createPolymorphicComponent<"h2">(props => {
  const context = useDialogContext();

  props = mergeDefaultProps(
    {
      as: "h2",
      id: context.generateId("title"),
    },
    props
  );

  const [local, others] = splitProps(props, ["as", "id"]);

  createEffect(() => onCleanup(context.registerTitleId(local.id!)));

  return <Dynamic component={local.as} id={local.id} {...others} />;
});
