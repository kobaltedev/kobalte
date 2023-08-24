import {
  contains,
  focusWithoutScrolling,
  mergeDefaultProps,
  mergeRefs,
  OverrideComponentProps,
} from "@kobalte/utils";
import { createEffect, JSX, onCleanup, Show, splitProps } from "solid-js";

import { DismissableLayer } from "../dismissable-layer";
import { AsChildProp } from "../polymorphic";
import { PopperPositioner } from "../popper";
import {
  createFocusScope,
  createHideOutside,
  createPreventScroll,
  FocusOutsideEvent,
  InteractOutsideEvent,
  PointerDownOutsideEvent,
} from "../primitives";
import { usePopoverContext } from "./popover-context";

export interface PopoverContentOptions extends AsChildProp {
  /** The HTML styles attribute (object form only). */
  style?: JSX.CSSProperties;

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

export interface PopoverContentProps extends OverrideComponentProps<"div", PopoverContentOptions> {}

/**
 * Contains the content to be rendered when the popover is open.
 */
export function PopoverContent(props: PopoverContentProps) {
  let ref: HTMLElement | undefined;

  const context = usePopoverContext();

  props = mergeDefaultProps(
    {
      id: context.generateId("content"),
    },
    props,
  );

  const [local, others] = splitProps(props, [
    "ref",
    "style",
    "onOpenAutoFocus",
    "onCloseAutoFocus",
    "onPointerDownOutside",
    "onFocusOutside",
    "onInteractOutside",
  ]);

  let isRightClickOutside = false;
  let hasInteractedOutside = false;
  let hasPointerDownOutside = false;

  const onCloseAutoFocus = (e: Event) => {
    local.onCloseAutoFocus?.(e);

    if (context.isModal()) {
      e.preventDefault();

      if (!isRightClickOutside) {
        focusWithoutScrolling(context.triggerRef());
      }
    } else {
      if (!e.defaultPrevented) {
        if (!hasInteractedOutside) {
          focusWithoutScrolling(context.triggerRef());
        }

        // Always prevent autofocus because we either focus manually or want user agent focus
        e.preventDefault();
      }

      hasInteractedOutside = false;
      hasPointerDownOutside = false;
    }
  };

  const onPointerDownOutside = (e: PointerDownOutsideEvent) => {
    local.onPointerDownOutside?.(e);

    if (context.isModal()) {
      isRightClickOutside = e.detail.isContextMenu;
    }
  };

  const onFocusOutside = (e: FocusOutsideEvent) => {
    local.onFocusOutside?.(e);

    // When focus is trapped, a `focusout` event may still happen.
    // We make sure we don't trigger our `onDismiss` in such case.
    if (context.isOpen() && context.isModal()) {
      e.preventDefault();
    }
  };

  const onInteractOutside = (e: InteractOutsideEvent) => {
    local.onInteractOutside?.(e);

    if (context.isModal()) {
      return;
    }

    // Non-modal behavior below

    if (!e.defaultPrevented) {
      hasInteractedOutside = true;

      if (e.detail.originalEvent.type === "pointerdown") {
        hasPointerDownOutside = true;
      }
    }

    // Prevent dismissing when clicking the trigger.
    // As the trigger is already setup to close, without doing so would
    // cause it to close and immediately open.
    if (contains(context.triggerRef(), e.target as HTMLElement)) {
      e.preventDefault();
    }

    // On Safari if the trigger is inside a container with tabIndex={0}, when clicked
    // we will get the pointer down outside event on the trigger, but then a subsequent
    // focus outside event on the container, we ignore any focus outside event when we've
    // already had a pointer down outside event.
    if (e.detail.originalEvent.type === "focusin" && hasPointerDownOutside) {
      e.preventDefault();
    }
  };

  // aria-hide everything except the content (better supported equivalent to setting aria-modal)
  createHideOutside({
    isDisabled: () => !(context.isOpen() && context.isModal()),
    targets: () => (ref ? [ref] : []),
  });

  createPreventScroll({
    ownerRef: () => ref,
    isDisabled: () => !(context.isOpen() && (context.isModal() || context.preventScroll())),
  });

  createFocusScope(
    {
      trapFocus: () => context.isOpen() && context.isModal(),
      onMountAutoFocus: local.onOpenAutoFocus,
      onUnmountAutoFocus: onCloseAutoFocus,
    },
    () => ref,
  );

  createEffect(() => onCleanup(context.registerContentId(others.id!)));

  return (
    <Show when={context.contentPresence.isPresent()}>
      <PopperPositioner>
        <DismissableLayer
          ref={mergeRefs(el => {
            context.setContentRef(el);
            context.contentPresence.setRef(el);
            ref = el;
          }, local.ref)}
          role="dialog"
          tabIndex={-1}
          disableOutsidePointerEvents={context.isOpen() && context.isModal()}
          excludedElements={[context.triggerRef]}
          style={{
            "--kb-popover-content-transform-origin": "var(--kb-popper-content-transform-origin)",
            position: "relative",
            ...local.style,
          }}
          aria-labelledby={context.titleId()}
          aria-describedby={context.descriptionId()}
          onPointerDownOutside={onPointerDownOutside}
          onFocusOutside={onFocusOutside}
          onInteractOutside={onInteractOutside}
          onDismiss={context.close}
          {...context.dataset()}
          {...others}
        />
      </PopperPositioner>
    </Show>
  );
}
