import { callHandler, createPolymorphicComponent, mergeDefaultProps } from "@kobalte/utils";
import { JSX, Show, splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

import { useDialogContext, useDialogPortalContext } from "./dialog-context";

export interface DialogBackdropProps {
  /**
   * Used to force mounting when more control is needed.
   * Useful when controlling animation with SolidJS animation libraries.
   * It inherits from `Dialog.Portal`.
   */
  forceMount?: boolean;
}

/**
 * The layer that covers the inert portion of the view when the dialog is open.
 */
export const DialogBackdrop = createPolymorphicComponent<"div", DialogBackdropProps>(props => {
  const context = useDialogContext();
  const portalContext = useDialogPortalContext();

  props = mergeDefaultProps({ as: "div" }, props);

  const [local, others] = splitProps(props, ["as", "forceMount", "onPointerDown"]);

  const onPointerDown: JSX.EventHandlerUnion<HTMLDivElement, PointerEvent> = e => {
    callHandler(e, local.onPointerDown);

    // fixes a firefox issue that starts text selection https://bugzilla.mozilla.org/show_bug.cgi?id=1675846
    if (e.target === e.currentTarget) {
      e.preventDefault();
    }
  };

  return (
    <Show when={local.forceMount || portalContext?.forceMount() || context.isOpen()}>
      <Dynamic component={local.as} onPointerDown={onPointerDown} {...others} />
    </Show>
  );
});
