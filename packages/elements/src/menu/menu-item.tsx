import { createPolymorphicComponent, mergeDefaultProps } from "@kobalte/utils";

import { useMenuContext } from "./menu-context";
import { MenuItemBase, MenuItemBaseProps } from "./menu-item-base";

export interface MenuItemProps
  extends Omit<MenuItemBaseProps, "isChecked" | "isIndeterminate" | "onAction"> {}

/**
 * An item of the menu.
 */
export const MenuItem = createPolymorphicComponent<"div", MenuItemProps>(props => {
  const context = useMenuContext();

  props = mergeDefaultProps(
    {
      as: "div",
      closeOnSelect: true,
    },
    props
  );

  return <MenuItemBase role="menuitem" onAction={context.onAction} {...props} />;
});
