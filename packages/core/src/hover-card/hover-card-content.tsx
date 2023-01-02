import { createPolymorphicComponent, mergeRefs } from "@kobalte/utils";
import { JSX, Show, splitProps } from "solid-js";

import { DismissableLayer } from "../dismissable-layer";
import { PopperPositioner } from "../popper/popper-positioner";
import { useHoverCardContext } from "./hover-card-context";

export interface HoverCardContentOptions {
  /** The HTML styles attribute (object form only). */
  style?: JSX.CSSProperties;
}

/**
 * Contains the content to be rendered when the hovercard is open.
 */
export const HoverCardContent = createPolymorphicComponent<"div", HoverCardContentOptions>(
  props => {
    const context = useHoverCardContext();

    const [local, others] = splitProps(props, ["ref", "style"]);

    return (
      <Show when={context.shouldMount()}>
        <PopperPositioner>
          <DismissableLayer
            ref={mergeRefs(context.setContentRef, local.ref)}
            isDismissed={!context.isOpen()}
            disableOutsidePointerEvents={false}
            style={{ position: "relative", ...local.style }}
            onFocusOutside={e => e.preventDefault()}
            onDismiss={context.close}
            {...others}
          />
        </PopperPositioner>
      </Show>
    );
  }
);
