import { ComponentProps, Show } from "solid-js";
import { Portal } from "solid-js/web";

import { useDialogContext } from "./dialog-context";

export interface DialogPortalProps extends ComponentProps<typeof Portal> {}

/**
 * Portals its children into the `body` when the dialog is open.
 */
export function DialogPortal(props: DialogPortalProps) {
  const context = useDialogContext();

  return (
    <Show when={context.contentPresence.isPresent() || context.overlayPresence.isPresent()}>
      <Portal {...props} />
    </Show>
  );
}
