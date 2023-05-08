import { callHandler, mergeRefs, OverrideComponentProps } from "@kobalte/utils";
import { JSX, Show, splitProps } from "solid-js";

import { AsChildProp, Polymorphic } from "../polymorphic";
import { useDialogContext } from "./dialog-context";

export interface DialogOverlayOptions extends AsChildProp {
  /** The HTML styles attribute (object form only). */
  style?: JSX.CSSProperties;
}

export interface DialogOverlayProps extends OverrideComponentProps<"div", DialogOverlayOptions> {}

/**
 * A layer that covers the inert portion of the view when the dialog is open.
 */
export function DialogOverlay(props: DialogOverlayProps) {
  const context = useDialogContext();

  const [local, others] = splitProps(props, ["ref", "style", "onPointerDown"]);

  const onPointerDown: JSX.EventHandlerUnion<HTMLDivElement, PointerEvent> = e => {
    callHandler(e, local.onPointerDown);

    // fixes a firefox issue that starts text selection https://bugzilla.mozilla.org/show_bug.cgi?id=1675846
    if (e.target === e.currentTarget) {
      e.preventDefault();
    }
  };

  return (
    <Show when={context.overlayPresence.isPresent()}>
      <Polymorphic
        as="div"
        ref={mergeRefs(context.overlayPresence.setRef, local.ref)}
        // We re-enable pointer-events prevented by `Dialog.Content` to allow scrolling.
        style={{ "pointer-events": "auto", ...local.style }}
        data-expanded={context.isOpen() ? "" : undefined}
        data-closed={!context.isOpen() ? "" : undefined}
        onPointerDown={onPointerDown}
        {...others}
      />
    </Show>
  );
}
