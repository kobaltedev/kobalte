import { createPolymorphicComponent, mergeDefaultProps } from "@kobalte/utils";
import { splitProps } from "solid-js";

import { createToggleState } from "../primitives";
import { MenuItemBase, MenuItemBaseProps } from "./menu-item-base";

export interface MenuCheckboxItemProps extends Omit<MenuItemBaseProps, "isChecked"> {
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

  const [local, others] = splitProps(props, [
    "isChecked",
    "defaultIsChecked",
    "onCheckedChange",
    "onSelect",
  ]);

  const state = createToggleState({
    isSelected: () => local.isChecked,
    defaultIsSelected: () => local.defaultIsChecked,
    onSelectedChange: checked => local.onCheckedChange?.(checked),
    isDisabled: () => others.isDisabled,
  });

  const onSelect = () => {
    local.onSelect?.();
    state.toggle();
  };

  return (
    <MenuItemBase
      role="menuitemcheckbox"
      isChecked={state.isSelected()}
      onSelect={onSelect}
      {...others}
    />
  );
});
