import { mergeDefaultProps } from "@kobalte/utils";
import { ComponentProps, createEffect, onCleanup, splitProps } from "solid-js";

import { Polymorphic } from "../polymorphic";
import { useDialogContext } from "./dialog-context";

/**
 * An optional accessible description to be announced when the dialog is open.
 */
export function DialogDescription(props: ComponentProps<"p">) {
  const context = useDialogContext();

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
