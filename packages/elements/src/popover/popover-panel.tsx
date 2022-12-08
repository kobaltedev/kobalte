import { createPolymorphicComponent, mergeRefs } from "@kobalte/utils";
import { JSX, splitProps } from "solid-js";

import { DialogPanel, DialogPanelProps } from "../dialog/dialog-panel";
import { usePopoverContext } from "./popover-context";

export interface PopoverPanelProps extends DialogPanelProps {
  /** The HTML styles attribute (object form only). */
  style?: JSX.CSSProperties;
}

/**
 * The element that contains the content to be rendered when the popover is open.
 */
export const PopoverPanel = createPolymorphicComponent<"div", PopoverPanelProps>(props => {
  const context = usePopoverContext();

  const [local, others] = splitProps(props, ["ref", "style"]);

  return (
    <DialogPanel
      ref={mergeRefs(context.setPanelRef, local.ref)}
      style={{ position: "relative", ...local.style }}
      {...others}
    />
  );
});
