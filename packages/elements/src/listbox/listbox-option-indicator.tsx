import { createPolymorphicComponent, mergeDefaultProps } from "@kobalte/utils";
import { Show, splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

import { useListboxOptionContext } from "./listbox-option-context";

export interface ListboxOptionIndicatorProps {
  /**
   * Used to force mounting when more control is needed.
   * Useful when controlling animation with SolidJS animation libraries.
   */
  forceMount?: boolean;
}

/**
 * The visual indicator rendered when the option is selected.
 */
export const ListboxOptionIndicator = createPolymorphicComponent<
  "div",
  ListboxOptionIndicatorProps
>(props => {
  const context = useListboxOptionContext();

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
