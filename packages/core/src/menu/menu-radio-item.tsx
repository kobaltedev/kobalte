import { createPolymorphicComponent, mergeDefaultProps } from "@kobalte/utils";
import { splitProps } from "solid-js";

import { MenuItemBase, MenuItemBaseProps } from "./menu-item-base";
import { useMenuRadioGroupContext } from "./menu-radio-group-context";

export interface MenuRadioItemProps
  extends Omit<MenuItemBaseProps, "key" | "isChecked" | "isIndeterminate" | "onAction"> {
  /**
   * The value of the menu item radio.
   * It also acts as a unique key for the item radio in its parent `Menu`.
   */
  value: string;
}

/**
 * An item that can be controlled and rendered like a radio.
 */
export const MenuRadioItem = createPolymorphicComponent<"div", MenuRadioItemProps>(props => {
  const context = useMenuRadioGroupContext();

  props = mergeDefaultProps(
    {
      as: "div",
      closeOnSelect: false,
    },
    props
  );

  const [local, others] = splitProps(props, ["value"]);

  return (
    <MenuItemBase
      role="menuitemradio"
      key={local.value}
      isChecked={context.isSelectedValue(local.value)}
      onAction={context.setSelectedValue}
      {...others}
    />
  );
});
