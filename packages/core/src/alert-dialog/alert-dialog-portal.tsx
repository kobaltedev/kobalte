import { ComponentProps, Show } from "solid-js";
import { Portal } from "solid-js/web";

import { useAlertDialogContext } from "./alert-dialog-context";

export interface AlertDialogPortalProps extends ComponentProps<typeof Portal> {}

/**
 * Portals its children into the `body` when the alert dialog is open.
 */
export function AlertDialogPortal(props: AlertDialogPortalProps) {
  const context = useAlertDialogContext();

  return (
    <Show when={context.contentPresence.isPresent() || context.overlayPresence.isPresent()}>
      <Portal {...props} />
    </Show>
  );
}
