import { createPolymorphicComponent, mergeDefaultProps, mergeRefs } from "@kobalte/utils";
import { createEffect, onCleanup, splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

import { usePopoverContext } from "./popover-context";

/**
 * An optional element to position the `Popover.Panel` against.
 * If this part is not used, the content will position alongside the `Popover.Trigger`.
 */
export const PopoverAnchor = createPolymorphicComponent<"div">(props => {
  const context = usePopoverContext();

  props = mergeDefaultProps(
    {
      as: "div",
    },
    props
  );

  const [local, others] = splitProps(props, ["as", "ref"]);

  return (
    <Dynamic
      component={local.as}
      ref={mergeRefs(context.setAnchorRef, local.ref)}
      {...context.dataset()}
      {...others}
    />
  );
});