import { createPolymorphicComponent, mergeDefaultProps } from "@kobalte/utils";
import { createEffect, onCleanup, Show, splitProps } from "solid-js";

import { Overlay } from "../overlay";
import { useDialogContext } from "./dialog-context";

export interface DialogPanelProps {
  /**
   * Used to force mounting when more control is needed.
   * Useful when controlling animation with SolidJS animation libraries.
   */
  forceMount?: boolean;
}

/**
 * The element that visually represents a dialog.
 * Contains the content to be rendered when the dialog is open.
 */
export const DialogPanel = createPolymorphicComponent<"div", DialogPanelProps>(props => {
  const context = useDialogContext();

  props = mergeDefaultProps(
    {
      as: "div",
      id: context.generateId("panel"),
    },
    props
  );

  const [local, others] = splitProps(props, [
    "id",
    "forceMount",
    "aria-labelledby",
    "aria-describedby",
  ]);

  createEffect(() => onCleanup(context.registerPanel(local.id!)));

  return (
    <Show when={local.forceMount || context.isOpen()}>
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
        aria-modal="true"
        aria-labelledby={local["aria-labelledby"] || context.titleId()}
        aria-describedby={local["aria-describedby"] || context.descriptionId()}
        {...context.dataset()}
        {...others}
      />
    </Show>
  );
});
