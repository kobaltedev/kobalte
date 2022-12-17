import {
  callHandler,
  createPolymorphicComponent,
  mergeDefaultProps,
  mergeRefs,
} from "@kobalte/utils";
import { createEffect, JSX, onCleanup, splitProps } from "solid-js";

import { useFormControlContext } from "../form-control";
import { Listbox } from "../listbox";
import { usePopoverContext } from "../popover/popover-context";
import { createFocusTrapRegion, createOverlay } from "../primitives";
import { useSelectContext } from "./select-context";

export interface SelectPanelProps {
  /** The HTML styles attribute (object form only). */
  style?: JSX.CSSProperties;

  /**
   * Used to force keeping the panel visible when more control is needed.
   * Useful when controlling animation with SolidJS animation libraries.
   */
  keepVisible?: boolean;
}

export const SelectPanel = createPolymorphicComponent<"div", SelectPanelProps>(props => {
  let ref: HTMLElement | undefined;

  const popoverContext = usePopoverContext();
  const formControlContext = useFormControlContext();
  const context = useSelectContext();

  props = mergeDefaultProps(
    {
      as: "div",
      id: context.generateId("listbox"),
    },
    props
  );

  const [local, others] = splitProps(props, ["ref", "id", "style", "keepVisible", "onKeyDown"]);

  const keepVisible = () => local.keepVisible || context.isOpen();

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
      trapFocus: context.isOpen,
      autoFocus: false, // Handled by the listbox itself
      restoreFocus: false, // Handled by the select
    },
    () => ref
  );

  const onKeyDown: JSX.EventHandlerUnion<any, KeyboardEvent> = e => {
    callHandler(e, local.onKeyDown);
    callHandler(e, overlayHandlers.onKeyDown);
  };

  createEffect(() => onCleanup(context.registerListbox(local.id!)));

  return (
    <>
      <FocusTrap />
      <Listbox
        ref={mergeRefs(el => {
          popoverContext.setPanelRef(el);
          context.setPanelRef(el);
          ref = el;
        }, local.ref)}
        hidden={!keepVisible()}
        items={context.items()}
        id={local.id}
        state={context.listState()}
        autoFocus={context.autoFocus()}
        shouldSelectOnPressUp
        shouldFocusOnHover
        style={{
          position: "relative",
          display: !keepVisible() ? "none" : undefined,
          ...local.style,
        }}
        aria-labelledby={context.menuAriaLabelledBy()}
        onItemsChange={context.setItems}
        onKeyDown={onKeyDown}
        {...formControlContext.dataset()}
        {...others}
      />
      <FocusTrap />
    </>
  );
});
