import type { Component, ValidComponent } from "solid-js";
import type { ElementOf, PolymorphicProps } from "../polymorphic";

import {
	MenuItemBase,
	type MenuItemBaseCommonProps,
	type MenuItemBaseOptions,
	type MenuItemBaseRenderProps,
} from "./menu-item-base";

export interface MenuItemOptions
	extends Omit<MenuItemBaseOptions, "checked" | "indeterminate"> {}

export interface MenuItemCommonProps<T extends HTMLElement = HTMLElement>
	extends MenuItemBaseCommonProps<T> {}

export interface MenuItemRenderProps
	extends MenuItemCommonProps,
		MenuItemBaseRenderProps {
	role: "menuitem";
}

export type MenuItemProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = MenuItemOptions & Partial<MenuItemCommonProps<ElementOf<T>>>;

/**
 * An item of the menu.
 */
export function MenuItem<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, MenuItemProps<T>>,
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
