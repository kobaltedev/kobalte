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

import { useDialogContext } from "../dialog";
import { Link, LinkProps } from "../link";
import { useHoverCardContext } from "./hover-card-context";

/**
 * The link that opens the hover card when hovered
 */
export const HoverCardTrigger = createPolymorphicComponent<"a", LinkProps>(props => {
  const dialogContext = useDialogContext();
  const context = useHoverCardContext();

  props = mergeDefaultProps({ as: "a" }, props);

  const [local, others] = splitProps(props, ["ref", "onPointerEnter", "onPointerLeave"]);

  const onPointerEnter: JSX.EventHandlerUnion<HTMLAnchorElement, PointerEvent> = e => {
    callHandler(e, local.onPointerEnter);

    if (others.isDisabled || e.defaultPrevented || context.openTimeoutId()) {
      return;
    }

    context.openWithDelay();
  };

  const onPointerLeave: JSX.EventHandlerUnion<HTMLAnchorElement, PointerEvent> = e => {
    callHandler(e, local.onPointerLeave);
    context.clearOpenTimeout();
  };

  onCleanup(context.clearOpenTimeout);

  return (
    <Link
      ref={mergeRefs(context.setTriggerRef, local.ref)}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      {...dialogContext.dataset()}
      {...others}
    />
  );
});
