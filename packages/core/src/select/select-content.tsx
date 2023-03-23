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
  PointerDownOutsideEvent,
} from "../primitives";
import { useSelectContext } from "./select-context";

export interface SelectContentOptions extends AsChildProp {
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

  /** The HTML styles attribute (object form only). */
  style?: JSX.CSSProperties;
}

export interface SelectContentProps extends OverrideComponentProps<"div", SelectContentOptions> {}

/**
 * The component that pops out when the select is open.
 */
export function SelectContent(props: SelectContentProps) {
  let ref: HTMLElement | undefined;

  const context = useSelectContext();

  const [local, others] = splitProps(props, [
    "ref",
    "id",
    "style",
    "onCloseAutoFocus",
    "onEscapeKeyDown",
  ]);

  const onEscapeKeyDown = (e: KeyboardEvent) => {
    local.onEscapeKeyDown?.(e);

    // `createSelectableList` prevent escape key down,
    // which prevent our `onDismiss` in `DismissableLayer` to run,
    // so we force "close on escape" here.
    if (!e.defaultPrevented) {
      context.close();
    }
  };

  const onFocusOutside = (e: FocusOutsideEvent) => {
    // When focus is trapped (in modal mode), a `focusout` event may still happen.
    // We make sure we don't trigger our `onDismiss` in such case.
    if (context.isOpen() && context.isModal()) {
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
          focusWithoutScrolling(context.triggerRef());
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
          isDismissed={!context.isOpen()}
          disableOutsidePointerEvents={context.isOpen() && context.isModal()}
          excludedElements={[context.triggerRef]}
          style={{
            "--kb-select-content-transform-origin": "var(--kb-popper-content-transform-origin)",
            position: "relative",
            ...local.style,
          }}
          onEscapeKeyDown={onEscapeKeyDown}
          onFocusOutside={onFocusOutside}
          onDismiss={context.close}
          {...context.dataset()}
          {...others}
        />
      </PopperPositioner>
    </Show>
  );
}
