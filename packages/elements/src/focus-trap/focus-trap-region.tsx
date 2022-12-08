/* eslint-disable jsx-a11y/no-noninteractive-tabindex */

/*!
 * Portions of this file are based on code from ariakit.
 * MIT Licensed, Copyright (c) Diego Haz.
 *
 * Credits to the Ariakit team:
 * https://github.com/ariakit/ariakit/blob/232bc79018ec20967fec1e097a9474aba3bb5be7/packages/ariakit/src/focus-trap/focus-trap-region.tsx
 *
 * Portions of this file are based on code from chakra-ui.
 * MIT Licensed, Copyright (c) 2019 Segun Adebayo.
 *
 * Credits to the Chakra UI team:
 * https://github.com/chakra-ui/chakra-ui/blob/d945b9a7da3056017cda0cdd552af40fa1426070/packages/hooks/use-focus-effect/src/index.ts
 */

import {
  contains,
  createPolymorphicComponent,
  focusWithoutScrolling,
  getActiveElement,
  getAllTabbableIn,
  isFocusable,
  mergeDefaultProps,
  mergeRefs,
  visuallyHiddenStyles,
} from "@kobalte/utils";
import { ComponentProps, JSX, onCleanup, onMount, ParentProps, Show, splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

export interface FocusTrapRegionProps extends ParentProps {
  /** Whether the focus trap should be active. */
  trapFocus?: boolean;

  /**
   * Whether the first focusable element or the element targeted by `initialFocusSelector`
   * should be focused once `FocusTrapRegion` mounts.
   */
  autoFocus?: boolean;

  /**
   * Whether focus should be restored to the element that triggered the `FocusTrapRegion`
   * or the element targeted by `restoreFocusSelector` once it unmounts.
   */
  restoreFocus?: boolean;

  /** A query selector to retrieve the element that should receive focus once `FocusTrapRegion` mounts. */
  initialFocusSelector?: string;

  /** A query selector to retrieve the element that should receive focus once `FocusTrapRegion` unmounts. */
  restoreFocusSelector?: string;
}

/**
 * A component that traps focus within itself.
 * It renders a `<div>` by default.
 */
export const FocusTrapRegion = createPolymorphicComponent<"div", FocusTrapRegionProps>(props => {
  let restoreFocusElement: HTMLElement | null;
  let ref: HTMLDivElement | undefined;

  props = mergeDefaultProps(
    {
      as: "div",
      initialFocusSelector: "[data-autofocus]",
    },
    props
  );

  const [local, others] = splitProps(props, [
    "as",
    "ref",
    "trapFocus",
    "autoFocus",
    "restoreFocus",
    "initialFocusSelector",
    "restoreFocusSelector",
  ]);

  const focusInitialElement = () => {
    if (!ref || !local.autoFocus) {
      return;
    }

    const initialFocusElement = ref.querySelector(
      local.initialFocusSelector!
    ) as HTMLElement | null;

    if (initialFocusElement) {
      focusWithoutScrolling(initialFocusElement);
      return;
    }

    // fallback to first focusable element or container.
    const first = getAllTabbableIn(ref)[0] ?? ref;
    focusWithoutScrolling(first);
  };

  const setRestoreFocusElement = () => {
    if (!local.restoreFocus) {
      return;
    }

    // get a reference to the requested restore focus element.
    if (local.restoreFocusSelector) {
      restoreFocusElement = document.querySelector(
        local.restoreFocusSelector
      ) as HTMLElement | null;
      return;
    }

    // get a reference to the previous active element to restore focus back.
    restoreFocusElement = getActiveElement();
  };

  const preventRestoreFocus = () => {
    if (!ref) {
      return false;
    }

    const activeElement = getActiveElement(ref);

    if (!activeElement) {
      return false;
    }

    if (contains(ref, activeElement)) {
      return false;
    }

    // don't restore focus if a focusable element outside the container is already focused.
    return isFocusable(activeElement);
  };

  const onFocus: JSX.EventHandlerUnion<HTMLSpanElement, FocusEvent> = event => {
    if (!ref) {
      return;
    }

    // Because this function run only when focus trap is active,
    // we remove first and last element since they are `FocusTrap`.
    const tabbables = getAllTabbableIn(ref).slice(1, -1);

    // Fallback to the container element
    if (!tabbables.length) {
      focusWithoutScrolling(ref);
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
    if (!restoreFocusElement || preventRestoreFocus()) {
      return;
    }

    focusWithoutScrolling(restoreFocusElement);
  });

  return (
    <Dynamic component={local.as} ref={mergeRefs(el => (ref = el), local.ref)} {...others}>
      <Show when={local.trapFocus} fallback={props.children}>
        <FocusTrap onFocus={onFocus} />
        {props.children}
        <FocusTrap onFocus={onFocus} />
      </Show>
    </Dynamic>
  );
});

function FocusTrap(props: ComponentProps<"span">) {
  return (
    <span
      tabIndex={0}
      style={{ ...visuallyHiddenStyles, position: "fixed", top: "0", left: "0" }}
      aria-hidden="true"
      data-focus-trap=""
      {...props}
    />
  );
}
