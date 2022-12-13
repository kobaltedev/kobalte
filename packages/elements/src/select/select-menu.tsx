import {
  callHandler,
  createPolymorphicComponent,
  mergeDefaultProps,
  mergeRefs,
} from "@kobalte/utils";
import { createEffect, JSX, onCleanup, Show, splitProps } from "solid-js";

import { useDialogPortalContext } from "../dialog";
import { useFormControlContext } from "../form-control";
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

  const popoverContext = usePopoverContext();
  const portalContext = useDialogPortalContext();
  const formControlContext = useFormControlContext();
  const context = useSelectContext();

  props = mergeDefaultProps(
    {
      as: "ul",
      id: context.generateId("listbox"),
    },
    props
  );

  const [local, others] = splitProps(props, [
    "ref",
    "id",
    "style",
    "forceMount",
    "onKeyDown",
    "onFocusOut",
  ]);

  const { overlayHandlers } = createOverlay(
    {
      isOpen: context.isOpen,
      onClose: context.close,
      isModal: false,
      preventScroll: false,
      closeOnInteractOutside: true,
      closeOnEsc: true,
    },
    () => ref
  );

  const { FocusTrap } = createFocusTrapRegion(
    {
      trapFocus: () => context.isOpen(),
      autoFocus: false,
      restoreFocus: true,
    },
    () => ref
  );

  const onKeyDown: JSX.EventHandlerUnion<HTMLUListElement, KeyboardEvent> = e => {
    callHandler(e, local.onKeyDown);
    callHandler(e, overlayHandlers.onKeyDown);
  };

  const onFocusOut: JSX.EventHandlerUnion<HTMLUListElement, FocusEvent> = e => {
    if (e.currentTarget.contains(e.relatedTarget as Node)) {
      return;
    }

    callHandler(e, local.onFocusOut);

    context.setIsFocused(false);
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
        aria-labelledby={context.menuAriaLabelledBy()}
        onKeyDown={onKeyDown}
        onFocusOut={onFocusOut}
        {...formControlContext.dataset()}
        {...others}
      />
      <FocusTrap />
    </Show>
  );
});
