import { createPolymorphicComponent, mergeDefaultProps, mergeRefs } from "@kobalte/utils";
import { JSX, Show, splitProps } from "solid-js";

import { DismissableLayer } from "../dismissable-layer";
import { usePopoverContext } from "./popover-context";

export interface PopoverPositionerProps {
  /** The HTML styles attribute (object form only). */
  style?: JSX.CSSProperties;
}

/**
 * A wrapper component to help positioning the popover content on screen.
 */
export const PopoverPositioner = createPolymorphicComponent<"div", PopoverPositionerProps>(
  props => {
    const context = usePopoverContext();

    props = mergeDefaultProps({ as: "div" }, props);

    const [local, others] = splitProps(props, ["ref", "style"]);

    return (
      <Show when={context.shouldMount()}>
        <DismissableLayer
          ref={mergeRefs(context.setPositionerRef, local.ref)}
          isOpen={context.isOpen()}
          isModal={context.isModal()}
          closeOnEsc={context.closeOnEsc()}
          closeOnInteractOutside={context.closeOnInteractOutside()}
          shouldCloseOnInteractOutside={context.shouldCloseOnInteractOutside}
          onClose={context.close}
          role="presentation"
          style={{ position: "absolute", top: 0, left: 0, ...local.style }}
          {...others}
        />
      </Show>
    );
  }
);
