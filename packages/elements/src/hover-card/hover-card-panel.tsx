import {
  contains,
  createGlobalListeners,
  createPolymorphicComponent,
  EventKey,
  mergeRefs,
} from "@kobalte/utils";
import { createEffect, createMemo, createSignal, onCleanup, splitProps } from "solid-js";

import { PopoverPanel, PopoverPanelProps } from "../popover/popover-panel";
import { debugPolygon } from "./debug-polygon";
import { useHoverCardContext } from "./hover-card-context";
import { getElementPolygon, getEventPoint, isPointInPolygon, Point, Polygon } from "./polygon";
import { isMovingOnHovercard } from "./utils";
import { usePopoverContext } from "../popover/popover-context";

export interface HoverCardPanelProps extends PopoverPanelProps {}

/**
 * The element that visually represents a hover card.
 * Contains the content to be rendered when the hover card is open.
 */
export const HoverCardPanel = createPolymorphicComponent<"div", HoverCardPanelProps>(props => {
  let ref: HTMLDivElement | undefined;

  const popoverContext = usePopoverContext();
  const context = useHoverCardContext();

  const [local, others] = splitProps(props, ["ref"]);

  const { addGlobalListener, removeGlobalListener } = createGlobalListeners();

  const onGlobalEscapeKeyDown = (event: KeyboardEvent) => {
    if (event.defaultPrevented) {
      return;
    }

    if (event.key === EventKey.Escape && context.closeOnEsc()) {
      context.closeImmediately();
    }
  };

  const onGlobalPointerMove = (event: PointerEvent) => {
    const triggerEl = context.triggerRef();

    if (!ref || !triggerEl) {
      return;
    }

    const target = event.target as Node | undefined;

    // Don't close if the hovercard element has focus within or the mouse is moving through valid hovercard elements.
    if (isMovingOnHovercard(target, ref, triggerEl, context.nestedHoverCardRefs())) {
      context.cancelClosing();
      return;
    }

    // The safe area between the trigger and panel
    const polygon = getElementPolygon(ref, triggerEl, popoverContext.currentPlacement());
    const currentPoint = getEventPoint(event);

    debugPolygon(polygon);

    //Don't close if the current's event mouse position is inside the polygon safe area.
    if (isPointInPolygon(currentPoint, polygon)) {
      context.cancelClosing();
      return;
    }

    if (!context.closeOnHoverOutside()) {
      context.cancelClosing();
      return;
    }

    // If there's already a scheduled timeout to hide the hovercard, we do nothing.
    if (context.closeTimeoutId()) {
      return;
    }

    // Otherwise, hide the hovercard after the close delay.
    context.closeWithDelay();
  };

  createEffect(() => {
    if (!context.isOpen()) {
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

  return (
    <PopoverPanel
      ref={mergeRefs(el => {
        ref = el;
        context.setPanelRef(el);
      }, local.ref)}
      {...others}
    />
  );
});
