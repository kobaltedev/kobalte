import { createPolymorphicComponent, mergeDefaultProps } from "@kobalte/utils";
import { Show, splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

import { useRadioContext } from "./radio-context";

export interface RadioIndicatorProps {
  /**
   * Used to force mounting when more control is needed.
   * Useful when controlling animation with SolidJS animation libraries.
   */
  forceMount?: boolean;
}

/**
 * A visual indicator rendered when the radio button is in a checked state.
 */
export const RadioIndicator = createPolymorphicComponent<"div", RadioIndicatorProps>(props => {
  const context = useRadioContext();

  props = mergeDefaultProps({ as: "div" }, props);

  const [local, others] = splitProps(props, ["as", "forceMount"]);

  return (
    <Show when={local.forceMount || context.isSelected()}>
      <Dynamic component={local.as} data-part="indicator" {...context.dataset()} {...others} />
    </Show>
  );
});
