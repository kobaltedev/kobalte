import { OverrideComponentProps, mergeDefaultProps } from "@kobalte/utils";
import { Component, ValidComponent, splitProps } from "solid-js";
import { ElementOf, PolymorphicProps } from "../polymorphic";

import {
	MenuItemBase,
	MenuItemBaseCommonProps,
	MenuItemBaseOptions,
	MenuItemBaseRenderProps,
} from "./menu-item-base";
import { useMenuRadioGroupContext } from "./menu-radio-group-context";

export interface MenuRadioItemOptions
	extends Omit<MenuItemBaseOptions, "checked" | "indeterminate"> {
	/** The value of the menu item radio. */
	value: string;
}

export interface MenuRadioItemCommonProps<T extends HTMLElement = HTMLElement>
	extends MenuItemBaseCommonProps<T> {}

export interface MenuRadioItemRenderProps
	extends MenuRadioItemCommonProps,
		MenuItemBaseRenderProps {
	role: "menuitemradio";
}

export type MenuRadioItemProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = MenuRadioItemOptions & Partial<MenuRadioItemCommonProps<ElementOf<T>>>;

/**
 * An item that can be controlled and rendered like a radio.
 */
export function MenuRadioItem<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, MenuRadioItemProps<T>>,
) {
	const context = useMenuRadioGroupContext();

	const mergedProps = mergeDefaultProps(
		{ closeOnSelect: false },
		props as MenuRadioItemProps,
	);

	const [local, others] = splitProps(mergedProps, ["value", "onSelect"]);

	const onSelect = () => {
		local.onSelect?.();
		context.setSelectedValue(local.value);
	};

	return (
		<MenuItemBase<
			Component<Omit<MenuRadioItemRenderProps, keyof MenuItemBaseRenderProps>>
		>
			role="menuitemradio"
			checked={context.isSelectedValue(local.value)}
			onSelect={onSelect}
			{...others}
		/>
	);
}
