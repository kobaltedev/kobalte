import { mergeDefaultProps, OverrideComponentProps } from "@kobalte/utils";
import { splitProps } from "solid-js";

import { MenuItemBase, MenuItemBaseOptions } from "./menu-item-base";
import { useMenuRadioGroupContext } from "./menu-radio-group-context";

export interface MenuRadioItemOptions
  extends Omit<MenuItemBaseOptions, "isChecked" | "isIndeterminate"> {
  /** The value of the menu item radio. */
  value: string;
}

/**
 * An item that can be controlled and rendered like a radio.
 */
export function MenuRadioItem(props: OverrideComponentProps<"div", MenuRadioItemOptions>) {
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
      isChecked={context.isSelectedValue(local.value)}
      onSelect={onSelect}
      {...others}
    />
  );
}
