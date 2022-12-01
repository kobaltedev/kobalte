/*!
 * Portions of this file are based on code from ariakit.
 * MIT Licensed, Copyright (c) Diego Haz.
 *
 * Credits to the Ariakit team:
 * https://github.com/ariakit/ariakit/blob/84e97943ad637a582c01c9b56d880cd95f595737/packages/ariakit/src/hovercard/hovercard.tsx
 */

import { contains, hasFocusWithin } from "@kobalte/utils";

export function isMovingOnHovercard(
  target: Node | undefined,
  card: HTMLElement,
  trigger?: HTMLElement,
  nested?: HTMLElement[]
): boolean {
  // The hovercard element has focus, so we should keep it visible.
  if (hasFocusWithin(card)) {
    return true;
  }

  if (!target) {
    return false;
  }

  // The mouse is moving on an element inside the hovercard.
  if (contains(card, target)) {
    return true;
  }

  // The mouse is moving on an element inside the trigger element.
  if (trigger && contains(trigger, target)) {
    return true;
  }

  // The mouse is moving on an element inside a nested hovercard.
  return !!nested?.some(card => isMovingOnHovercard(target, card, trigger));
}
