import { focusWithoutScrolling, mergeRefs, OverrideComponentProps } from "@kobalte/utils";
import { JSX, Show, splitProps } from "solid-js";

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
import { useComboboxContext } from "./combobox-context";

export interface MultiComboboxContentOptions extends AsChildProp {
  /**
   * Event handler called when focus moves to the trigger after closing.
   * It can be prevented by calling `event.preventDefault`.
   */
  onCloseAutoFocus?: (event: Event) => void;

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

  /** The HTML styles attribute (object form only). */
  style?: JSX.CSSProperties;
}

export interface MultiComboboxContentProps
  extends OverrideComponentProps<"div", MultiComboboxContentOptions> {}

/**
 * The component that pops out when the combobox is open.
 */
export function MultiComboboxContent(props: MultiComboboxContentProps) {
  let ref: HTMLElement | undefined;

  const context = useComboboxContext();

  const [local, others] = splitProps(props, [
    "ref",
    "id",
    "style",
    "onCloseAutoFocus",
    "onFocusOutside",
  ]);

  const close = () => {
    context.resetInputAfterClose();
    context.close();
  };

  const onFocusOutside = (e: FocusOutsideEvent) => {
    local.onFocusOutside?.(e);

    // When focus is trapped (in modal mode), a `focusout` event may still happen.
    // We make sure we don't trigger our `onDismiss` in such case.
    if (context.isOpen() && context.isModal()) {
      e.preventDefault();
    }
  };

  // aria-hide everything except the content (better supported equivalent to setting aria-modal)
  createHideOutside({
    isDisabled: () => !(context.isOpen() && context.isModal()),
    targets: () => {
      const excludedElements = [];

      if (ref) {
        excludedElements.push(ref);
      }

      const triggerEl = context.triggerRef();
      if (triggerEl) {
        excludedElements.push(triggerEl);
      }

      const inputEl = context.inputRef();
      if (inputEl) {
        excludedElements.push(inputEl);
      }

      const buttonEl = context.buttonRef();
      if (buttonEl) {
        excludedElements.push(buttonEl);
      }

      return excludedElements;
    },
  });

  createPreventScroll({
    ownerRef: () => ref,
    isDisabled: () => !(context.isOpen() && context.isModal()),
  });

  createFocusScope(
    {
      trapFocus: context.isOpen() && context.isModal(),
      onMountAutoFocus: e => {
        // We prevent open autofocus because it's handled by the `Listbox`.
        e.preventDefault();
      },
      onUnmountAutoFocus: e => {
        local.onCloseAutoFocus?.(e);

        if (!e.defaultPrevented) {
          focusWithoutScrolling(context.inputRef());
          e.preventDefault();
        }
      },
    },
    () => ref
  );

  return (
    <Show when={context.contentPresence.isPresent()}>
      <PopperPositioner>
        <DismissableLayer
          ref={mergeRefs(el => {
            context.setContentRef(el);
            context.contentPresence.setRef(el);
            ref = el;
          }, local.ref)}
          disableOutsidePointerEvents={context.isModal() && context.isOpen()}
          excludedElements={[context.triggerRef, context.inputRef, context.buttonRef]}
          style={{
            "--kb-combobox-content-transform-origin": "var(--kb-popper-content-transform-origin)",
            position: "relative",
            ...local.style,
          }}
          onFocusOutside={onFocusOutside}
          onDismiss={close}
          {...context.dataset()}
          {...others}
        />
      </PopperPositioner>
    </Show>
  );
}
