import { mergeDefaultProps, OverrideComponentProps } from "@kobalte/utils";
import { createEffect, onCleanup, splitProps } from "solid-js";

import { AsChildProp, Polymorphic } from "../polymorphic";
import { useToastContext } from "./toast-context";

export interface ToastDescriptionOptions extends AsChildProp {}

export type ToastDescriptionProps = OverrideComponentProps<"div", ToastDescriptionOptions>;

/**
 * An optional accessible description to be announced when the toast is open.
 */
export function ToastDescription(props: ToastDescriptionProps) {
  const context = useToastContext();

  props = mergeDefaultProps(
    {
      id: context.generateId("description"),
    },
    props
  );

  const [local, others] = splitProps(props, ["id"]);

  createEffect(() => onCleanup(context.registerDescriptionId(local.id!)));

  return <Polymorphic as="div" id={local.id} {...others} />;
}
