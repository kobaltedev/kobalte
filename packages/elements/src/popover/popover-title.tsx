import { createPolymorphicComponent, mergeDefaultProps } from "@kobalte/utils";
import { createEffect, onCleanup, splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

import { usePopoverContext } from "./popover-context";

/**
 * An accessible title to be announced when the popover is open.
 */
export const PopoverTitle = createPolymorphicComponent<"h2">(props => {
  const context = usePopoverContext();

  props = mergeDefaultProps(
    {
      as: "h2",
      id: context.generateId("title"),
    },
    props
  );

  const [local, others] = splitProps(props, ["as", "id"]);

  createEffect(() => onCleanup(context.registerTitle(local.id!)));

  return <Dynamic component={local.as} id={local.id} {...others} />;
});
