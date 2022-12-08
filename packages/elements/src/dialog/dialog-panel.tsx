import {
  access,
  callHandler,
  createPolymorphicComponent,
  mergeDefaultProps,
  mergeRefs,
} from "@kobalte/utils";
import { createEffect, JSX, onCleanup, Show, splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

import { createFocusTrapRegion, createOverlay } from "../primitives";
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
  let ref: HTMLDivElement | undefined;

  const context = useDialogContext();
  const portalContext = useDialogPortalContext();

  props = mergeDefaultProps(
    {
      as: "div",
      id: context.generateId("panel"),
    },
    props
  );

  const [local, others] = splitProps(props, ["as", "ref", "id", "forceMount", "onKeyDown"]);

  createEffect(() => onCleanup(context.registerPanel(local.id!)));

  const { overlayProps } = createOverlay(
    {
      isOpen: context.isOpen,
      onClose: context.close,
      isModal: () => context.overlayProps().isModal,
      preventScroll: () => context.overlayProps().preventScroll,
      closeOnInteractOutside: () => context.overlayProps().closeOnInteractOutside,
      closeOnEsc: () => context.overlayProps().closeOnEsc,
      shouldCloseOnInteractOutside: element => {
        return context.overlayProps().shouldCloseOnInteractOutside?.(element) ?? true;
      },
    },
    () => ref
  );

  const shouldTrapFocus = () => {
    return (
      (context.focusTrapRegionProps().trapFocus ?? context.overlayProps().isModal) &&
      context.isOpen()
    );
  };

  const { FocusTrap } = createFocusTrapRegion(
    {
      isDisabled: () => !shouldTrapFocus,
      autoFocus: () => context.focusTrapRegionProps().autoFocus,
      restoreFocus: () => context.focusTrapRegionProps().restoreFocus,
    },
    () => ref
  );

  const onKeyDown: JSX.EventHandlerUnion<HTMLDivElement, KeyboardEvent> = e => {
    callHandler(e, local.onKeyDown);
    callHandler(e, overlayProps.onEscapeKeyDown);
  };

  return (
    <Show when={local.forceMount || portalContext?.forceMount() || context.isOpen()}>
      <FocusTrap />
      <Dynamic
        component={local.as}
        ref={mergeRefs(el => (ref = el), local.ref)}
        role="dialog"
        id={local.id}
        tabIndex={-1}
        aria-label={context.ariaLabel()}
        aria-labelledby={context.ariaLabel() ? undefined : context.ariaLabelledBy()}
        aria-describedby={context.ariaDescribedBy()}
        onKeyDown={onKeyDown}
        {...context.dataset()}
        {...others}
      />
      <FocusTrap />
    </Show>
  );
});
