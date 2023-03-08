import { OverrideComponentProps } from "@kobalte/utils";

import { MenuItemBase, MenuItemBaseOptions } from "./menu-item-base";

export interface MenuItemOptions
  extends Omit<MenuItemBaseOptions, "isChecked" | "isIndeterminate"> {}

export interface MenuItemProps extends OverrideComponentProps<"div", MenuItemOptions> {}

/**
 * An item of the menu.
 */
export function MenuItem(props: MenuItemProps) {
  return <MenuItemBase role="menuitem" closeOnSelect {...props} />;
}
