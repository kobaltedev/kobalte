/*!
 * Portions of this file are based on code from ariakit.
 * MIT Licensed, Copyright (c) Diego Haz.
 *
 * Credits to the Ariakit team:
 * https://github.com/ariakit/ariakit/blob/main/packages/ariakit-utils/src/focus.ts
 *
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/main/packages/%40react-aria/focus/src/isElementVisible.ts
 */

import { isFrame } from "./dom";

const FOCUSABLE_ELEMENT_SELECTOR =
  "input:not([type='hidden']):not([disabled]), select:not([disabled]), " +
  "textarea:not([disabled]), a[href], button:not([disabled]), [tabindex], " +
  "iframe, object, embed, area[href], audio[controls], video[controls], " +
  "[contenteditable]:not([contenteditable='false'])";

/**
 * Returns all the tabbable elements in `container`.
 */
export function getAllTabbableIn(container: HTMLElement, includeContainer?: boolean) {
  const elements = Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_ELEMENT_SELECTOR));

  const tabbableElements = elements.filter(isTabbable);

  if (includeContainer && isTabbable(container)) {
    tabbableElements.unshift(container);
  }

  tabbableElements.forEach((element, i) => {
    if (isFrame(element) && element.contentDocument) {
      const frameBody = element.contentDocument.body;
      const allFrameTabbable = getAllTabbableIn(frameBody, false);
      tabbableElements.splice(i, 1, ...allFrameTabbable);
    }
  });

  return tabbableElements;
}

/**
 * Checks whether `element` is tabbable or not.
 * @example
 * isTabbable(document.querySelector("input")); // true
 * isTabbable(document.querySelector("input[tabindex='-1']")); // false
 * isTabbable(document.querySelector("input[hidden]")); // false
 * isTabbable(document.querySelector("input:disabled")); // false
 */
export function isTabbable(element: Element): element is HTMLElement {
  return isFocusable(element) && !hasNegativeTabIndex(element);
}

/**
 * Checks whether `element` is focusable or not.
 * @example
 * isFocusable(document.querySelector("input")); // true
 * isFocusable(document.querySelector("input[tabindex='-1']")); // true
 * isFocusable(document.querySelector("input[hidden]")); // false
 * isFocusable(document.querySelector("input:disabled")); // false
 */
export function isFocusable(element: Element): element is HTMLElement {
  return element.matches(FOCUSABLE_ELEMENT_SELECTOR) && isElementVisible(element);
}

function hasNegativeTabIndex(element: Element) {
  const tabIndex = parseInt(element.getAttribute("tabindex") || "0", 10);
  return tabIndex < 0;
}

/**
 * Adapted from https://github.com/testing-library/jest-dom and
 * https://github.com/vuejs/vue-test-utils-next/.
 * Licensed under the MIT License.
 * @param element - Element to evaluate for display or visibility.
 */
function isElementVisible(element: Element, childElement?: Element): boolean {
  return (
    element.nodeName !== "#comment" &&
    isStyleVisible(element) &&
    isAttributeVisible(element, childElement) &&
    (!element.parentElement || isElementVisible(element.parentElement, element))
  );
}

function isStyleVisible(element: Element) {
  if (!(element instanceof HTMLElement) && !(element instanceof SVGElement)) {
    return false;
  }

  const { display, visibility } = element.style;

  let isVisible = display !== "none" && visibility !== "hidden" && visibility !== "collapse";

  if (isVisible) {
    if (!element.ownerDocument.defaultView) {
      return isVisible;
    }

    const { getComputedStyle } = element.ownerDocument.defaultView;
    const { display: computedDisplay, visibility: computedVisibility } = getComputedStyle(element);

    isVisible =
      computedDisplay !== "none" &&
      computedVisibility !== "hidden" &&
      computedVisibility !== "collapse";
  }

  return isVisible;
}

function isAttributeVisible(element: Element, childElement?: Element) {
  return (
    !element.hasAttribute("hidden") &&
    (element.nodeName === "DETAILS" && childElement && childElement.nodeName !== "SUMMARY"
      ? element.hasAttribute("open")
      : true)
  );
}
