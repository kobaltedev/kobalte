/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
import {
  access,
  contains,
  focusWithoutScrolling,
  getActiveElement,
  getAllTabbableIn,
  isFocusable,
  isString,
  mergeDefaultProps,
  visuallyHiddenStyles,
} from "@kobalte/utils";
import { JSX, onCleanup, onMount, Show } from "solid-js";

export interface FocusScopeProps {
  /** Whether the focus trap is active. */
  trapFocus?: boolean;

  /**
   * Whether focus should be set on an element once the focus trap region mounts.
   * If `true` focus will be set to the first focusable element inside the focus trap region.
   * If a `string` (query selector) is provided focus will be set to the target element.
   */
  autoFocus?: boolean | string;

  /**
   * Whether focus should be restored once the focus trap region unmounts.
   * If `true` focus will be restored to the element that triggered the focus trap region.
   * If a `string` (query selector) is provided focus will be restored to the target element.
   */
  restoreFocus?: boolean | string;

  /**
   * The children of the `FocusScope`.
   * It receives a function to set the ref on the element in which focus should be trapped.
   */
  children: (setContainerRef: (el: HTMLElement) => void) => JSX.Element;
}

export function FocusScope(props: FocusScopeProps) {
  let containerRef: HTMLElement | undefined;
  let restoreFocusElement: HTMLElement | null;

  props = mergeDefaultProps({ trapFocus: true }, props);

  const focusInitialElement = () => {
    if (!containerRef) {
      return;
    }

    const autoFocusableElement = containerRef.querySelector("[autofocus]") as HTMLElement | null;

    if (autoFocusableElement) {
      focusWithoutScrolling(autoFocusableElement);
      return;
    }

    const autoFocus = access(props.autoFocus);

    if (autoFocus == null || autoFocus === false) {
      return;
    }

    if (isString(autoFocus)) {
      const initialFocusElement = containerRef.querySelector(autoFocus) as HTMLElement | null;

      if (initialFocusElement) {
        focusWithoutScrolling(initialFocusElement);
        return;
      }
    }

    // fallback to first focusable element or container.
    const first = getAllTabbableIn(containerRef)[0] ?? containerRef;
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
    if (!containerRef) {
      return false;
    }

    const activeElement = getActiveElement(containerRef);

    if (!activeElement) {
      return false;
    }

    if (contains(containerRef, activeElement)) {
      return false;
    }

    // don't restore focus if a focusable element outside the container is already focused.
    return isFocusable(activeElement);
  };

  const onFocus: JSX.EventHandlerUnion<HTMLSpanElement, FocusEvent> = event => {
    if (!containerRef) {
      return;
    }

    const tabbables = getAllTabbableIn(containerRef, true);

    // Fallback to the container element
    if (!tabbables.length) {
      focusWithoutScrolling(containerRef);
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
    // before trying to focus initial element.
    setRestoreFocusElement();

    focusInitialElement();
  });

  onCleanup(() => {
    if (preventRestoreFocus() || !restoreFocusElement) {
      return;
    }

    focusWithoutScrolling(restoreFocusElement);
  });

  const renderFocusTrap = () => (
    <Show when={props.trapFocus}>
      <span
        tabIndex={0}
        style={{ ...visuallyHiddenStyles, position: "fixed", top: "0", left: "0" }}
        aria-hidden="true"
        data-focus-trap=""
        onFocus={onFocus}
      />
    </Show>
  );

  return (
    <>
      {renderFocusTrap()}
      {props.children(el => (containerRef = el))}
      {renderFocusTrap()}
    </>
  );
}
