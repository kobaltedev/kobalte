import { OverrideComponentProps } from "@kobalte/utils";

import { MenuItemBase, MenuItemBaseOptions } from "./menu-item-base";

export interface MenuItemOptions
  extends Omit<MenuItemBaseOptions, "isChecked" | "isIndeterminate"> {}

/**
 * An item of the menu.
 */
export function MenuItem(props: OverrideComponentProps<"div", MenuItemOptions>) {
  return <MenuItemBase role="menuitem" closeOnSelect {...props} />;
}
