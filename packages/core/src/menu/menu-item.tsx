import { Component, ValidComponent } from "solid-js";
import { PolymorphicProps } from "../polymorphic";

import {
	MenuItemBase,
	MenuItemBaseCommonProps,
	MenuItemBaseOptions,
	MenuItemBaseRenderProps,
} from "./menu-item-base";

export interface MenuItemOptions
	extends Omit<MenuItemBaseOptions, "checked" | "indeterminate"> {}

export interface MenuItemCommonProps extends MenuItemBaseCommonProps {}

export interface MenuItemRenderProps
	extends MenuItemCommonProps,
		MenuItemBaseRenderProps {
	role: "menuitem";
}

export type MenuItemProps = MenuItemOptions & Partial<MenuItemCommonProps>;

/**
 * An item of the menu.
 */
export function MenuItem<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, MenuItemProps>,
) {
	return (
		<MenuItemBase<
			Component<Omit<MenuItemRenderProps, keyof MenuItemBaseRenderProps>>
		>
			role="menuitem"
			closeOnSelect
			{...(props as MenuItemProps)}
		/>
	);
}
