import { createGenerateId, mergeDefaultProps } from "@kobalte/utils";
import { createSignal, createUniqueId, ParentComponent } from "solid-js";

import { createDisclosureState, createRegisterId } from "../primitives";
import { DialogCloseButton } from "./dialog-close-button";
import { DialogContent } from "./dialog-content";
import { DialogContext, DialogContextValue } from "./dialog-context";
import { DialogDescription } from "./dialog-description";
import { DialogOverlay } from "./dialog-overlay";
import { DialogPortal } from "./dialog-portal";
import { DialogPositioner } from "./dialog-positioner";
import { DialogTitle } from "./dialog-title";
import { DialogTrigger } from "./dialog-trigger";

type DialogComposite = {
  Trigger: typeof DialogTrigger;
  Portal: typeof DialogPortal;
  Overlay: typeof DialogOverlay;
  Positioner: typeof DialogPositioner;
  Content: typeof DialogContent;
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

  /** Whether the dialog should be the only visible content for screen readers. */
  isModal?: boolean;

  /** Whether pressing the escape key should close the dialog. */
  closeOnEsc?: boolean;

  /**
   * Whether to close the dialog when the user interacts outside it.
   * Specifically, when a `pointerdown` event happens outside or focus moves outside of it.
   */
  closeOnInteractOutside?: boolean;

  /**
   * Used to force mounting the dialog (portal, overlay, positioner and content) when more control is needed.
   * Useful when controlling animation with SolidJS animation libraries.
   */
  forceMount?: boolean;
}

/**
 * A dialog is a window overlaid on either the primary window or another dialog window.
 */
export const Dialog: ParentComponent<DialogProps> & DialogComposite = props => {
  const defaultId = `dialog-${createUniqueId()}`;

  props = mergeDefaultProps(
    {
      id: defaultId,
      isModal: true,
      closeOnEsc: true,
      closeOnInteractOutside: true,
    },
    props
  );

  const [contentId, setContentId] = createSignal<string>();
  const [titleId, setTitleId] = createSignal<string>();
  const [descriptionId, setDescriptionId] = createSignal<string>();

  const [triggerRef, setTriggerRef] = createSignal<HTMLElement>();

  const disclosureState = createDisclosureState({
    isOpen: () => props.isOpen,
    defaultIsOpen: () => props.defaultIsOpen,
    onOpenChange: isOpen => props.onOpenChange?.(isOpen),
  });

  const context: DialogContextValue = {
    isOpen: disclosureState.isOpen,
    shouldMount: () => props.forceMount || disclosureState.isOpen(),
    contentId,
    titleId,
    descriptionId,
    triggerRef,
    isModal: () => props.isModal!,
    closeOnEsc: () => props.closeOnEsc!,
    closeOnInteractOutside: () => props.closeOnInteractOutside!,
    close: disclosureState.close,
    toggle: disclosureState.toggle,
    setTriggerRef,
    generateId: createGenerateId(() => props.id!),
    registerContentId: createRegisterId(setContentId),
    registerTitleId: createRegisterId(setTitleId),
    registerDescriptionId: createRegisterId(setDescriptionId),
  };

  return <DialogContext.Provider value={context}>{props.children}</DialogContext.Provider>;
};

Dialog.Trigger = DialogTrigger;
Dialog.Portal = DialogPortal;
Dialog.Overlay = DialogOverlay;
Dialog.Positioner = DialogPositioner;
Dialog.Content = DialogContent;
Dialog.CloseButton = DialogCloseButton;
Dialog.Title = DialogTitle;
Dialog.Description = DialogDescription;
