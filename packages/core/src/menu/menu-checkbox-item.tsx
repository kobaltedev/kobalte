import { createPolymorphicComponent, mergeDefaultProps } from "@kobalte/utils";
import { splitProps } from "solid-js";

import { createToggleState } from "../primitives";
import { MenuItemBase, MenuItemBaseProps } from "./menu-item-base";

export interface MenuCheckboxItemProps extends Omit<MenuItemBaseProps, "isChecked" | "onAction"> {
  /** The controlled checked state of the menu item checkbox. */
  isChecked?: boolean;

  /**
   * The default checked state when initially rendered.
   * Useful when you do not need to control the checked state.
   */
  defaultIsChecked?: boolean;

  /** Event handler called when the checked state of the menu item checkbox changes. */
  onCheckedChange?: (isChecked: boolean) => void;
}

/**
 * An item that can be controlled and rendered like a checkbox.
 */
export const MenuCheckboxItem = createPolymorphicComponent<"div", MenuCheckboxItemProps>(props => {
  props = mergeDefaultProps(
    {
      as: "div",
      closeOnSelect: false,
    },
    props
  );

  const [local, others] = splitProps(props, ["isChecked", "defaultIsChecked", "onCheckedChange"]);

  const state = createToggleState({
    isSelected: () => local.isChecked,
    defaultIsSelected: () => local.defaultIsChecked,
    onSelectedChange: checked => local.onCheckedChange?.(checked),
    isDisabled: () => others.isDisabled,
  });

  return (
    <MenuItemBase
      role="menuitemcheckbox"
      isChecked={state.isSelected()}
      onAction={state.toggle}
      {...others}
    />
  );
});
