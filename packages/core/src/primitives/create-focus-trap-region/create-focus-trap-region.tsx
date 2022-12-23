/* eslint-disable jsx-a11y/no-noninteractive-tabindex */

/*!
 * Portions of this file are based on code from ariakit.
 * MIT Licensed, Copyright (c) Diego Haz.
 *
 * Credits to the Ariakit team:
 * https://github.com/ariakit/ariakit/blob/232bc79018ec20967fec1e097a9474aba3bb5be7/packages/ariakit/src/focus-trap/focus-trap-region.tsx
 */

import {
  access,
  contains,
  focusWithoutScrolling,
  getActiveElement,
  getAllTabbableIn,
  isFocusable,
  isString,
  MaybeAccessor,
  mergeDefaultProps,
  visuallyHiddenStyles,
} from "@kobalte/utils";
import { Accessor, JSX, onCleanup, onMount, Show } from "solid-js";

export interface CreateFocusTrapRegionProps {
  /** Whether the focus trap is active. */
  trapFocus?: MaybeAccessor<boolean | undefined>;

  /**
   * Whether focus should be set on an element once the focus trap region mounts.
   * If `true` focus will be set to the first focusable element inside the focus trap region.
   * If a `string` (query selector) is provided focus will be set to the target element.
   */
  autoFocus?: MaybeAccessor<boolean | string | undefined>;

  /**
   * Whether focus should be restored once the focus trap region unmounts.
   * If `true` focus will be restored to the element that triggered the focus trap region.
   * If a `string` (query selector) is provided focus will be restored to the target element.
   */
  restoreFocus?: MaybeAccessor<boolean | string | undefined>;
}

/**
 * Provide behavior for a component that traps focus within itself.
 * @example
 * let containerRef: any;
 *
 * const { FocusTrap } = createFocusTrapRegion(options, () => containerRef);
 *
 * <>
 *   <FocusTrap />
 *   <div ref={containerRef}>Content</div>
 *   <FocusTrap />
 * </>
 */
export function createFocusTrapRegion<T extends HTMLElement>(
  props: CreateFocusTrapRegionProps,
  ref: Accessor<T | undefined>
) {
  let restoreFocusElement: HTMLElement | null;

  props = mergeDefaultProps({ trapFocus: true }, props);

  const focusInitialElement = () => {
    const containerEl = ref();

    if (!containerEl) {
      return;
    }

    const autoFocusableElement = containerEl.querySelector("[autofocus]") as HTMLElement | null;

    if (autoFocusableElement) {
      focusWithoutScrolling(autoFocusableElement);
      return;
    }

    const autoFocus = access(props.autoFocus);

    if (autoFocus == null || autoFocus === false) {
      return;
    }

    if (isString(autoFocus)) {
      const initialFocusElement = containerEl.querySelector(autoFocus) as HTMLElement | null;

      if (initialFocusElement) {
        focusWithoutScrolling(initialFocusElement);
        return;
      }
    }

    // fallback to first focusable element or container.
    const first = getAllTabbableIn(containerEl)[0] ?? containerEl;
    focusWithoutScrolling(first);
  };

  const setRestoreFocusElement = () => {
    const restoreFocus = access(props.restoreFocus);

    if (restoreFocus == null || restoreFocus === false) {
      return;
    }

    // get a reference to the requested restore focus element.
    if (isString(restoreFocus)) {
      restoreFocusElement = document.querySelector(restoreFocus) as HTMLElement | null;
      return;
    }

    // get a reference to the previous active element to restore focus back.
    restoreFocusElement = getActiveElement();
  };

  const preventRestoreFocus = () => {
    const containerEl = ref();

    if (!containerEl) {
      return false;
    }

    const activeElement = getActiveElement(containerEl);

    if (!activeElement) {
      return false;
    }

    if (contains(containerEl, activeElement)) {
      return false;
    }

    // don't restore focus if a focusable element outside the container is already focused.
    return isFocusable(activeElement);
  };

  const onFocus: JSX.EventHandlerUnion<HTMLSpanElement, FocusEvent> = event => {
    const containerEl = ref();

    if (!containerEl) {
      return;
    }

    const tabbables = getAllTabbableIn(containerEl, true);

    // Fallback to the container element
    if (!tabbables.length) {
      focusWithoutScrolling(containerEl);
      return;
    }

    const first = tabbables[0];
    const last = tabbables[tabbables.length - 1];

    if (event.relatedTarget === first) {
      focusWithoutScrolling(last);
    } else {
      focusWithoutScrolling(first);
    }
  };

  onMount(() => {
    // should run first to get the previous active element in case of restoreFocus,
    // before FocusTrap try to focus initial element.
    setRestoreFocusElement();

    focusInitialElement();
  });

  onCleanup(() => {
    if (preventRestoreFocus() || !restoreFocusElement) {
      return;
    }

    focusWithoutScrolling(restoreFocusElement);
  });

  const FocusTrap = () => {
    return (
      <Show when={access(props.trapFocus)}>
        <span
          tabIndex={0}
          style={{ ...visuallyHiddenStyles, position: "fixed", top: "0", left: "0" }}
          aria-hidden="true"
          data-focus-trap=""
          onFocus={onFocus}
        />
      </Show>
    );
  };

  return { FocusTrap };
}
