import { mergeDefaultProps } from "@kobalte/utils";
import { Accessor, createMemo, createSignal, createUniqueId, ParentComponent } from "solid-js";

import { createDisclosure } from "../primitives";
import { DialogBackdrop } from "./dialog-backdrop";
import { DialogCloseButton } from "./dialog-close-button";
import { DialogContext, DialogContextValue, DialogDataSet } from "./dialog-context";
import { DialogDescription } from "./dialog-description";
import { DialogPanel } from "./dialog-panel";
import { DialogPortal } from "./dialog-portal";
import { DialogPositioner } from "./dialog-positioner";
import { DialogTitle } from "./dialog-title";
import { DialogTrigger } from "./dialog-trigger";
import { OverlayProps } from "../overlay";

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

export interface DialogProps extends Omit<OverlayProps, "isOpen" | "onClose"> {
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

  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
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
    ariaControls: () => (state.isOpen() ? panelId() : undefined),
    ariaLabel: () => props["aria-label"],
    ariaLabelledBy: () => props["aria-labelledby"] || titleId(),
    ariaDescribedBy: () => props["aria-describedby"] || descriptionId(),
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
Dialog.Positioner = DialogPositioner;
Dialog.Panel = DialogPanel;
Dialog.CloseButton = DialogCloseButton;
Dialog.Title = DialogTitle;
Dialog.Description = DialogDescription;
