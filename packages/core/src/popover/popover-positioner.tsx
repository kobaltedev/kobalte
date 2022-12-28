import { createPolymorphicComponent, mergeDefaultProps } from "@kobalte/utils";
import { Show, splitProps } from "solid-js";

import { PopperPositioner, PopperPositionerProps } from "../popper/popper-positioner";
import { usePopoverContext } from "./popover-context";

/**
 * A wrapper component to help positioning the popover content on screen.
 */
export const PopoverPositioner = createPolymorphicComponent<"div", PopperPositionerProps>(props => {
  const context = usePopoverContext();

  props = mergeDefaultProps({ as: "div" }, props);

  const [local, others] = splitProps(props, ["style"]);

  return (
    <Show when={context.shouldMount()}>
      <PopperPositioner
        // We re-enable pointer-events prevented by `Popover.Content` to allow scrolling.
        style={{ "pointer-events": "auto", ...local.style }}
        {...others}
      />
    </Show>
  );
});
