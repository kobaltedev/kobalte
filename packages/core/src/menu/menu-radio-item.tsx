import { mergeDefaultProps, OverrideComponentProps } from "@kobalte/utils";
import { splitProps } from "solid-js";

import { MenuItemBase, MenuItemBaseOptions } from "./menu-item-base";
import { useMenuRadioGroupContext } from "./menu-radio-group-context";

export interface MenuRadioItemOptions
  extends Omit<MenuItemBaseOptions, "checked" | "indeterminate"> {
  /** The value of the menu item radio. */
  value: string;
}

export interface MenuRadioItemProps extends OverrideComponentProps<"div", MenuRadioItemOptions> {}

/**
 * An item that can be controlled and rendered like a radio.
 */
export function MenuRadioItem(props: MenuRadioItemProps) {
  const context = useMenuRadioGroupContext();

  props = mergeDefaultProps({ closeOnSelect: false }, props);

  const [local, others] = splitProps(props, ["value", "onSelect"]);

  const onSelect = () => {
    local.onSelect?.();
    context.setSelectedValue(local.value);
  };

  return (
    <MenuItemBase
      role="menuitemradio"
      checked={context.isSelectedValue(local.value)}
      onSelect={onSelect}
      {...others}
    />
  );
}
