import { createPolymorphicComponent, mergeDefaultProps } from "@kobalte/utils";
import { createEffect, onCleanup, splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

import { usePopoverContext } from "./popover-context";

/**
 * An optional accessible description to be announced when the popover is open.
 */
export const PopoverDescription = createPolymorphicComponent<"p">(props => {
  const context = usePopoverContext();

  props = mergeDefaultProps(
    {
      as: "p",
      id: context.generateId("description"),
    },
    props
  );

  const [local, others] = splitProps(props, ["as", "id"]);

  createEffect(() => onCleanup(context.registerDescriptionId(local.id!)));

  return <Dynamic component={local.as} id={local.id} {...others} />;
});
