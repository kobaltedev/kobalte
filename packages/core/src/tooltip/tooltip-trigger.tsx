/*!
 * Portions of this file are based on code from ariakit.
 * MIT Licensed, Copyright (c) Diego Haz.
 *
 * Credits to the Ariakit team:
 * https://github.com/ariakit/ariakit/blob/84e97943ad637a582c01c9b56d880cd95f595737/packages/ariakit/src/tooltip/tooltip-anchor.ts
 *
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/e67d48d4935b772f915b08f1d695d2ebafb876f0/packages/@react-aria/tooltip/src/useTooltipTrigger.ts
 */

import { callHandler, mergeRefs } from "@kobalte/utils";
import { ComponentProps, JSX, onCleanup, splitProps } from "solid-js";

import { AsChildProp, Polymorphic } from "../polymorphic";
import { useTooltipContext } from "./tooltip-context";

export interface TooltipTriggerProps extends ComponentProps<"button">, AsChildProp {}

/**
 * The button that opens the tooltip when hovered.
 */
export function TooltipTrigger(props: TooltipTriggerProps) {
  const context = useTooltipContext();

  const [local, others] = splitProps(props, [
    "ref",
    "onPointerEnter",
    "onPointerLeave",
    "onPointerDown",
    "onFocus",
    "onBlur",
    "onTouchStart",
  ]);

  let isHovered = false;
  let isFocused = false;

  const handleShow = () => {
    if (isHovered || isFocused) {
      context.open(isFocused);
    }
  };

  const handleHide = (immediate?: boolean) => {
    if (!isHovered && !isFocused) {
      context.close(immediate);
    }
  };

  const onPointerEnter: JSX.EventHandlerUnion<HTMLButtonElement, PointerEvent> = e => {
    callHandler(e, local.onPointerEnter);

    if (
      e.pointerType === "touch" ||
      context.triggerOnFocusOnly() ||
      context.isDisabled() ||
      e.defaultPrevented
    ) {
      return;
    }

    isHovered = true;

    handleShow();
  };

  const onPointerLeave: JSX.EventHandlerUnion<HTMLButtonElement, PointerEvent> = e => {
    callHandler(e, local.onPointerLeave);

    if (e.pointerType === "touch") {
      return;
    }

    // No matter how the trigger is left, we should close the tooltip.
    isHovered = false;
    isFocused = false;

    handleHide();
  };

  const onPointerDown: JSX.EventHandlerUnion<HTMLButtonElement, PointerEvent> = e => {
    callHandler(e, local.onPointerDown);

    // No matter how the trigger is left, we should close the tooltip.
    isHovered = false;
    isFocused = false;

    handleHide(true);
  };

  const onFocus: JSX.EventHandlerUnion<HTMLButtonElement, FocusEvent> = e => {
    callHandler(e, local.onFocus);

    if (context.isDisabled() || e.defaultPrevented) {
      return;
    }

    isFocused = true;

    handleShow();
  };

  const onBlur: JSX.EventHandlerUnion<HTMLButtonElement, FocusEvent> = e => {
    callHandler(e, local.onBlur);

    const relatedTarget = e.relatedTarget as Node | null;

    if (context.isTargetOnTooltip(relatedTarget)) {
      return;
    }

    // No matter how the trigger is left, we should close the tooltip.
    isHovered = false;
    isFocused = false;

    handleHide(true);
  };

  // We purposefully avoid using Kobalte `Button` here because tooltip triggers can be any element
  // and should not always be announced as a button to screen readers.
  return (
    <Polymorphic
      fallback="button"
      ref={mergeRefs(context.setTriggerRef, local.ref)}
      aria-describedby={context.isOpen() ? context.contentId() : undefined}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      onPointerDown={onPointerDown}
      onFocus={onFocus}
      onBlur={onBlur}
      {...context.dataset()}
      {...others}
    />
  );
}
