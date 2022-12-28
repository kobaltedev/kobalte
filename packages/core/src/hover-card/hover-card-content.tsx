import { createPolymorphicComponent, mergeRefs } from "@kobalte/utils";
import { JSX, Show, splitProps } from "solid-js";

import { DismissableLayer } from "../dismissable-layer";
import { usePopoverContext } from "../popover/popover-context";
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
    const popoverContext = usePopoverContext();
    const context = useHoverCardContext();

    const [local, others] = splitProps(props, ["ref", "style"]);

    return (
      <Show when={popoverContext.shouldMount()}>
        <DismissableLayer
          ref={mergeRefs(el => {
            popoverContext.setContentRef(el);
            context.setContentRef(el);
          }, local.ref)}
          disableOutsidePointerEvents={false}
          style={{ position: "relative", ...local.style }}
          aria-labelledby={popoverContext.titleId()}
          aria-describedby={popoverContext.descriptionId()}
          onFocusOutside={e => e.preventDefault()}
          onDismiss={popoverContext.close}
          {...others}
        />
      </Show>
    );
  }
);
