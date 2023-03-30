import { mergeRefs, OverrideComponentProps } from "@kobalte/utils";
import { JSX, Show, splitProps } from "solid-js";

import { DismissableLayer } from "../dismissable-layer";
import { AsChildProp } from "../polymorphic";
import { PopperPositioner } from "../popper";
import { useHoverCardContext } from "./hover-card-context";

export interface HoverCardContentOptions extends AsChildProp {
  /** The HTML styles attribute (object form only). */
  style?: JSX.CSSProperties;
}

export interface HoverCardContentProps
  extends OverrideComponentProps<"div", HoverCardContentOptions> {}

/**
 * Contains the content to be rendered when the hovercard is open.
 */
export function HoverCardContent(props: HoverCardContentProps) {
  const context = useHoverCardContext();

  const [local, others] = splitProps(props, ["ref", "style"]);

  return (
    <Show when={context.contentPresence.isPresent()}>
      <PopperPositioner>
        <DismissableLayer
          ref={mergeRefs(el => {
            context.setContentRef(el);
            context.contentPresence.setRef(el);
          }, local.ref)}
          disableOutsidePointerEvents={false}
          style={{
            "--kb-hovercard-content-transform-origin": "var(--kb-popper-content-transform-origin)",
            position: "relative",
            ...local.style,
          }}
          onFocusOutside={e => e.preventDefault()}
          onDismiss={context.close}
          {...context.dataset()}
          {...others}
        />
      </PopperPositioner>
    </Show>
  );
}
