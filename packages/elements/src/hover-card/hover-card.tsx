/*!
 * Portions of this file are based on code from ariakit.
 * MIT Licensed, Copyright (c) Diego Haz.
 *
 * Credits to the Ariakit team:
 * https://github.com/ariakit/ariakit/blob/84e97943ad637a582c01c9b56d880cd95f595737/packages/ariakit/src/hovercard/hovercard.tsx
 */

import { createGlobalListeners, EventKey, mergeDefaultProps } from "@kobalte/utils";
import {
  createEffect,
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
import { getAnchorElement, Placement } from "../popover/utils";
import { createControllableBooleanSignal } from "../primitives";
import {
  HoverCardContext,
  HoverCardContextValue,
  useOptionalHoverCardContext,
} from "./hover-card-context";
import { HoverCardPanel } from "./hover-card-panel";
import { HoverCardTrigger } from "./hover-card-trigger";
import { getElementPolygon, getEventPoint, isPointInPolygon } from "./polygon";
import { isMovingOnHoverCard } from "./utils";

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

export interface HoverCardProps
  extends Omit<
    PopoverProps,
    "onCurrentPlacementChange" | "closeOnInteractOutside" | "shouldCloseOnInteractOutside"
  > {
  /** The duration from when the mouse enters the trigger until the hovercard opens. */
  openDelay?: number;

  /** The duration from when the mouse leaves the trigger or content until the hovercard closes. */
  closeDelay?: number;

  /** Whether to close the hovercard when the user cursor move outside it. */
  closeOnHoverOutside?: boolean;

  /** Whether to close the hover card even if the user cursor is inside the safe area between the trigger and hovercard. */
  ignoreSafeArea?: boolean;
}

/**
 * A popover that allows sighted users to preview content available behind a link.
 */
export const HoverCard: ParentComponent<HoverCardProps> & HoverCardComposite = props => {
  const defaultId = `hovercard-${createUniqueId()}`;

  const parentContext = useOptionalHoverCardContext();

  props = mergeDefaultProps(
    {
      id: defaultId,
      openDelay: 700,
      closeDelay: 300,
      placement: "bottom",
      closeOnHoverOutside: true,
      closeOnEsc: true,
      isModal: false,
      preventScroll: false,
      trapFocus: false,
      autoFocus: false,
      restoreFocus: false,
    },
    props
  );

  const [local, others] = splitProps(props, [
    "isOpen",
    "defaultIsOpen",
    "onOpenChange",
    "openDelay",
    "closeDelay",
    "closeOnHoverOutside",
    "closeOnEsc",
    "ignoreSafeArea",
    "anchorRef",
  ]);

  let openTimeoutId: number | undefined;
  let closeTimeoutId: number | undefined;

  const [nestedHoverCardRefs, setNestedHoverCardRefs] = createSignal<HTMLElement[]>([]);
  const [triggerRef, setTriggerRef] = createSignal<HTMLElement>();
  const [panelRef, setPanelRef] = createSignal<HTMLElement>();
  const [currentPlacement, setCurrentPlacement] = createSignal<Placement>(others.placement!);

  const anchorRef = () => local.anchorRef?.() ?? triggerRef();

  const [isOpen, setIsOpen] = createControllableBooleanSignal({
    value: () => local.isOpen,
    defaultValue: () => local.defaultIsOpen,
    onChange: value => local.onOpenChange?.(value),
  });

  const { addGlobalListener, removeGlobalListener } = createGlobalListeners();

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

  const cancelOpening = () => {
    window.clearTimeout(openTimeoutId);
    openTimeoutId = undefined;
  };

  const cancelClosing = () => {
    window.clearTimeout(closeTimeoutId);
    closeTimeoutId = undefined;
  };

  const isTargetOnHoverCard = (target: Node | undefined) => {
    return isMovingOnHoverCard(target, panelRef(), anchorRef(), nestedHoverCardRefs());
  };

  const getPolygonSafeArea = (placement: Placement) => {
    const anchorEl = anchorRef();
    const panelEl = panelRef();

    if (!anchorEl || !panelEl) {
      return;
    }

    return getElementPolygon(panelEl, anchorEl, placement);
  };

  const registerNestedHoverCard = (element: HTMLElement) => {
    setNestedHoverCardRefs(prevElements => [...prevElements, element]);

    const parentUnregister = parentContext?.registerNestedHoverCard(element);

    return () => {
      setNestedHoverCardRefs(prevElements => prevElements.filter(item => item !== element));
      parentUnregister?.();
    };
  };

  const onGlobalEscapeKeyDown = (event: KeyboardEvent) => {
    if (event.defaultPrevented) {
      return;
    }

    if (event.key === EventKey.Escape && local.closeOnEsc) {
      setIsOpen(false);
    }
  };

  const onGlobalPointerMove = (event: PointerEvent) => {
    const target = event.target as Node | undefined;

    // Don't close if the hovercard element has focus within or the mouse is moving through valid hovercard elements.
    if (isTargetOnHoverCard(target)) {
      cancelClosing();
      return;
    }

    if (!local.ignoreSafeArea) {
      const polygon = getPolygonSafeArea(currentPlacement());

      //Don't close if the current's event mouse position is inside the polygon safe area.
      if (polygon && isPointInPolygon(getEventPoint(event), polygon)) {
        cancelClosing();
        return;
      }
    }

    if (!local.closeOnHoverOutside) {
      cancelClosing();
      return;
    }

    // If there's already a scheduled timeout to hide the hovercard, we do nothing.
    if (closeTimeoutId) {
      return;
    }

    // Otherwise, hide the hovercard after the close delay.
    closeWithDelay();
  };

  // Register the hover card as a nested hover card on the parent hover card.
  createEffect(() => {
    if (!isOpen()) {
      return;
    }

    const panelEl = panelRef();

    if (!panelEl || !parentContext) {
      return;
    }

    onCleanup(parentContext.registerNestedHoverCard(panelEl));
  });

  createEffect(() => {
    if (!isOpen()) {
      return;
    }

    // Hide on Escape/Control. Popover already handles this, but only when the
    // panel or the disclosure elements are focused. Since the
    // hovercard, by default, does not receive focus when it's shown, we need to
    // handle this globally here.
    addGlobalListener(document, "keydown", onGlobalEscapeKeyDown);

    // Checks whether the mouse is moving toward the hovercard.
    // If not, hide the card after the close delay.
    addGlobalListener(document, "pointermove", onGlobalPointerMove, true);

    onCleanup(() => {
      removeGlobalListener(document, "keydown", onGlobalEscapeKeyDown);
      removeGlobalListener(document, "pointermove", onGlobalPointerMove, true);
    });
  });

  onCleanup(() => {
    // cleanup all timeout on unmount.
    cancelOpening();
    cancelClosing();
  });

  const context: HoverCardContextValue = {
    isOpen,
    openWithDelay,
    closeWithDelay,
    cancelOpening,
    cancelClosing,
    isTargetOnHoverCard,
    registerNestedHoverCard,
    setTriggerRef,
    setPanelRef,
  };

  return (
    <HoverCardContext.Provider value={context}>
      <Popover
        isOpen={isOpen()}
        onOpenChange={setIsOpen}
        anchorRef={anchorRef}
        onCurrentPlacementChange={setCurrentPlacement}
        closeOnInteractOutside={local.closeOnHoverOutside}
        closeOnEsc={local.closeOnEsc}
        {...others}
      />
    </HoverCardContext.Provider>
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
