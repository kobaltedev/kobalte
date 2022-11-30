import { createPolymorphicComponent, mergeDefaultProps, mergeRefs } from "@kobalte/utils";
import { JSX, Show, splitProps } from "solid-js";

import { useDialogContext, useDialogPortalContext } from "../dialog";
import { usePopoverContext } from "./popover-context";
import { Dynamic } from "solid-js/web";

export interface PopoverPositionerProps {
  /** The HTML styles attribute (object form only). */
  style?: JSX.CSSProperties;

  /**
   * Used to force mounting when more control is needed.
   * Useful when controlling animation with SolidJS animation libraries.
   * It inherits from `Popover.Portal`.
   */
  forceMount?: boolean;
}

/**
 * The element that positions the popover.
 */
export const PopoverPositioner = createPolymorphicComponent<"div", PopoverPositionerProps>(
  props => {
    const dialogContext = useDialogContext();
    const portalContext = useDialogPortalContext();
    const popoverContext = usePopoverContext();

    props = mergeDefaultProps({ as: "div" }, props);

    const [local, others] = splitProps(props, ["as", "ref", "style", "forceMount"]);

    return (
      <Show when={local.forceMount || portalContext?.forceMount() || dialogContext.isOpen()}>
        <Dynamic
          component={local.as}
          ref={mergeRefs(popoverContext.setPositionerRef, local.ref)}
          role="presentation"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            ...local.style,
          }}
          {...dialogContext.dataset()}
          {...others}
        />
      </Show>
    );
  }
);
