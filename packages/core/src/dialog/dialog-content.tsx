/*!
 * Portions of this file are based on code from radix-ui-primitives.
 * MIT Licensed, Copyright (c) 2022 WorkOS.
 *
 * Credits to the Radix UI team:
 * https://github.com/radix-ui/primitives/blob/81b25f4b40c54f72aeb106ca0e64e1e09655153e/packages/react/dialog/src/Dialog.tsx
 */

import {
  focusWithoutScrolling,
  mergeDefaultProps,
  mergeRefs,
  OverrideComponentProps,
} from "@kobalte/utils";
import { createEffect, onCleanup, Show, splitProps } from "solid-js";

import { DismissableLayer } from "../dismissable-layer";
import { AsChildProp } from "../polymorphic";
import {
  createFocusScope,
  createHideOutside,
  createPreventScroll,
  FocusOutsideEvent,
  InteractOutsideEvent,
  PointerDownOutsideEvent,
} from "../primitives";
import { useDialogContext } from "./dialog-context";

export interface DialogContentOptions extends AsChildProp {
  /**
   * Event handler called when focus moves into the component after opening.
   * It can be prevented by calling `event.preventDefault`.
   */
  onOpenAutoFocus?: (event: Event) => void;

  /**
   * Event handler called when focus moves to the trigger after closing.
   * It can be prevented by calling `event.preventDefault`.
   */
  onCloseAutoFocus?: (event: Event) => void;

  /**
   * Event handler called when the escape key is down.
   * It can be prevented by calling `event.preventDefault`.
   */
  onEscapeKeyDown?: (event: KeyboardEvent) => void;

  /**
   * Event handler called when a pointer event occurs outside the bounds of the component.
   * It can be prevented by calling `event.preventDefault`.
   */
  onPointerDownOutside?: (event: PointerDownOutsideEvent) => void;

  /**
   * Event handler called when the focus moves outside the bounds of the component.
   * It can be prevented by calling `event.preventDefault`.
   */
  onFocusOutside?: (event: FocusOutsideEvent) => void;

  /**
   * Event handler called when an interaction (pointer or focus event) happens outside the bounds of the component.
   * It can be prevented by calling `event.preventDefault`.
   */
  onInteractOutside?: (event: InteractOutsideEvent) => void;
}

export interface DialogContentProps extends OverrideComponentProps<"div", DialogContentOptions> {}

/**
 * Contains the content to be rendered when the dialog is open.
 */
export function DialogContent(props: DialogContentProps) {
  let ref: HTMLElement | undefined;

  const context = useDialogContext();

  props = mergeDefaultProps(
    {
      id: context.generateId("content"),
    },
    props
  );

  const [local, others] = splitProps(props, [
    "ref",
    "onOpenAutoFocus",
    "onCloseAutoFocus",
    "onPointerDownOutside",
    "onFocusOutside",
    "onInteractOutside",
  ]);

  let hasInteractedOutside = false;

  const onPointerDownOutside = (e: PointerDownOutsideEvent) => {
    local.onPointerDownOutside?.(e);

    // If the event is a right-click, we shouldn't close because
    // it is effectively as if we right-clicked the `Overlay`.
    if (context.modal() && e.detail.isContextMenu) {
      e.preventDefault();
    }
  };

  const onFocusOutside = (e: FocusOutsideEvent) => {
    local.onFocusOutside?.(e);

    // When focus is trapped, a `focusout` event may still happen.
    // We make sure we don't trigger our `onDismiss` in such case.
    if (context.modal()) {
      e.preventDefault();
    }
  };

  const onInteractOutside = (e: InteractOutsideEvent) => {
    local.onInteractOutside?.(e);

    if (!context.modal() && !e.defaultPrevented) {
      hasInteractedOutside = true;
    }
  };

  const onCloseAutoFocus = (e: Event) => {
    local.onCloseAutoFocus?.(e);

    if (context.modal()) {
      e.preventDefault();
      focusWithoutScrolling(context.triggerRef());
    } else {
      if (!e.defaultPrevented) {
        if (!hasInteractedOutside) {
          focusWithoutScrolling(context.triggerRef());
        }

        // Always prevent autofocus because we either focus manually or want user agent focus
        e.preventDefault();
      }

      hasInteractedOutside = false;
    }
  };

  // aria-hide everything except the content (better supported equivalent to setting aria-modal)
  createHideOutside({
    isDisabled: () => !(context.isOpen() && context.modal()),
    targets: () => (ref ? [ref] : []),
  });

  createPreventScroll({
    ownerRef: () => ref,
    isDisabled: () => !(context.isOpen() && context.modal()),
  });

  createFocusScope(
    {
      trapFocus: () => context.isOpen() && context.modal(),
      onMountAutoFocus: local.onOpenAutoFocus,
      onUnmountAutoFocus: onCloseAutoFocus,
    },
    () => ref
  );

  createEffect(() => onCleanup(context.registerContentId(others.id!)));

  return (
    <Show when={context.contentPresence.isPresent()}>
      <DismissableLayer
        ref={mergeRefs(el => {
          context.contentPresence.setRef(el);
          ref = el;
        }, local.ref)}
        role="dialog"
        tabIndex={-1}
        disableOutsidePointerEvents={context.modal() && context.isOpen()}
        excludedElements={[context.triggerRef]}
        aria-labelledby={context.titleId()}
        aria-describedby={context.descriptionId()}
        data-expanded={context.isOpen() ? "" : undefined}
        data-closed={!context.isOpen() ? "" : undefined}
        onPointerDownOutside={onPointerDownOutside}
        onFocusOutside={onFocusOutside}
        onInteractOutside={onInteractOutside}
        onDismiss={context.close}
        {...others}
      />
    </Show>
  );
}
