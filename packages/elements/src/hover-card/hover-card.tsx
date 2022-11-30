/*!
 * Portions of this file are based on code from ariakit.
 * MIT Licensed, Copyright (c) Diego Haz.
 *
 * Credits to the Ariakit team:
 * https://github.com/ariakit/ariakit/blob/84e97943ad637a582c01c9b56d880cd95f595737/packages/ariakit/src/hovercard/hovercard.tsx
 */

import { mergeDefaultProps } from "@kobalte/utils";
import {
  createRenderEffect,
  createSignal,
  createUniqueId,
  onCleanup,
  ParentComponent,
  splitProps,
} from "solid-js";

import { DialogCloseButton } from "../dialog/dialog-close-button";
import { DialogDescription } from "../dialog/dialog-description";
import { DialogPortal } from "../dialog/dialog-portal";
import { DialogTitle } from "../dialog/dialog-title";
import { Popover, PopoverProps } from "../popover";
import { PopoverArrow } from "../popover/popover-arrow";
import { PopoverPositioner } from "../popover/popover-positioner";
import { createControllableBooleanSignal } from "../primitives";
import {
  HoverCardContext,
  HoverCardContextValue,
  useOptionalHoverCardContext,
} from "./hover-card-context";
import { HoverCardPanel } from "./hover-card-panel";
import { HoverCardTrigger } from "./hover-card-trigger";

type HoverCardComposite = {
  Trigger: typeof HoverCardTrigger;
  Panel: typeof HoverCardPanel;

  Positioner: typeof PopoverPositioner;
  Arrow: typeof PopoverArrow;

  Portal: typeof DialogPortal;
  CloseButton: typeof DialogCloseButton;
  Title: typeof DialogTitle;
  Description: typeof DialogDescription;
};

export interface HoverCardProps extends Omit<PopoverProps, "getAnchorRect" | "anchorRef"> {
  /** The duration from when the mouse enters the trigger until the hover card opens. */
  openDelay?: number;

  /** The duration from when the mouse leaves the trigger or content until the hover card closes. */
  closeDelay?: number;

  /** Whether to close the hover card when the user cursor move outside it. */
  closeOnHoverOutside?: boolean;
}

/**
 * A popover that allows sighted users to preview content available behind a link.
 */
export const HoverCard: ParentComponent<HoverCardProps> & HoverCardComposite = props => {
  const defaultId = `kb-hovercard-${createUniqueId()}`;

  const parentContext = useOptionalHoverCardContext();

  props = mergeDefaultProps(
    {
      id: defaultId,
      openDelay: 700,
      closeDelay: 300,
      isModal: false,
      closeOnHoverOutside: true,
      closeOnInteractOutside: true,
      closeOnEsc: true,
      autoFocus: false,
      restoreFocus: false,
    },
    props
  );

  const [local, others] = splitProps(props, [
    "children",
    "isOpen",
    "defaultIsOpen",
    "onOpenChange",
    "openDelay",
    "closeDelay",
    "closeOnHoverOutside",
  ]);

  let openTimeoutId: number | undefined;
  let closeTimeoutId: number | undefined;

  const [nestedHoverCardRefs, setNestedHoverCardRefs] = createSignal<HTMLElement[]>([]);
  const [triggerRef, setTriggerRef] = createSignal<HTMLElement>();
  const [panelRef, setPanelRef] = createSignal<HTMLElement>();

  const [isOpen, setIsOpen] = createControllableBooleanSignal({
    value: () => local.isOpen,
    defaultValue: () => local.defaultIsOpen,
    onChange: value => local.onOpenChange?.(value),
  });

  const clearOpenTimeout = () => {
    window.clearTimeout(openTimeoutId);
    openTimeoutId = undefined;
  };

  const clearCloseTimeout = () => {
    window.clearTimeout(closeTimeoutId);
    closeTimeoutId = undefined;
  };

  const openWithDelay = () => {
    openTimeoutId = window.setTimeout(() => {
      openTimeoutId = undefined;
      setIsOpen(true);
    }, local.openDelay);
  };

  const closeWithDelay = () => {
    closeTimeoutId = window.setTimeout(() => {
      closeTimeoutId = undefined;
      setIsOpen(false);
    }, local.closeDelay);
  };

  const registerNestedHoverCard = (element: HTMLElement) => {
    setNestedHoverCardRefs(prevElements => [...prevElements, element]);

    const parentUnregister = parentContext?.registerNestedHoverCard(element);

    return () => {
      setNestedHoverCardRefs(prevElements => prevElements.filter(item => item !== element));
      parentUnregister?.();
    };
  };

  // Register the hover card as a nested hover card on the parent hover card if it's not a modal.
  createRenderEffect(() => {
    if (others.isModal || !isOpen()) {
      return;
    }

    const panelEl = panelRef();

    if (!panelEl || !parentContext) {
      return;
    }

    onCleanup(parentContext.registerNestedHoverCard(panelEl));
  });

  const context: HoverCardContextValue = {
    isOpen,
    closeOnHoverOutside: () => local.closeOnHoverOutside,
    closeOnEsc: () => others.closeOnEsc,
    openTimeoutId: () => openTimeoutId,
    closeTimeoutId: () => closeTimeoutId,
    openWithDelay,
    closeWithDelay,
    close: () => setIsOpen(false),
    clearOpenTimeout,
    clearCloseTimeout,
    registerNestedHoverCard,
    triggerRef,
    nestedHoverCardRefs,
    setTriggerRef,
    setPanelRef,
  };

  return (
    <Popover isOpen={isOpen()} onOpenChange={setIsOpen} anchorRef={triggerRef} {...others}>
      <HoverCardContext.Provider value={context}>{local.children}</HoverCardContext.Provider>
    </Popover>
  );
};

HoverCard.Trigger = HoverCardTrigger;
HoverCard.Panel = HoverCardPanel;

HoverCard.Positioner = PopoverPositioner;
HoverCard.Arrow = PopoverArrow;

HoverCard.Portal = DialogPortal;
HoverCard.CloseButton = DialogCloseButton;
HoverCard.Title = DialogTitle;
HoverCard.Description = DialogDescription;
