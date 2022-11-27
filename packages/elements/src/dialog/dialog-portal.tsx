import { ComponentProps, Show, splitProps } from "solid-js";
import { Portal } from "solid-js/web";

import { useDialogContext } from "./dialog-context";

export interface DialogPortalProps extends ComponentProps<typeof Portal> {
  /**
   * Used to force mounting when more control is needed.
   * Useful when controlling animation with SolidJS animation libraries.
   */
  forceMount?: boolean;
}

/**
 * Portals its children into the `body` when the dialog is open.
 */
export function DialogPortal(props: DialogPortalProps) {
  const context = useDialogContext();

  const [local, others] = splitProps(props, ["forceMount"]);

  return (
    <Show when={local.forceMount || context.isOpen()}>
      <Portal {...others} />
    </Show>
  );
}
