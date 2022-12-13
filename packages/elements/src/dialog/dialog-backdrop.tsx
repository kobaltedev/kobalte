import { callHandler, createPolymorphicComponent, mergeDefaultProps } from "@kobalte/utils";
import { JSX, Show, splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

import { useDialogContext } from "./dialog-context";

/**
 * The layer that covers the inert portion of the view when the dialog is open.
 */
export const DialogBackdrop = createPolymorphicComponent<"div">(props => {
  const context = useDialogContext();

  props = mergeDefaultProps({ as: "div" }, props);

  const [local, others] = splitProps(props, ["as", "onPointerDown"]);

  const onPointerDown: JSX.EventHandlerUnion<HTMLDivElement, PointerEvent> = e => {
    callHandler(e, local.onPointerDown);

    // fixes a firefox issue that starts text selection https://bugzilla.mozilla.org/show_bug.cgi?id=1675846
    if (e.target === e.currentTarget) {
      e.preventDefault();
    }
  };

  return (
    <Show when={context.shouldMount()}>
      <Dynamic component={local.as} onPointerDown={onPointerDown} {...others} />
    </Show>
  );
});
