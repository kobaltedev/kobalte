import { OverrideComponentProps, mergeDefaultProps } from "@kobalte/utils";
import { type Component, type ValidComponent, splitProps } from "solid-js";
import type { ElementOf, PolymorphicProps } from "../polymorphic";

import { createToggleState } from "../primitives";
import {
	MenuItemBase,
	type MenuItemBaseCommonProps,
	type MenuItemBaseOptions,
	type MenuItemBaseRenderProps,
} from "./menu-item-base";

export interface MenuCheckboxItemOptions
	extends Omit<MenuItemBaseOptions, "checked"> {
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

export interface MenuCheckboxItemCommonProps<
	T extends HTMLElement = HTMLElement,
> extends MenuItemBaseCommonProps<T> {}

export interface MenuCheckboxItemRenderProps
	extends MenuCheckboxItemCommonProps,
		MenuItemBaseRenderProps {
	role: "menuitemcheckbox";
}

export type MenuCheckboxItemProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = MenuCheckboxItemOptions &
	Partial<MenuCheckboxItemCommonProps<ElementOf<T>>>;

/**
 * An item that can be controlled and rendered like a checkbox.
 */
export function MenuCheckboxItem<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, MenuCheckboxItemProps<T>>,
) {
	const mergedProps = mergeDefaultProps(
		{
			closeOnSelect: false,
		},
		props as MenuCheckboxItemProps,
	);

	const [local, others] = splitProps(mergedProps, [
		"checked",
		"defaultChecked",
		"onChange",
		"onSelect",
	]);

	const state = createToggleState({
		isSelected: () => local.checked,
		defaultIsSelected: () => local.defaultChecked,
		onSelectedChange: (checked) => local.onChange?.(checked),
		isDisabled: () => others.disabled,
	});

	const onSelect = () => {
		local.onSelect?.();
		state.toggle();
	};

	return (
		<MenuItemBase<
			Component<
				Omit<MenuCheckboxItemRenderProps, keyof MenuItemBaseRenderProps>
			>
		>
			role="menuitemcheckbox"
			checked={state.isSelected()}
			onSelect={onSelect}
			{...others}
		/>
	);
}
