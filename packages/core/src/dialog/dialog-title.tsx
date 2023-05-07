import { mergeDefaultProps, OverrideComponentProps } from "@kobalte/utils";
import { createEffect, onCleanup, splitProps } from "solid-js";

import { AsChildProp, Polymorphic } from "../polymorphic/index.jsx";
import { useDialogContext } from "./dialog-context.jsx";

export interface DialogTitleProps extends OverrideComponentProps<"h2", AsChildProp> {}

/**
 * An accessible title to be announced when the dialog is open.
 */
export function DialogTitle(props: DialogTitleProps) {
  const context = useDialogContext();

  props = mergeDefaultProps(
    {
      id: context.generateId("title"),
    },
    props
  );

  const [local, others] = splitProps(props, ["id"]);

  createEffect(() => onCleanup(context.registerTitleId(local.id!)));

  return <Polymorphic as="h2" id={local.id} {...others} />;
}
