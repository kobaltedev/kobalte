import { createGenerateId, mergeDefaultProps } from "@kobalte/utils";
import { createSignal, createUniqueId, ParentProps } from "solid-js";

import { createDisclosureState, createPresence, createRegisterId } from "../primitives";
import { AlertDialogContext, AlertDialogContextValue } from "./alert-dialog-context";

export interface AlertDialogRootOptions {
  /** The controlled open state of the dialog. */
  isOpen?: boolean;

  /**
   * The default open state when initially rendered.
   * Useful when you do not need to control the open state.
   */
  defaultIsOpen?: boolean;

  /** Event handler called when the open state of the alert dialog changes. */
  onOpenChange?: (isOpen: boolean) => void;

  /**
   * A unique identifier for the component.
   * The id is used to generate id attributes for nested components.
   * If no id prop is provided, a generated id will be used.
   */
  id?: string;

  /**
   * Whether the alert dialog should be the only visible content for screen readers.
   * When set to `true`:
   * - interaction with outside elements will be disabled.
   * - scroll will be locked.
   * - focus will be locked inside the alert dialog content.
   * - elements outside the alert dialog content will not be visible for screen readers.
   */
  isModal?: boolean;

  /**
   * Used to force mounting the alert dialog (portal, overlay and content) when more control is needed.
   * Useful when controlling animation with SolidJS animation libraries.
   */
  forceMount?: boolean;
}

export interface AlertDialogRootProps extends ParentProps<AlertDialogRootOptions> {}

/**
 * An alert dialog is a window overlaid on either the primary window or another dialog window.
 */
export function AlertDialogRoot(props: AlertDialogRootProps) {
  const defaultId = `alertdialog-${createUniqueId()}`;

  props = mergeDefaultProps(
    {
      id: defaultId,
      isModal: true,
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

  const shouldMount = () => props.forceMount || disclosureState.isOpen();

  const overlayPresence = createPresence(shouldMount);
  const contentPresence = createPresence(shouldMount);

  const context: AlertDialogContextValue = {
    isOpen: disclosureState.isOpen,
    isModal: () => props.isModal!,
    contentId,
    titleId,
    descriptionId,
    triggerRef,
    overlayPresence,
    contentPresence,
    close: disclosureState.close,
    toggle: disclosureState.toggle,
    setTriggerRef,
    generateId: createGenerateId(() => props.id!),
    registerContentId: createRegisterId(setContentId),
    registerTitleId: createRegisterId(setTitleId),
    registerDescriptionId: createRegisterId(setDescriptionId),
  };

  return (
    <AlertDialogContext.Provider value={context}>{props.children}</AlertDialogContext.Provider>
  );
}
