import { mergeDefaultProps, OverrideComponentProps } from "@kobalte/utils";
import { createEffect, onCleanup, splitProps } from "solid-js";

import { AsChildProp, Polymorphic } from "../polymorphic";
import { useAlertDialogContext } from "./alert-dialog-context";

export interface AlertDialogTitleProps extends OverrideComponentProps<"h2", AsChildProp> {}

/**
 * An accessible title to be announced when the alert dialog is open.
 */
export function AlertDialogTitle(props: AlertDialogTitleProps) {
  const context = useAlertDialogContext();

  props = mergeDefaultProps(
    {
      id: context.generateId("title"),
    },
    props
  );

  const [local, others] = splitProps(props, ["id"]);

  createEffect(() => onCleanup(context.registerTitleId(local.id!)));

  return <Polymorphic fallback="h2" id={local.id} {...others} />;
}
