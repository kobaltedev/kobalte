import {
  createPolymorphicComponent,
  focusWithoutScrolling,
  getDocument,
  mergeDefaultProps,
  mergeRefs,
} from "@kobalte/utils";
import { JSX, splitProps } from "solid-js";

import { DismissableLayer } from "../dismissable-layer";
import { usePopoverContext } from "../popover/popover-context";
import { createEscapeKeyDown, createFocusScope } from "../primitives";
import { useSelectContext } from "./select-context";

export interface SelectContentProps {
  /** The HTML styles attribute (object form only). */
  style?: JSX.CSSProperties;

  /**
   * Used to force keeping the content visible when more control is needed.
   * Useful when controlling animation with SolidJS animation libraries.
   */
  keepVisible?: boolean;
}

/**
 * The component that pops out when the select is open.
 */
export const SelectContent = createPolymorphicComponent<"div", SelectContentProps>(props => {
  let ref: HTMLElement | undefined;

  const popoverContext = usePopoverContext();
  const context = useSelectContext();

  props = mergeDefaultProps({ as: "div" }, props);

  const [local, others] = splitProps(props, ["ref", "id", "style", "keepVisible"]);

  const keepVisible = () => local.keepVisible || context.isOpen();

  createEscapeKeyDown({
    ownerDocument: () => getDocument(ref),
    onEscapeKeyDown: () => context.close(),
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
    <DismissableLayer
      ref={mergeRefs(el => {
        popoverContext.setContentRef(el);
        ref = el;
      }, local.ref)}
      hidden={!keepVisible()}
      style={{
        position: "relative",
        display: !keepVisible() ? "none" : undefined,
        ...local.style,
      }}
      disableOutsidePointerEvents={false}
      excludedElements={[context.triggerRef]}
      onEscapeKeyDown={e => e.preventDefault()}
      onFocusOutside={e => e.preventDefault()}
      onDismiss={context.close}
      {...others}
    />
  );
});
