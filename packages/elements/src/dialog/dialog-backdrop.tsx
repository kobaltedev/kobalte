import { createPolymorphicComponent } from "@kobalte/utils";
import { Show, splitProps } from "solid-js";

import { Underlay } from "../overlay";
import { useDialogContext } from "./dialog-context";

export interface DialogBackdropProps {
  /**
   * Used to force mounting when more control is needed.
   * Useful when controlling animation with SolidJS animation libraries.
   */
  forceMount?: boolean;
}

/**
 * A layer that covers the inert portion of the view when the dialog is open.
 */
export const DialogBackdrop = createPolymorphicComponent<"div", DialogBackdropProps>(props => {
  const context = useDialogContext();

  const [local, others] = splitProps(props, ["forceMount"]);

  return (
    <Show when={local.forceMount || context.isOpen()}>
      <Underlay {...context.dataset()} {...others} />
    </Show>
  );
});
