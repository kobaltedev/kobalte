import { createPolymorphicComponent, mergeRefs } from "@kobalte/utils";
import { splitProps } from "solid-js";

import { PopoverContent, PopoverContentProps } from "../popover/popover-content";
import { useHoverCardContext } from "./hover-card-context";

/**
 * Contains the content to be rendered when the hovercard is open.
 */
export const HoverCardContent = createPolymorphicComponent<"div", PopoverContentProps>(props => {
  const context = useHoverCardContext();

  const [local, others] = splitProps(props, ["ref"]);

  return <PopoverContent ref={mergeRefs(context.setContentRef, local.ref)} {...others} />;
});
