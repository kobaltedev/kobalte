import { mergeDefaultProps, OverrideComponentProps } from "@kobalte/utils";
import { createEffect, onCleanup, splitProps } from "solid-js";

import { AsChildProp, Polymorphic } from "../polymorphic";
import { usePopoverContext } from "./popover-context";

/**
 * An accessible title to be announced when the popover is open.
 */
export function PopoverTitle(props: OverrideComponentProps<"h2", AsChildProp>) {
  const context = usePopoverContext();

  props = mergeDefaultProps(
    {
      id: context.generateId("title"),
    },
    props
  );

  const [local, others] = splitProps(props, ["id"]);

  createEffect(() => onCleanup(context.registerTitleId(local.id!)));

  return <Polymorphic fallback="h2" id={local.id} {...context.dataset()} {...others} />;
}
