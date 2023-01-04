import { createPolymorphicComponent, mergeDefaultProps } from "@kobalte/utils";
import { splitProps } from "solid-js";

import { MenuItemBase, MenuItemBaseProps } from "./menu-item-base";
import { useMenuRadioGroupContext } from "./menu-radio-group-context";

export interface MenuRadioItemProps
  extends Omit<MenuItemBaseProps, "isChecked" | "isIndeterminate"> {
  /** The value of the menu item radio. */
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

  const [local, others] = splitProps(props, ["value", "onSelect"]);

  const onSelect = () => {
    local.onSelect?.();
    context.setSelectedValue(local.value);
  };

  return (
    <MenuItemBase
      role="menuitemradio"
      isChecked={context.isSelectedValue(local.value)}
      onSelect={onSelect}
      {...others}
    />
  );
});
