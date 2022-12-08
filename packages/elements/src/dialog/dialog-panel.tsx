import { createPolymorphicComponent, mergeDefaultProps } from "@kobalte/utils";
import { createEffect, onCleanup, Show, splitProps } from "solid-js";

import { Overlay } from "../overlay";
import { useDialogContext, useDialogPortalContext } from "./dialog-context";

export interface DialogPanelProps {
  /**
   * Used to force mounting when more control is needed.
   * Useful when controlling animation with SolidJS animation libraries.
   * It inherits from `Dialog.Portal`.
   */
  forceMount?: boolean;
}

/**
 * The element that contains the content to be rendered when the dialog is open.
 */
export const DialogPanel = createPolymorphicComponent<"div", DialogPanelProps>(props => {
  const context = useDialogContext();
  const portalContext = useDialogPortalContext();

  props = mergeDefaultProps(
    {
      as: "div",
      id: context.generateId("panel"),
    },
    props
  );

  const [local, others] = splitProps(props, ["id", "forceMount"]);

  createEffect(() => onCleanup(context.registerPanel(local.id!)));

  return (
    <Show when={local.forceMount || portalContext?.forceMount() || context.isOpen()}>
      <Overlay
        role="dialog"
        id={local.id}
        tabIndex={-1}
        isOpen={context.isOpen()}
        onClose={context.close}
        isModal={context.isModal()}
        preventScroll={context.preventScroll()}
        closeOnInteractOutside={context.closeOnInteractOutside()}
        closeOnEsc={context.closeOnEsc()}
        shouldCloseOnInteractOutside={context.shouldCloseOnInteractOutside}
        trapFocus={context.trapFocus()}
        autoFocus={context.autoFocus()}
        restoreFocus={context.restoreFocus()}
        initialFocusSelector={context.initialFocusSelector()}
        restoreFocusSelector={context.restoreFocusSelector()}
        aria-label={context.ariaLabel()}
        aria-labelledby={context.ariaLabel() ? undefined : context.ariaLabelledBy()}
        aria-describedby={context.ariaDescribedBy()}
        {...context.dataset()}
        {...others}
      />
    </Show>
  );
});
