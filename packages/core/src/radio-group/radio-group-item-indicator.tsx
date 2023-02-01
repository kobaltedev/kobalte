import { createPolymorphicComponent, mergeDefaultProps, mergeRefs } from "@kobalte/utils";
import { Show, splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

import { useRadioGroupItemContext } from "./radio-group-item-context";
import { createPresence } from "../primitives";

export interface RadioGroupItemIndicatorOptions {
  /**
   * Used to force mounting when more control is needed.
   * Useful when controlling animation with SolidJS animation libraries.
   */
  forceMount?: boolean;
}

/**
 * The visual indicator rendered when the radio item is in a checked state.
 * You can style this element directly, or you can use it as a wrapper to put an icon into, or both.
 */
export const RadioGroupItemIndicator = createPolymorphicComponent<
  "div",
  RadioGroupItemIndicatorOptions
>(props => {
  const context = useRadioGroupItemContext();

  props = mergeDefaultProps(
    {
      as: "div",
      id: context.generateId("indicator"),
    },
    props
  );

  const [local, others] = splitProps(props, ["as", "ref", "forceMount"]);

  const presence = createPresence(() => local.forceMount || context.isSelected());

  return (
    <Show when={presence.isPresent()}>
      <Dynamic
        component={local.as}
        ref={mergeRefs(presence.setRef, local.ref)}
        {...context.dataset()}
        {...others}
      />
    </Show>
  );
});
