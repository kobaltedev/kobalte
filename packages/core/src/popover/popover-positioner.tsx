import { createPolymorphicComponent, mergeDefaultProps, mergeRefs } from "@kobalte/utils";
import { JSX, Show, splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

import { usePopoverContext } from "./popover-context";

export interface PopoverPositionerProps {
  /** The HTML styles attribute (object form only). */
  style?: JSX.CSSProperties;
}

/**
 * A wrapper component to help positioning the popover panel on screen.
 */
export const PopoverPositioner = createPolymorphicComponent<"div", PopoverPositionerProps>(
  props => {
    const context = usePopoverContext();

    props = mergeDefaultProps({ as: "div" }, props);

    const [local, others] = splitProps(props, ["as", "ref", "style"]);

    return (
      <Show when={context.shouldMount()}>
        <Dynamic
          component={local.as}
          ref={mergeRefs(context.setPositionerRef, local.ref)}
          role="presentation"
          style={{ position: "absolute", top: 0, left: 0, ...local.style }}
          {...others}
        />
      </Show>
    );
  }
);
