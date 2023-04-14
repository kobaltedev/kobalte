import {
  focusWithoutScrolling,
  mergeDefaultProps,
  mergeRefs,
  OverrideComponentProps,
} from "@kobalte/utils";
import { createEffect, JSX, onCleanup, Show, splitProps } from "solid-js";

import { DismissableLayer } from "../dismissable-layer";
import { useFormControlContext } from "../form-control";
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
import { useDatePickerContext } from "./date-picker-context";

export interface DatePickerContentOptions extends AsChildProp {
  /** The HTML styles attribute (object form only). */
  style?: JSX.CSSProperties;

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

export interface DatePickerContentProps
  extends OverrideComponentProps<"div", DatePickerContentOptions> {}

/**
 * The component that pops out when the date picker is open.
 */
export function DatePickerContent(props: DatePickerContentProps) {
  let ref: HTMLElement | undefined;

  const formControlContext = useFormControlContext();
  const context = useDatePickerContext();

  props = mergeDefaultProps(
    {
      id: context.generateId("content"),
    },
    props
  );

  const [local, others] = splitProps(props, [
    "ref",
    "style",
    "onCloseAutoFocus",
    "onPointerDownOutside",
    "onFocusOutside",
    "onInteractOutside",
    "aria-labelledby",
  ]);

  let isRightClickOutside = false;
  let hasInteractedOutside = false;

  const ariaLabelledBy = () => {
    return formControlContext.getAriaLabelledBy(
      context.triggerId(),
      others["aria-label"],
      local["aria-labelledby"]
    );
  };

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
    if (context.isModal()) {
      e.preventDefault();
    }
  };

  const onInteractOutside = (e: InteractOutsideEvent) => {
    local.onInteractOutside?.(e);

    if (!context.isModal() && !e.defaultPrevented) {
      hasInteractedOutside = true;
    }
  };

  // aria-hide everything except the content (better supported equivalent to setting aria-modal)
  createHideOutside({
    isDisabled: () => !(context.isModal() && context.isOpen()),
    targets: () => {
      const excludedElements = [];

      if (ref) {
        excludedElements.push(ref);
      }

      const controlEl = context.controlRef();
      if (controlEl) {
        excludedElements.push(controlEl);
      }

      return excludedElements;
    },
  });

  createPreventScroll({
    ownerRef: () => ref,
    isDisabled: () => !(context.isModal() && context.isOpen()),
  });

  createFocusScope(
    {
      trapFocus: () => context.isModal() && context.isOpen(),
      onMountAutoFocus: e => {
        // We prevent open autofocus because it's handled by the `Calendar`.
        e.preventDefault();
      },
      onUnmountAutoFocus: onCloseAutoFocus,
    },
    () => ref
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
          disableOutsidePointerEvents={context.isModal() && context.isOpen()}
          excludedElements={[context.controlRef]}
          style={{
            "--kb-date-picker-content-transform-origin":
              "var(--kb-popper-content-transform-origin)",
            position: "relative",
            ...local.style,
          }}
          aria-labelledby={ariaLabelledBy()}
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
