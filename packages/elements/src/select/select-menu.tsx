import {
  callHandler,
  createPolymorphicComponent,
  mergeDefaultProps,
  mergeRefs,
} from "@kobalte/utils";
import { createEffect, JSX, onCleanup, Show, splitProps } from "solid-js";

import { useDialogContext, useDialogPortalContext } from "../dialog";
import { Listbox, ListboxProps } from "../listbox";
import { usePopoverContext } from "../popover/popover-context";
import { createFocusTrapRegion, createOverlay } from "../primitives";
import { useSelectContext } from "./select-context";

export interface SelectMenuProps extends ListboxProps {
  /** The HTML styles attribute (object form only). */
  style?: JSX.CSSProperties;

  /**
   * Used to force mounting when more control is needed.
   * Useful when controlling animation with SolidJS animation libraries.
   * It inherits from `Select.Portal`.
   */
  forceMount?: boolean;
}

export const SelectMenu = createPolymorphicComponent<"ul", SelectMenuProps>(props => {
  let ref: HTMLUListElement | undefined;

  const dialogContext = useDialogContext();
  const popoverContext = usePopoverContext();
  const portalContext = useDialogPortalContext();
  const context = useSelectContext();

  props = mergeDefaultProps(
    {
      as: "ul",
      id: context.generateId("listbox"),
    },
    props
  );

  const [local, others] = splitProps(props, ["ref", "id", "style", "forceMount", "onKeyDown"]);

  const { overlayProps } = createOverlay(
    {
      isOpen: context.isOpen,
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
      isDisabled: () => !context.isOpen(),
      autoFocus: true,
      restoreFocus: true,
    },
    () => ref
  );

  const onKeyDown: JSX.EventHandlerUnion<HTMLUListElement, KeyboardEvent> = e => {
    callHandler(e, local.onKeyDown);
    callHandler(e, overlayProps.onEscapeKeyDown);
  };

  createEffect(() => onCleanup(context.registerListbox(local.id!)));

  return (
    <Show when={local.forceMount || portalContext?.forceMount() || context.isOpen()}>
      <FocusTrap />
      <Listbox
        ref={mergeRefs(el => {
          popoverContext.setPanelRef(el);
          ref = el;
        }, local.ref)}
        id={local.id}
        state={context.listState()}
        autoFocus={context.autoFocus()}
        shouldSelectOnPressUp
        shouldFocusOnHover
        style={{ position: "relative", ...local.style }}
        onKeyDown={onKeyDown}
        //aria-labelledby={}
        {...dialogContext.dataset()}
        {...others}
      />
      <FocusTrap />
    </Show>
  );
});
