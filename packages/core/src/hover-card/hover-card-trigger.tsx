/*!
 * Portions of this file are based on code from ariakit.
 * MIT Licensed, Copyright (c) Diego Haz.
 *
 * Credits to the Ariakit team:
 * https://github.com/ariakit/ariakit/blob/84e97943ad637a582c01c9b56d880cd95f595737/packages/ariakit/src/hovercard/hovercard-anchor.ts
 */

import { callHandler, mergeRefs, OverrideComponentProps } from "@kobalte/utils";
import { JSX, onCleanup, splitProps } from "solid-js";

import * as Link from "../link";
import { useHoverCardContext } from "./hover-card-context";

export interface HoverCardTriggerProps extends OverrideComponentProps<"a", Link.LinkRootOptions> {}

/**
 * The link that opens the hovercard when hovered.
 */
export function HoverCardTrigger(props: HoverCardTriggerProps) {
  const context = useHoverCardContext();

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

    if (e.pointerType === "touch" || others.disabled || e.defaultPrevented) {
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

    if (others.disabled || e.defaultPrevented) {
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

    const relatedTarget = e.relatedTarget as Node | null;

    if (context.isTargetOnHoverCard(relatedTarget)) {
      return;
    }

    context.closeWithDelay();
  };

  onCleanup(context.cancelOpening);

  return (
    <Link.Root
      ref={mergeRefs(context.setTriggerRef, local.ref)}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      onFocus={onFocus}
      onBlur={onBlur}
      {...context.dataset()}
      {...others}
    />
  );
}
