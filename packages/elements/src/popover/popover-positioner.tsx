import { createPolymorphicComponent, mergeDefaultProps, mergeRefs } from "@kobalte/utils";
import { JSX, splitProps } from "solid-js";

import { DialogPositioner, DialogPositionerProps } from "../dialog/dialog-positioner";
import { usePopoverContext } from "./popover-context";

export interface PopoverPositionerProps extends DialogPositionerProps {
  /** The HTML styles attribute (object form only). */
  style?: JSX.CSSProperties;
}

/**
 * The element that positions the popover.
 */
export const PopoverPositioner = createPolymorphicComponent<"div", PopoverPositionerProps>(
  props => {
    const context = usePopoverContext();

    props = mergeDefaultProps({ as: "div" }, props);

    const [local, others] = splitProps(props, ["ref", "style"]);

    return (
      <DialogPositioner
        ref={mergeRefs(context.setPositionerRef, local.ref)}
        role="presentation"
        style={{ position: "absolute", top: 0, left: 0, ...local.style }}
        {...others}
      />
    );
  }
);
