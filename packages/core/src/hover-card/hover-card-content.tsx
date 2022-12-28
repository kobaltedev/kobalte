import { createPolymorphicComponent, mergeRefs } from "@kobalte/utils";
import { JSX, Show, splitProps } from "solid-js";

import { DismissableLayer } from "../dismissable-layer";
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
        <DismissableLayer
          ref={mergeRefs(context.setContentRef, local.ref)}
          disableOutsidePointerEvents={false}
          style={{ position: "relative", ...local.style }}
          onFocusOutside={e => e.preventDefault()}
          onDismiss={context.close}
          {...others}
        />
      </Show>
    );
  }
);
