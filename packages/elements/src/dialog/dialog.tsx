import { mergeDefaultProps } from "@kobalte/utils";
import { Accessor, createMemo, createSignal, createUniqueId, ParentComponent } from "solid-js";

import { createDisclosure } from "../primitives";
import { DialogBackdrop } from "./dialog-backdrop";
import { DialogCloseButton } from "./dialog-close-button";
import { DialogContainer } from "./dialog-container";
import { DialogContext, DialogContextValue, DialogDataSet } from "./dialog-context";
import { DialogDescription } from "./dialog-description";
import { DialogPanel } from "./dialog-panel";
import { DialogPortal } from "./dialog-portal";
import { DialogTitle } from "./dialog-title";
import { DialogTrigger } from "./dialog-trigger";

type DialogComposite = {
  Trigger: typeof DialogTrigger;
  Portal: typeof DialogPortal;
  Backdrop: typeof DialogBackdrop;
  Container: typeof DialogContainer;
  Panel: typeof DialogPanel;
  CloseButton: typeof DialogCloseButton;
  Title: typeof DialogTitle;
  Description: typeof DialogDescription;
};

export interface DialogProps {
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
   * When user interacts with the argument element outside the dialog ref,
   * return true if the dialog should be closed. This gives you a chance to filter
   * out interaction with elements that should not dismiss the dialog.
   * By default, the dialog will always close on interaction outside.
   */
  shouldCloseOnInteractOutside?: (element: Element) => boolean;

  /** Whether the focus should be locked inside the dialog. */
  trapFocus?: boolean;

  /** Whether the first focusable element should be focused once the `Dialog.Panel` mounts. */
  autoFocus?: boolean;

  /** Whether focus should be restored to the element that triggered the `Dialog` once  the `Dialog.Panel` unmounts. */
  restoreFocus?: boolean;

  /**
   * A query selector to retrieve the element that should receive focus once the `Dialog.Panel` mounts.
   * This value has priority over `autoFocus`.
   */
  initialFocusSelector?: string;

  /**
   * A query selector to retrieve the element that should receive focus once the `Dialog.Panel` unmounts.
   * This value has priority over `restoreFocus`.
   */
  restoreFocusSelector?: string;
}

/**
 * A dialog is a window overlaid on either the primary window or another dialog window.
 * This component is based on the [WAI-ARIA Dialog (Modal) Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialogmodal/)
 */
export const Dialog: ParentComponent<DialogProps> & DialogComposite = props => {
  const defaultId = `kb-dialog-${createUniqueId()}`;

  props = mergeDefaultProps(
    {
      id: defaultId,
      isModal: true,
      preventScroll: true,
      closeOnInteractOutside: true,
      closeOnEsc: true,
      trapFocus: true,
      autoFocus: true,
      restoreFocus: true,
    },
    props
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
    "data-open": state.isOpen() ? "" : undefined,
  }));

  const context: DialogContextValue = {
    ...state,
    dataset,
    panelId,
    titleId,
    descriptionId,
    generateId: part => `${props.id!}-${part}`,
    registerPanel: id => {
      setPanelId(id);
      return () => setPanelId(undefined);
    },
    registerTitle: id => {
      setTitleId(id);
      return () => setTitleId(undefined);
    },
    registerDescription: id => {
      setDescriptionId(id);
      return () => setDescriptionId(undefined);
    },

    // Overlay related
    isModal: () => props.isModal,
    preventScroll: () => props.preventScroll,
    closeOnInteractOutside: () => props.closeOnInteractOutside,
    closeOnEsc: () => props.closeOnEsc,
    shouldCloseOnInteractOutside: element => {
      return props.shouldCloseOnInteractOutside?.(element) ?? true;
    },

    // FocusTrapRegion related
    trapFocus: () => props.trapFocus,
    autoFocus: () => props.autoFocus,
    restoreFocus: () => props.restoreFocus,
    initialFocusSelector: () => props.initialFocusSelector,
    restoreFocusSelector: () => props.restoreFocusSelector,
  };

  return <DialogContext.Provider value={context}>{props.children}</DialogContext.Provider>;
};

Dialog.Trigger = DialogTrigger;
Dialog.Portal = DialogPortal;
Dialog.Backdrop = DialogBackdrop;
Dialog.Container = DialogContainer;
Dialog.Panel = DialogPanel;
Dialog.CloseButton = DialogCloseButton;
Dialog.Title = DialogTitle;
Dialog.Description = DialogDescription;
