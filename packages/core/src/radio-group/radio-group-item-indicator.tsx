import { createPolymorphicComponent, mergeDefaultProps } from "@kobalte/utils";
import { Show, splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

import { useRadioGroupItemContext } from "./radio-group-item-context";

export interface RadioGroupItemIndicatorProps {
  /**
   * Used to force mounting when more control is needed.
   * Useful when controlling animation with SolidJS animation libraries.
   */
  forceMount?: boolean;
}

/**
 * The visual indicator rendered when the radio button is in a checked state.
 */
export const RadioGroupItemIndicator = createPolymorphicComponent<
  "div",
  RadioGroupItemIndicatorProps
>(props => {
  const context = useRadioGroupItemContext();

  props = mergeDefaultProps(
    {
      as: "div",
      id: context.generateId("indicator"),
    },
    props
  );

  const [local, others] = splitProps(props, ["as", "forceMount"]);

  return (
    <Show when={local.forceMount || context.isSelected()}>
      <Dynamic component={local.as} {...context.dataset()} {...others} />
    </Show>
  );
});
