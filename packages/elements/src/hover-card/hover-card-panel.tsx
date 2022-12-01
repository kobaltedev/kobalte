import {
  contains,
  createGlobalListeners,
  createPolymorphicComponent,
  EventKey,
  mergeRefs,
} from "@kobalte/utils";
import { createEffect, onCleanup, splitProps } from "solid-js";

import { PopoverPanel, PopoverPanelProps } from "../popover/popover-panel";
import { useHoverCardContext } from "./hover-card-context";
import { getElementPolygon, getEventPoint, isPointInPolygon, Point } from "./polygon";
import { isMovingOnHovercard } from "./utils";

export interface HoverCardPanelProps extends PopoverPanelProps {}

/**
 * The element that visually represents a hover card.
 * Contains the content to be rendered when the hover card is open.
 */
export const HoverCardPanel = createPolymorphicComponent<"div", HoverCardPanelProps>(props => {
  let ref: HTMLDivElement | undefined;

  const context = useHoverCardContext();

  let enterPoint: Point | undefined;

  const [local, others] = splitProps(props, ["ref"]);

  const { addGlobalListener, removeGlobalListener } = createGlobalListeners();

  const onGlobalEscapeKeyDown = (event: KeyboardEvent) => {
    if (event.defaultPrevented) {
      return;
    }

    if (event.key === EventKey.Escape && context.closeOnEsc()) {
      context.close();
    }
  };

  const onGlobalPointerMove = (event: PointerEvent) => {
    const target = event.target as Node | undefined;

    const triggerEl = context.triggerRef();

    if (!ref) {
      return;
    }

    // Checks whether the hovercard element has focus or the mouse is moving through valid hovercard elements.
    if (isMovingOnHovercard(target, ref, triggerEl, context.nestedHoverCardRefs())) {
      const isOverTrigger = target && triggerEl && contains(triggerEl, target);

      // While the mouse is moving over the trigger element while the hover
      // card is open, keep track of the mouse position, so we'll use the
      // last point before the mouse leaves the anchor element.
      enterPoint = isOverTrigger ? getEventPoint(event) : undefined;

      context.clearCloseTimeout();

      return;
    }

    // If there's already a scheduled timeout to hide the hover card, we do nothing.
    if (context.closeTimeoutId()) {
      return;
    }

    // Enter point will be null when the user hovers over the hover card element.
    if (enterPoint) {
      const currentPoint = getEventPoint(event);
      const polygon = getElementPolygon(ref, enterPoint);

      // If the current's event mouse position is inside the transit
      // polygon, this means that the mouse is moving toward the hover card,
      // so we refresh the "enter point".
      if (isPointInPolygon(currentPoint, polygon)) {
        enterPoint = currentPoint;
        return;
      }
    }

    if (!context.closeOnHoverOutside()) {
      return;
    }

    // Otherwise, hide the hovercard after the close delay.
    context.closeWithDelay();
  };

  const onGlobalFocusIn = (event: FocusEvent) => {
    console.log("foo");
    const target = event.target as Node | undefined;

    const triggerEl = context.triggerRef();

    if (!ref) {
      return;
    }

    console.log("foo2");

    // Checks whether the hovercard element has focus or the mouse is moving through valid hovercard elements.
    if (isMovingOnHovercard(target, ref, triggerEl, context.nestedHoverCardRefs())) {
      context.clearCloseTimeout();
      return;
    }

    console.log("foo3");

    // If there's already a scheduled timeout to hide the hover card, we do nothing.
    if (context.closeTimeoutId()) {
      return;
    }

    console.log("foo4");

    /*
    if (!context.closeOnInteractOutside()) {
      return;
    }
    */

    // Otherwise, hide the hovercard after the close delay.
    context.closeWithDelay();
  };

  createEffect(() => {
    if (!context.isOpen()) {
      return;
    }

    // Hide on Escape. Popover already handles this, but only when the
    // dialog, the backdrop or the disclosure elements are focused. Since the
    // hovercard, by default, does not receive focus when it's shown, we need to
    // handle this globally here.
    addGlobalListener(document, "keydown", onGlobalEscapeKeyDown);

    // Checks whether the mouse is moving toward the hovercard.
    // If not, hide the card after the close delay.
    addGlobalListener(document, "pointermove", onGlobalPointerMove, true);

    // Checks whether the focus is moving toward the hovercard.
    // If not, hide the card after the close delay.
    addGlobalListener(document, "focusin", onGlobalFocusIn, true);

    onCleanup(() => {
      removeGlobalListener(document, "keydown", onGlobalEscapeKeyDown);
      removeGlobalListener(document, "pointermove", onGlobalPointerMove, true);
      removeGlobalListener(document, "focusin", onGlobalFocusIn, true);
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
