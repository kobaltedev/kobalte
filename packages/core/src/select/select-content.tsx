import { focusWithoutScrolling, mergeRefs, OverrideComponentProps } from "@kobalte/utils";
import { JSX, Show, splitProps } from "solid-js";

import { DismissableLayer } from "../dismissable-layer";
import { PopperPositioner } from "../popper";
import {
  createFocusScope,
  createHideOutside,
  createPreventScroll,
  FocusOutsideEvent,
} from "../primitives";
import { useSelectContext } from "./select-context";
import { AsChildProp } from "../polymorphic";

export interface SelectContentOptions extends AsChildProp {
  /** The HTML styles attribute (object form only). */
  style?: JSX.CSSProperties;
}

/**
 * The component that pops out when the select is open.
 */
export function SelectContent(props: OverrideComponentProps<"div", SelectContentOptions>) {
  let ref: HTMLElement | undefined;

  const context = useSelectContext();

  const [local, others] = splitProps(props, ["ref", "id", "style"]);

  const onEscapeKeyDown = (e: KeyboardEvent) => {
    // `createSelectableList` prevent escape key down,
    // which prevent our `onDismiss` in `DismissableLayer` to run,
    // so we force "close on escape" here.
    context.close();
  };

  const onFocusOutside = (e: FocusOutsideEvent) => {
    // When focus is trapped, a `focusout` event may still happen.
    // We make sure we don't trigger our `onDismiss` in such case.
    e.preventDefault();
  };

  // aria-hide everything except the content (better supported equivalent to setting aria-modal)
  createHideOutside({
    isDisabled: () => !context.isOpen(),
    targets: () => (ref ? [ref] : []),
  });

  createPreventScroll({
    isDisabled: () => !context.isOpen(),
  });

  createFocusScope(
    {
      trapFocus: context.isOpen,
      onMountAutoFocus: e => {
        // We prevent open autofocus because it's handled by the `Listbox`.
        e.preventDefault();
      },
      onUnmountAutoFocus: e => {
        focusWithoutScrolling(context.triggerRef());
        e.preventDefault();
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
          disableOutsidePointerEvents={context.isOpen()}
          excludedElements={[context.triggerRef]}
          style={{
            "--kb-select-content-transform-origin": "var(--kb-popper-content-transform-origin)",
            position: "relative",
            ...local.style,
          }}
          onEscapeKeyDown={onEscapeKeyDown}
          onFocusOutside={onFocusOutside}
          onDismiss={context.close}
          {...others}
        />
      </PopperPositioner>
    </Show>
  );
}
