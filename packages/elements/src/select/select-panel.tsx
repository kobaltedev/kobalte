import {
  callHandler,
  createPolymorphicComponent,
  mergeDefaultProps,
  mergeRefs,
} from "@kobalte/utils";
import { JSX, Show, splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

import { useDialogContext, useDialogPortalContext } from "../dialog";
import { usePopoverContext } from "../popover/popover-context";
import { createFocusTrapRegion, createOverlay } from "../primitives";

export interface SelectPanelProps {
  /** The HTML styles attribute (object form only). */
  style?: JSX.CSSProperties;

  /**
   * Used to force mounting when more control is needed.
   * Useful when controlling animation with SolidJS animation libraries.
   * It inherits from `Select.Portal`.
   */
  forceMount?: boolean;
}

/**
 * The element that contains the content to be rendered when the select is open.
 */
export const SelectPanel = createPolymorphicComponent<"div", SelectPanelProps>(props => {
  let ref: HTMLDivElement | undefined;

  const dialogContext = useDialogContext();
  const popoverContext = usePopoverContext();
  const portalContext = useDialogPortalContext();

  props = mergeDefaultProps({ as: "div" }, props);

  const [local, others] = splitProps(props, ["as", "ref", "style", "forceMount", "onKeyDown"]);

  const { overlayProps } = createOverlay(
    {
      isOpen: dialogContext.isOpen,
      onClose: dialogContext.close,
      isModal: false,
      preventScroll: false,
      closeOnInteractOutside: true,
      closeOnEsc: true,
    },
    () => ref
  );

  const { FocusTrap } = createFocusTrapRegion(
    {
      isDisabled: () => !dialogContext.isOpen(),
      autoFocus: true,
      restoreFocus: true,
    },
    () => ref
  );

  const onKeyDown: JSX.EventHandlerUnion<HTMLDivElement, KeyboardEvent> = e => {
    callHandler(e, local.onKeyDown);
    callHandler(e, overlayProps.onEscapeKeyDown);
  };

  return (
    <Show when={local.forceMount || portalContext?.forceMount() || dialogContext.isOpen()}>
      <FocusTrap />
      <Dynamic
        component={local.as}
        ref={mergeRefs(el => {
          popoverContext.setPanelRef(el);
          ref = el;
        }, local.ref)}
        style={{ position: "relative", ...local.style }}
        onKeyDown={onKeyDown}
        {...dialogContext.dataset()}
        {...others}
      />
      <FocusTrap />
    </Show>
  );
});
