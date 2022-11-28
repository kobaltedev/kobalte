import { createPolymorphicComponent, mergeDefaultProps, mergeRefs } from "@kobalte/utils";
import { JSX, Show, splitProps } from "solid-js";

import { usePopoverContext } from "./popover-context";

export interface PopoverPositionerProps {
  /** The HTML styles attribute (object form only). */
  style?: JSX.CSSProperties;

  /**
   * Used to force mounting when more control is needed.
   * Useful when controlling animation with SolidJS animation libraries.
   */
  forceMount?: boolean;
}

/**
 * The element that positions the popover.
 */
export const PopoverPositioner = createPolymorphicComponent<"div", PopoverPositionerProps>(
  props => {
    const context = usePopoverContext();

    props = mergeDefaultProps({ as: "div" }, props);

    const [local, others] = splitProps(props, ["ref", "style", "forceMount"]);

    return (
      <Show when={local.forceMount || context.isOpen()}>
        <div
          ref={mergeRefs(context.setPositionerRef, local.ref)}
          role="presentation"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            ...local.style,
          }}
          {...context.dataset()}
          {...others}
        />
      </Show>
    );
  }
);
