import { OverrideComponentProps, mergeDefaultProps } from "@kobalte/utils";
import { type Component, type ValidComponent, splitProps } from "solid-js";
import type { ElementOf, PolymorphicProps } from "../polymorphic";

import {
	MenuItemBase,
	type MenuItemBaseCommonProps,
	type MenuItemBaseOptions,
	type MenuItemBaseRenderProps,
} from "./menu-item-base";
import { useMenuRadioGroupContext } from "./menu-radio-group-context";

export interface MenuRadioItemOptions<TValue = string>
	extends Omit<MenuItemBaseOptions, "checked" | "indeterminate"> {
	/** The value of the menu item radio. */
	value: TValue;
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
	TValue = string,
> = MenuRadioItemOptions<TValue> &
	Partial<MenuRadioItemCommonProps<ElementOf<T>>>;

/**
 * An item that can be controlled and rendered like a radio.
 */
export function MenuRadioItem<
	TValue = string,
	T extends ValidComponent = "div",
>(props: PolymorphicProps<T, MenuRadioItemProps<T, TValue>>) {
	const context = useMenuRadioGroupContext<TValue>();

	const mergedProps = mergeDefaultProps(
		{ closeOnSelect: false },
		props as MenuRadioItemProps<T, TValue>,
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
