import { createPolymorphicComponent, mergeRefs } from "@kobalte/utils";
import { splitProps } from "solid-js";

import { PopoverPositioner, PopoverPositionerProps } from "../popover/popover-positioner";
import { useHoverCardContext } from "./hover-card-context";

/**
 * A wrapper component to help positioning the hovercard panel on screen.
 */
export const HoverCardPositioner = createPolymorphicComponent<"div", PopoverPositionerProps>(
  props => {
    const context = useHoverCardContext();

    const [local, others] = splitProps(props, ["ref"]);

    return <PopoverPositioner ref={mergeRefs(context.setPositionerRef, local.ref)} {...others} />;
  }
);
