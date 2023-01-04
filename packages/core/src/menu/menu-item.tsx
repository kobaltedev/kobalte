import { createPolymorphicComponent, mergeDefaultProps } from "@kobalte/utils";

import { MenuItemBase, MenuItemBaseProps } from "./menu-item-base";
import { useMenuRootContext } from "./menu-root-context";

export interface MenuItemProps
  extends Omit<MenuItemBaseProps, "isChecked" | "isIndeterminate" | "onAction"> {}

/**
 * An item of the menu.
 */
export const MenuItem = createPolymorphicComponent<"div", MenuItemProps>(props => {
  const rootContext = useMenuRootContext();

  props = mergeDefaultProps(
    {
      as: "div",
      closeOnSelect: true,
    },
    props
  );

  return <MenuItemBase role="menuitem" onAction={rootContext.onAction} {...props} />;
});
