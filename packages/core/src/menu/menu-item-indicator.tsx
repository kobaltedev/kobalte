import { createPolymorphicComponent, mergeDefaultProps } from "@kobalte/utils";
import { Show, splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

import { useMenuItemContext } from "./menu-item.context";

export interface MenuItemIndicatorOptions {
  /**
   * Used to force mounting when more control is needed.
   * Useful when controlling animation with SolidJS animation libraries.
   */
  forceMount?: boolean;
}

/**
 * The visual indicator rendered when the parent menu `CheckboxItem` or `RadioItem` is checked.
 * You can style this element directly, or you can use it as a wrapper to put an icon into, or both.
 */
export const MenuItemIndicator = /*#__PURE__*/ createPolymorphicComponent<
  "div",
  MenuItemIndicatorOptions
>(props => {
  const context = useMenuItemContext();

  props = mergeDefaultProps(
    {
      as: "div",
      id: context.generateId("indicator"),
    },
    props
  );

  const [local, others] = splitProps(props, ["as", "forceMount"]);

  return (
    <Show when={local.forceMount || context.isChecked()}>
      <Dynamic component={local.as} {...context.dataset()} {...others} />
    </Show>
  );
});
