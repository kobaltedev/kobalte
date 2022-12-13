/*!
 * Portions of this file are based on code from ariakit.
 * MIT Licensed, Copyright (c) Diego Haz.
 *
 * Credits to the Ariakit team:
 * https://github.com/ariakit/ariakit/blob/84e97943ad637a582c01c9b56d880cd95f595737/packages/ariakit/src/hovercard/hovercard-anchor.ts
 */

import {
  callHandler,
  createPolymorphicComponent,
  mergeDefaultProps,
  mergeRefs,
} from "@kobalte/utils";
import { JSX, onCleanup, splitProps } from "solid-js";

import { Link, LinkProps } from "../link";
import { useHoverCardContext } from "./hover-card-context";

/**
 * The link that opens the hovercard when hovered.
 */
export const HoverCardTrigger = createPolymorphicComponent<"a", LinkProps>(props => {
  const context = useHoverCardContext();

  props = mergeDefaultProps({ as: "a" }, props);

  const [local, others] = splitProps(props, [
    "ref",
    "onPointerEnter",
    "onPointerLeave",
    "onFocus",
    "onBlur",
    "onTouchStart",
  ]);

  const onPointerEnter: JSX.EventHandlerUnion<HTMLAnchorElement, PointerEvent> = e => {
    callHandler(e, local.onPointerEnter);

    if (e.pointerType === "touch" || others.isDisabled || e.defaultPrevented) {
      return;
    }

    context.cancelClosing();

    if (!context.isOpen()) {
      context.openWithDelay();
    }
  };

  const onPointerLeave: JSX.EventHandlerUnion<HTMLAnchorElement, PointerEvent> = e => {
    callHandler(e, local.onPointerLeave);

    if (e.pointerType === "touch") {
      return;
    }

    context.cancelOpening();
  };

  const onFocus: JSX.EventHandlerUnion<HTMLAnchorElement, FocusEvent> = e => {
    callHandler(e, local.onFocus);

    if (others.isDisabled || e.defaultPrevented) {
      return;
    }

    context.cancelClosing();

    if (!context.isOpen()) {
      context.openWithDelay();
    }
  };

  const onBlur: JSX.EventHandlerUnion<HTMLAnchorElement, FocusEvent> = e => {
    callHandler(e, local.onBlur);

    context.cancelOpening();

    const relatedTarget = e.relatedTarget as Node | undefined;

    // Don't close if the hovercard element (or nested ones) has focus within.
    if (context.isTargetOnHoverCard(relatedTarget)) {
      return;
    }

    context.closeWithDelay();
  };

  const onTouchStart: JSX.EventHandlerUnion<HTMLAnchorElement, TouchEvent> = e => {
    callHandler(e, local.onTouchStart);

    // prevent focus event on touch devices
    e.preventDefault();
  };

  onCleanup(context.cancelOpening);

  return (
    <Link
      ref={mergeRefs(context.setTriggerRef, local.ref)}
      data-expanded={context.isOpen() ? "" : undefined}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      onFocus={onFocus}
      onBlur={onBlur}
      onTouchStart={onTouchStart}
      {...others}
    />
  );
});
