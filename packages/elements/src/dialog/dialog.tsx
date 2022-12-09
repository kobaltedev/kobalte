import { createGenerateId, mergeDefaultProps } from "@kobalte/utils";
import {
  Accessor,
  createMemo,
  createSignal,
  createUniqueId,
  ParentComponent,
  splitProps,
} from "solid-js";

import { createDisclosure, createRegisterId } from "../primitives";
import { DialogBackdrop } from "./dialog-backdrop";
import { DialogCloseButton } from "./dialog-close-button";
import { DialogContext, DialogContextValue, DialogDataSet } from "./dialog-context";
import { DialogDescription } from "./dialog-description";
import { DialogPanel } from "./dialog-panel";
import { DialogPortal } from "./dialog-portal";
import { DialogPositioner } from "./dialog-positioner";
import { DialogTitle } from "./dialog-title";
import { DialogTrigger } from "./dialog-trigger";

type DialogComposite = {
  Trigger: typeof DialogTrigger;
  Portal: typeof DialogPortal;
  Backdrop: typeof DialogBackdrop;
  Positioner: typeof DialogPositioner;
  Panel: typeof DialogPanel;
  CloseButton: typeof DialogCloseButton;
  Title: typeof DialogTitle;
  Description: typeof DialogDescription;
};

export interface DialogOverlayProps {
  /**
   * Whether the dialog should block interaction with outside elements,
   * and be the only visible content for screen readers.
   */
  isModal?: boolean;

  /** Whether the scroll should be locked when the dialog is open. */
  preventScroll?: boolean;

  /** Whether to close the dialog when the user interacts outside it. */
  closeOnInteractOutside?: boolean;

  /** Whether pressing the escape key should close the dialog. */
  closeOnEsc?: boolean;

  /**
   * When user interacts with the argument element outside the dialog panel,
   * return `true` if the dialog should be closed. This gives you a chance to filter
   * out interaction with elements that should not dismiss the dialog.
   * By default, the dialog will always close on interaction outside the dialog panel.
   */
  shouldCloseOnInteractOutside?: (element: Element) => boolean;
}

export interface DialogFocusTrapRegionProps {
  /** Whether focus should be locked inside the dialog panel. */
  trapFocus?: boolean;

  /**
   * Whether focus should be set on a child element once the dialog is open.
   * If `true` focus will be set to the first focusable element inside the dialog panel.
   * If a `string` (query selector) is provided focus will be set to the target element.
   */
  autoFocus?: boolean;

  /**
   * Whether focus should be restored once the dialog close.
   * If `true` focus will be restored to the element that triggered the dialog.
   * If a `string` (query selector) is provided focus will be restored to the target element.
   */
  restoreFocus?: boolean;
}

export interface DialogProps extends DialogOverlayProps, DialogFocusTrapRegionProps {
  /** The controlled open state of the dialog. */
  isOpen?: boolean;

  /**
   * The default open state when initially rendered.
   * Useful when you do not need to control the open state.
   */
  defaultIsOpen?: boolean;

  /** Event handler called when the open state of the dialog changes. */
  onOpenChange?: (isOpen: boolean) => void;

  /**
   * A unique identifier for the component.
   * The id is used to generate id attributes for nested components.
   * If no id prop is provided, a generated id will be used.
   */
  id?: string;
}

/**
 * A dialog is a window overlaid on either the primary window or another dialog window.
 * This component is based on the [WAI-ARIA Dialog (Modal) Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialogmodal/)
 */
export const Dialog: ParentComponent<DialogProps> & DialogComposite = props => {
  const defaultId = `dialog-${createUniqueId()}`;

  props = mergeDefaultProps(
    {
      id: defaultId,
      isModal: true,
      closeOnInteractOutside: true,
      closeOnEsc: true,
      autoFocus: true,
      restoreFocus: true,
    },
    props
  );

  const [overlayProps, focusTrapRegionProps] = splitProps(
    props,
    [
      "isModal",
      "preventScroll",
      "closeOnInteractOutside",
      "closeOnEsc",
      "shouldCloseOnInteractOutside",
    ],
    ["trapFocus", "autoFocus", "restoreFocus"]
  );

  const [panelId, setPanelId] = createSignal<string>();
  const [titleId, setTitleId] = createSignal<string>();
  const [descriptionId, setDescriptionId] = createSignal<string>();

  const state = createDisclosure({
    isOpen: () => props.isOpen,
    defaultIsOpen: () => props.defaultIsOpen,
    onOpenChange: isOpen => props.onOpenChange?.(isOpen),
  });

  const dataset: Accessor<DialogDataSet> = createMemo(() => ({
    "data-expanded": state.isOpen() ? "" : undefined,
  }));

  const context: DialogContextValue = {
    ...state,
    dataset,
    panelId,
    titleId,
    descriptionId,
    overlayProps: () => overlayProps,
    focusTrapRegionProps: () => focusTrapRegionProps,
    generateId: createGenerateId(() => props.id!),
    registerPanel: createRegisterId(setPanelId),
    registerTitle: createRegisterId(setTitleId),
    registerDescription: createRegisterId(setDescriptionId),
  };

  return <DialogContext.Provider value={context}>{props.children}</DialogContext.Provider>;
};

Dialog.Trigger = DialogTrigger;
Dialog.Portal = DialogPortal;
Dialog.Backdrop = DialogBackdrop;
Dialog.Positioner = DialogPositioner;
Dialog.Panel = DialogPanel;
Dialog.CloseButton = DialogCloseButton;
Dialog.Title = DialogTitle;
Dialog.Description = DialogDescription;
