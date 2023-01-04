import {
  createPolymorphicComponent,
  focusWithoutScrolling,
  mergeDefaultProps,
  mergeRefs,
} from "@kobalte/utils";
import { JSX, splitProps } from "solid-js";

import { DismissableLayer } from "../dismissable-layer";
import { PopperPositioner } from "../popper/popper-positioner";
import {
  createFocusScope,
  createHideOutside,
  createPreventScroll,
  FocusOutsideEvent,
} from "../primitives";
import { useSelectContext } from "./select-context";

export interface SelectContentOptions {
  /** The HTML styles attribute (object form only). */
  style?: JSX.CSSProperties;

  /**
   * Used to force keeping the content visible when more control is needed.
   * Useful when controlling animation with SolidJS animation libraries.
   */
  forceMount?: boolean;
}

/**
 * The component that pops out when the select is open.
 */
export const SelectContent = createPolymorphicComponent<"div", SelectContentOptions>(props => {
  let ref: HTMLElement | undefined;

  const context = useSelectContext();

  props = mergeDefaultProps({ as: "div" }, props);

  const [local, others] = splitProps(props, ["ref", "id", "style", "forceMount"]);

  const forceMount = () => local.forceMount || context.isOpen();

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
    <PopperPositioner>
      <DismissableLayer
        ref={mergeRefs(el => {
          context.setContentRef(el);
          ref = el;
        }, local.ref)}
        isDismissed={!context.isOpen()}
        disableOutsidePointerEvents={context.isOpen()}
        excludedElements={[context.triggerRef]}
        hidden={!forceMount()}
        style={{
          position: "relative",
          display: !forceMount() ? "none" : undefined,
          ...local.style,
        }}
        onEscapeKeyDown={onEscapeKeyDown}
        onFocusOutside={onFocusOutside}
        onDismiss={context.close}
        {...others}
      />
    </PopperPositioner>
  );
});
