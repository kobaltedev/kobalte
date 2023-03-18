import { mergeDefaultProps, OverrideComponentProps } from "@kobalte/utils";
import { createEffect, onCleanup, splitProps } from "solid-js";

import { AsChildProp, Polymorphic } from "../polymorphic";
import { useAlertDialogContext } from "./alert-dialog-context";

export interface AlertDialogDescriptionProps extends OverrideComponentProps<"p", AsChildProp> {}

/**
 * An optional accessible description to be announced when the alert dialog is open.
 */
export function AlertDialogDescription(props: AlertDialogDescriptionProps) {
  const context = useAlertDialogContext();

  props = mergeDefaultProps(
    {
      id: context.generateId("description"),
    },
    props
  );

  const [local, others] = splitProps(props, ["id"]);

  createEffect(() => onCleanup(context.registerDescriptionId(local.id!)));

  return <Polymorphic fallback="p" id={local.id} {...others} />;
}
