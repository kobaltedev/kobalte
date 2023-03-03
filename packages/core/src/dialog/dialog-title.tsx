import { mergeDefaultProps, OverrideComponentProps } from "@kobalte/utils";
import { createEffect, onCleanup, splitProps } from "solid-js";

import { AsChildProp, Polymorphic } from "../polymorphic";
import { useDialogContext } from "./dialog-context";

/**
 * An accessible title to be announced when the dialog is open.
 */
export function DialogTitle(props: OverrideComponentProps<"h2", AsChildProp>) {
  const context = useDialogContext();

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
