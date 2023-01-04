import { createPolymorphicComponent, mergeDefaultProps } from "@kobalte/utils";

import { MenuItemBase, MenuItemBaseProps } from "./menu-item-base";

export interface MenuItemProps extends Omit<MenuItemBaseProps, "isChecked" | "isIndeterminate"> {}

/**
 * An item of the menu.
 */
export const MenuItem = createPolymorphicComponent<"div", MenuItemProps>(props => {
  props = mergeDefaultProps(
    {
      as: "div",
      closeOnSelect: true,
    },
    props
  );

  return <MenuItemBase role="menuitem" {...props} />;
});
