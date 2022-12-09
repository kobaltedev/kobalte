import { createPolymorphicComponent, mergeRefs } from "@kobalte/utils";
import { splitProps } from "solid-js";

import { PopoverPanel, PopoverPanelProps } from "../popover/popover-panel";
import { useHoverCardContext } from "./hover-card-context";

export interface HoverCardPanelProps extends PopoverPanelProps {}

/**
 * The element that contains the content to be rendered when the hover card is open.
 */
export const HoverCardPanel = createPolymorphicComponent<"div", HoverCardPanelProps>(props => {
  const context = useHoverCardContext();

  const [local, others] = splitProps(props, ["ref"]);

  return <PopoverPanel ref={mergeRefs(context.setPanelRef, local.ref)} {...others} />;
});
