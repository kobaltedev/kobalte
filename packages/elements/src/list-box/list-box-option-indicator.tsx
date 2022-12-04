import { createPolymorphicComponent, mergeDefaultProps } from "@kobalte/utils";
import { Show, splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

import { useListBoxOptionContext } from "./list-box-option-context";

export interface ListBoxOptionIndicatorProps {
  /**
   * Used to force mounting when more control is needed.
   * Useful when controlling animation with SolidJS animation libraries.
   */
  forceMount?: boolean;
}

/**
 * The visual indicator rendered when the option is selected.
 */
export const ListBoxOptionIndicator = createPolymorphicComponent<
  "div",
  ListBoxOptionIndicatorProps
>(props => {
  const context = useListBoxOptionContext();

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
