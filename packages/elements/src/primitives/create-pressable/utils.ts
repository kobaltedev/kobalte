/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/a9dea8a3672179e6c38aafd1429daf44c7ea2ff6/packages/@react-aria/interactions/src/textSelection.ts
 * https://github.com/solidjs-community/solid-aria/blob/2c5f54feb5cfea514b1ee0a52d0416878f882351/packages/interactions/src/utils.ts
 */

import { isIOS, runAfterTransition } from "@kobalte/utils";

// Safari on iOS starts selecting text on long press. The only way to avoid this, it seems,
// is to add user-select: none to the entire page. Adding it to the pressable element prevents
// that element from being selected, but nearby elements may still receive selection. We add
// user-select: none on touch start, and remove it again on touch end to prevent this.
// This must be implemented using global state to avoid race conditions between multiple elements.

// There are three possible states due to the delay before removing user-select: none after
// pointer up. The 'default' state always transitions to the 'disabled' state, which transitions
// to 'restoring'. The 'restoring' state can either transition back to 'disabled' or 'default'.

// For non-iOS devices, we apply user-select: none to the pressed element instead to avoid possible
// performance issues that arise from applying and removing user-select: none to the entire page
// (see https://github.com/adobe/react-spectrum/issues/1609).
type State = "default" | "disabled" | "restoring";

// Note that state only matters here for iOS. Non-iOS gets user-select: none applied to the target element
// rather than at the document level, so we just need to apply/remove user-select: none for each pressed element individually
let state: State = "default";
let savedUserSelect = "";
const modifiedElementMap = new WeakMap<Element, string>();

export function disableTextSelection(target?: Element) {
  if (isIOS()) {
    if (state === "default") {
      savedUserSelect = document.documentElement.style.webkitUserSelect;
      document.documentElement.style.webkitUserSelect = "none";
    }

    state = "disabled";
  } else if (target instanceof HTMLElement || target instanceof SVGElement) {
    // If not iOS, store the target's original user-select and change to user-select: none
    // Ignore state since it doesn't apply for non iOS
    modifiedElementMap.set(target, target.style.userSelect);
    target.style.userSelect = "none";
  }
}

export function restoreTextSelection(target?: Element) {
  if (isIOS()) {
    // If the state is already default, there's nothing to do.
    // If it is restoring, then there's no need to queue a second restore.
    if (state !== "disabled") {
      return;
    }

    state = "restoring";

    // There appears to be a delay on iOS where selection still might occur
    // after pointer up, so wait a bit before removing user-select.
    setTimeout(() => {
      // Wait for any CSS transitions to complete so we don't recompute style
      // for the whole page in the middle of the animation and cause jank.
      runAfterTransition(() => {
        // Avoid race conditions
        if (state === "restoring") {
          if (document.documentElement.style.webkitUserSelect === "none") {
            document.documentElement.style.webkitUserSelect = savedUserSelect || "";
          }

          savedUserSelect = "";
          state = "default";
        }
      });
    }, 300);
  } else if (target instanceof HTMLElement || target instanceof SVGElement) {
    // If not iOS, restore the target's original user-select if any
    // Ignore state since it doesn't apply for non iOS
    if (target && modifiedElementMap.has(target)) {
      const targetOldUserSelect = modifiedElementMap.get(target) ?? "";

      if (target.style.userSelect === "none") {
        target.style.userSelect = targetOldUserSelect;
      }

      if (target.getAttribute("style") === "") {
        target.removeAttribute("style");
      }
      modifiedElementMap.delete(target);
    }
  }
}

// Keyboards, Assistive Technologies, and element.click() all produce a "virtual"
// click event. This is a method of inferring such clicks. Every up-to-date browsers
// sets a zero value of "detail" for click events that are "virtual".
export function isVirtualClick(event: MouseEvent | PointerEvent): boolean {
  // JAWS/NVDA with Firefox.
  if ((event as any).mozInputSource === 0 && event.isTrusted) {
    return true;
  }

  return event.detail === 0;
}
