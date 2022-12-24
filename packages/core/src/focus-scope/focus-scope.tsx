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
  /**
   * Whether to contain focus inside the scope, so users cannot move focus outside,
   * for example in a modal dialog.
   */
  trapFocus?: boolean;

  /** Whether to autofocus the first focusable element in the focus scope on mount. */
  autoFocus?: boolean;

  /**
   * Whether to restore focus back to the element that was focused when the focus scope mounted,
   * after the focus scope unmounts.
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

    if (!access(props.autoFocus)) {
      return;
    }

    // fallback to first focusable element or container.
    const first = getAllTabbableIn(containerRef)[0] ?? containerRef;
    console.log("first focusable el -", first);

    queueMicrotask(() => {
      focusWithoutScrolling(first);
    });
  };

  const setRestoreFocusElement = () => {
    if (!access(props.restoreFocus)) {
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
