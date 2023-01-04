import { createPolymorphicComponent, mergeDefaultProps } from "@kobalte/utils";

import { MenuItemBase, MenuItemBaseOptions } from "./menu-item-base";

export interface MenuItemOptions
  extends Omit<MenuItemBaseOptions, "isChecked" | "isIndeterminate"> {}

/**
 * An item of the menu.
 */
export const MenuItem = createPolymorphicComponent<"div", MenuItemOptions>(props => {
  props = mergeDefaultProps(
    {
      as: "div",
      closeOnSelect: true,
    },
    props
  );

  return <MenuItemBase role="menuitem" {...props} />;
});
