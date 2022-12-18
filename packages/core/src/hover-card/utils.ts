/*!
 * Portions of this file are based on code from ariakit.
 * MIT Licensed, Copyright (c) Diego Haz.
 *
 * Credits to the Ariakit team:
 * https://github.com/ariakit/ariakit/blob/84e97943ad637a582c01c9b56d880cd95f595737/packages/ariakit/src/hovercard/hovercard.tsx
 */

import { contains, hasFocusWithin } from "@kobalte/utils";

export function isMovingOnHoverCard(
  target: Node | undefined,
  positioner?: HTMLElement,
  anchor?: HTMLElement,
  nested?: HTMLElement[]
): boolean {
  if (!positioner) {
    return false;
  }

  // The hovercard positioner element has focus within, so we should keep it visible.
  if (hasFocusWithin(positioner)) {
    return true;
  }

  if (!target) {
    return false;
  }

  // The mouse is moving on an element inside the hovercard.
  if (contains(positioner, target)) {
    return true;
  }

  // The mouse is moving on an element inside the anchor element.
  if (anchor && contains(anchor, target)) {
    return true;
  }

  // The mouse is moving on an element inside a nested hovercard.
  return !!nested?.some(card => isMovingOnHoverCard(target, card, anchor));
}
