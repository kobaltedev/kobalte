import { createPolymorphicComponent } from "@kobalte/utils";
import { Show } from "solid-js";

import { PopperPositioner, PopperPositionerProps } from "../popper/popper-positioner";
import { useHoverCardContext } from "./hover-card-context";

/**
 * A wrapper component to help positioning the hovercard content on screen.
 */
export const HoverCardPositioner = createPolymorphicComponent<"div", PopperPositionerProps>(
  props => {
    const context = useHoverCardContext();

    return (
      <Show when={context.shouldMount()}>
        <PopperPositioner {...props} />
      </Show>
    );
  }
);
