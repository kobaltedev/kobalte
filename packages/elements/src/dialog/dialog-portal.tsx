import { ComponentProps, Show, splitProps } from "solid-js";
import { Portal } from "solid-js/web";

import { DialogPortalContext, DialogPortalContextValue, useDialogContext } from "./dialog-context";

export interface DialogPortalProps extends ComponentProps<typeof Portal> {
  /**
   * Used to force mounting when more control is needed.
   * Useful when controlling animation with SolidJS animation libraries.
   * If used on this part, it will be inherited by `Dialog.Backdrop` and `Dialog.Panel`.
   */
  forceMount?: boolean;
}

/**
 * Portals its children into the `body` when the dialog is open.
 */
export function DialogPortal(props: DialogPortalProps) {
  const dialogContext = useDialogContext();

  const [local, others] = splitProps(props, ["forceMount"]);

  const context: DialogPortalContextValue = {
    forceMount: () => local.forceMount,
  };

  return (
    <Show when={context.forceMount() || dialogContext.isOpen()}>
      <DialogPortalContext.Provider value={context}>
        <Portal {...others} />
      </DialogPortalContext.Provider>
    </Show>
  );
}
