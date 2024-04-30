import { OverrideComponentProps, mergeDefaultProps } from "@kobalte/utils";
import { Component, ValidComponent, splitProps } from "solid-js";
import { PolymorphicProps } from "../polymorphic";

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

export interface MenuRadioItemCommonProps extends MenuItemBaseCommonProps {}

export interface MenuRadioItemRenderProps
	extends MenuRadioItemCommonProps,
		MenuItemBaseRenderProps {
	role: "menuitemradio";
}

export type MenuRadioItemProps = MenuRadioItemOptions &
	Partial<MenuRadioItemCommonProps>;

/**
 * An item that can be controlled and rendered like a radio.
 */
export function MenuRadioItem<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, MenuRadioItemProps>,
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
