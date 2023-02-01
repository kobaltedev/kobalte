import {
  callHandler,
  createPolymorphicComponent,
  mergeDefaultProps,
  mergeRefs,
} from "@kobalte/utils";
import { JSX, Show, splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

import { useDialogContext } from "./dialog-context";

export interface DialogOverlayOptions {
  /** The HTML styles attribute (object form only). */
  style?: JSX.CSSProperties;
}

/**
 * A layer that covers the inert portion of the view when the dialog is open.
 */
export const DialogOverlay = createPolymorphicComponent<"div", DialogOverlayOptions>(props => {
  const context = useDialogContext();

  props = mergeDefaultProps({ as: "div" }, props);

  const [local, others] = splitProps(props, ["as", "ref", "style", "onPointerDown"]);

  const onPointerDown: JSX.EventHandlerUnion<HTMLDivElement, PointerEvent> = e => {
    callHandler(e, local.onPointerDown);

    // fixes a firefox issue that starts text selection https://bugzilla.mozilla.org/show_bug.cgi?id=1675846
    if (e.target === e.currentTarget) {
      e.preventDefault();
    }
  };

  return (
    <Show when={context.overlayPresence.isPresent()}>
      <Dynamic
        component={local.as}
        ref={mergeRefs(context.overlayPresence.setRef, local.ref)}
        // We re-enable pointer-events prevented by `Dialog.Content` to allow scrolling.
        style={{ "pointer-events": "auto", ...local.style }}
        data-expanded={context.isOpen() ? "" : undefined}
        onPointerDown={onPointerDown}
        {...others}
      />
    </Show>
  );
});
