import { access, MaybeAccessor } from "@kobalte/utils";
import { JSX, onCleanup } from "solid-js";

import { useHoverCardContext } from "./hover-card-context";

interface CreateHoverCardTriggerProps {
  /** Whether the trigger is disabled. */
  isDisabled?: MaybeAccessor<boolean | undefined>;
}

/**
 * Provide the behavior for an hover card trigger.
 */
export function createHoverCardTrigger(props: CreateHoverCardTriggerProps) {
  const context = useHoverCardContext();

  const onPointerEnter: JSX.EventHandlerUnion<any, PointerEvent> = e => {
    if (e.pointerType === "touch" || access(props.isDisabled) || e.defaultPrevented) {
      return;
    }

    context.cancelClosing();

    if (!context.isOpen()) {
      context.openWithDelay();
    }
  };

  const onPointerLeave: JSX.EventHandlerUnion<any, PointerEvent> = e => {
    if (e.pointerType === "touch") {
      return;
    }

    context.cancelOpening();
  };

  const onFocus: JSX.EventHandlerUnion<any, FocusEvent> = e => {
    if (access(props.isDisabled) || e.defaultPrevented) {
      return;
    }

    context.cancelClosing();

    if (!context.isOpen()) {
      context.openWithDelay();
    }
  };

  const onBlur: JSX.EventHandlerUnion<any, FocusEvent> = e => {
    context.cancelOpening();

    const relatedTarget = e.relatedTarget as Node | undefined;

    // Don't close if the hovercard element (or nested ones) has focus within.
    if (context.isTargetOnHoverCard(relatedTarget)) {
      return;
    }

    context.closeWithDelay();
  };

  const onTouchStart: JSX.EventHandlerUnion<any, TouchEvent> = e => {
    // prevent focus event on touch devices
    e.preventDefault();
  };

  onCleanup(context.cancelOpening);

  return {
    triggerHandlers: {
      onPointerEnter,
      onPointerLeave,
      onFocus,
      onBlur,
      onTouchStart,
    },
  };
}
