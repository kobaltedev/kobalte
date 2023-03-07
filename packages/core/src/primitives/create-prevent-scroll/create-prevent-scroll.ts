/*!
 * Portions of this file are based on code from floating-ui.
 * MIT Licensed, Copyright (c) 2021 Floating UI contributors.
 *
 * Credits to the Floating UI contributors:
 * https://github.com/floating-ui/floating-ui/blob/f7ce9420aa32c150eb45049f12cf3b5506715341/packages/react/src/components/FloatingOverlay.tsx
 *
 * Portions of this file are based on code from ariakit.
 * MIT Licensed, Copyright (c) Diego Haz.
 *
 * Credits to the Ariakit team:
 * https://github.com/ariakit/ariakit/blob/5d8a1f047fcadcf117073c70359663a3946b73bf/packages/ariakit/src/dialog/__utils/use-prevent-body-scroll.ts
 */

import { access, chain, getDocument, getWindow, isIOS, MaybeAccessor } from "@kobalte/utils";
import { createEffect, onCleanup } from "solid-js";

const SCROLL_LOCK_IDENTIFIER = "data-kb-scroll-lock";

function assignStyle(element: HTMLElement | null | undefined, style: Partial<CSSStyleDeclaration>) {
  if (!element) {
    return () => {};
  }

  const previousStyle = element.style.cssText;
  Object.assign(element.style, style);

  return () => {
    element.style.cssText = previousStyle;
  };
}

function setCSSProperty(element: HTMLElement | null | undefined, property: string, value: string) {
  if (!element) {
    return () => {};
  }

  const previousValue = element.style.getPropertyValue(property);
  element.style.setProperty(property, value);

  return () => {
    if (previousValue) {
      element.style.setProperty(property, previousValue);
    } else {
      element.style.removeProperty(property);
    }
  };
}

function getPaddingProperty(documentElement: HTMLElement) {
  // RTL <body> scrollbar
  const documentLeft = documentElement.getBoundingClientRect().left;
  const scrollbarX = Math.round(documentLeft) + documentElement.scrollLeft;
  return scrollbarX ? "paddingLeft" : "paddingRight";
}

export interface PreventScrollProps {
  /** The element that requested a scroll lock. */
  ownerRef: MaybeAccessor<HTMLElement | undefined>;

  /** Whether the scroll lock is disabled. */
  isDisabled?: MaybeAccessor<boolean | undefined>;
}

/**
 * Prevents scrolling on the document body on mount, and
 * restores it on unmount. Also ensures that content does not
 * shift due to the scrollbars disappearing.
 */
export function createPreventScroll(props: PreventScrollProps) {
  createEffect(() => {
    if (!access(props.ownerRef) || access(props.isDisabled)) {
      return;
    }

    const doc = getDocument(access(props.ownerRef));
    const win = getWindow(access(props.ownerRef));

    const { documentElement, body } = doc;

    const alreadyLocked = body.hasAttribute(SCROLL_LOCK_IDENTIFIER);

    if (alreadyLocked) {
      return;
    }

    body.setAttribute(SCROLL_LOCK_IDENTIFIER, "");

    const scrollbarWidth = win.innerWidth - documentElement.clientWidth;

    const setScrollbarWidthProperty = () => {
      return setCSSProperty(documentElement, "--scrollbar-width", `${scrollbarWidth}px`);
    };

    const paddingProperty = getPaddingProperty(documentElement);

    // For most browsers, all we need to do is set `overflow: hidden` on the root element, and
    // add some padding to prevent the page from shifting when the scrollbar is hidden.
    const setStyle = () => {
      return assignStyle(body, {
        overflow: "hidden",
        [paddingProperty]: `${scrollbarWidth}px`,
      });
    };

    // Only iOS doesn't respect `overflow: hidden` on document.body.
    const setIOSStyle = () => {
      const { scrollX, scrollY, visualViewport } = win;

      // iOS 12 does not support `visualViewport`.
      const offsetLeft = visualViewport?.offsetLeft ?? 0;
      const offsetTop = visualViewport?.offsetTop ?? 0;

      const restoreStyle = assignStyle(body, {
        position: "fixed",
        overflow: "hidden",
        top: `${-(scrollY - Math.floor(offsetTop))}px`,
        left: `${-(scrollX - Math.floor(offsetLeft))}px`,
        right: "0",
        [paddingProperty]: `${scrollbarWidth}px`,
      });

      return () => {
        restoreStyle();
        win.scrollTo(scrollX, scrollY);
      };
    };

    const cleanup = chain([setScrollbarWidthProperty(), isIOS() ? setIOSStyle() : setStyle()]);

    onCleanup(() => {
      cleanup();
      body.removeAttribute(SCROLL_LOCK_IDENTIFIER);
    });
  });
}
