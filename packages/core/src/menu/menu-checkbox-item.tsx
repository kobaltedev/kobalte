import { mergeDefaultProps, OverrideComponentProps } from "@kobalte/utils";
import { splitProps } from "solid-js";

import { createToggleState } from "../primitives";
import { MenuItemBase, MenuItemBaseOptions } from "./menu-item-base";

export interface MenuCheckboxItemOptions extends Omit<MenuItemBaseOptions, "checked"> {
  /** The controlled checked state of the menu item checkbox. */
  checked?: boolean;

  /**
   * The default checked state when initially rendered.
   * Useful when you do not need to control the checked state.
   */
  defaultChecked?: boolean;

  /** Event handler called when the checked state of the menu item checkbox changes. */
  onChange?: (isChecked: boolean) => void;
}

export interface MenuCheckboxItemProps
  extends OverrideComponentProps<"div", MenuCheckboxItemOptions> {}

/**
 * An item that can be controlled and rendered like a checkbox.
 */
export function MenuCheckboxItem(props: MenuCheckboxItemProps) {
  props = mergeDefaultProps(
    {
      closeOnSelect: false,
    },
    props
  );

  const [local, others] = splitProps(props, ["checked", "defaultChecked", "onChange", "onSelect"]);

  const state = createToggleState({
    isSelected: () => local.checked,
    defaultIsSelected: () => local.defaultChecked,
    onSelectedChange: checked => local.onChange?.(checked),
    isDisabled: () => others.disabled,
  });

  const onSelect = () => {
    local.onSelect?.();
    state.toggle();
  };

  return (
    <MenuItemBase
      role="menuitemcheckbox"
      checked={state.isSelected()}
      onSelect={onSelect}
      {...others}
    />
  );
}
