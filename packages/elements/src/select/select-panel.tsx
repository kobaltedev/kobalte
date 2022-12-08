import { createPolymorphicComponent, mergeDefaultProps, mergeRefs } from "@kobalte/utils";
import { JSX, Show, splitProps } from "solid-js";

import { useDialogContext, useDialogPortalContext } from "../dialog";
import { Overlay } from "../overlay";
import { usePopoverContext } from "../popover/popover-context";

export interface SelectPanelProps {
  /** The HTML styles attribute (object form only). */
  style?: JSX.CSSProperties;

  /**
   * Used to force mounting when more control is needed.
   * Useful when controlling animation with SolidJS animation libraries.
   * It inherits from `Select.Portal`.
   */
  forceMount?: boolean;
}

/**
 * The element that contains the content to be rendered when the select is open.
 */
export const SelectPanel = createPolymorphicComponent<"div", SelectPanelProps>(props => {
  const dialogContext = useDialogContext();
  const popoverContext = usePopoverContext();
  const portalContext = useDialogPortalContext();

  props = mergeDefaultProps(
    {
      as: "div",
    },
    props
  );

  const [local, others] = splitProps(props, ["ref", "style", "forceMount"]);

  return (
    <Show when={local.forceMount || portalContext?.forceMount() || dialogContext.isOpen()}>
      <Overlay
        ref={mergeRefs(popoverContext.setPanelRef, local.ref)}
        style={{ position: "relative", ...local.style }}
        isOpen={dialogContext.isOpen()}
        onClose={dialogContext.close}
        autoFocus
        restoreFocus
        closeOnEsc
        closeOnInteractOutside
        isModal={false}
        trapFocus={false}
        preventScroll={false}
        {...dialogContext.dataset()}
        {...others}
      />
    </Show>
  );
});
