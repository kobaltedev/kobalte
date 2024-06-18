/*
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/b35d5c02fe900badccd0cf1a8f23bb593419f238/packages/@react-aria/listbox/src/useOption.ts
 */

import { mergeDefaultProps, mergeRefs } from "@kobalte/utils";
import {
	type ValidComponent,
	createEffect,
	onCleanup,
	splitProps,
} from "solid-js";

import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";
import { type MenuItemDataSet, useMenuItemContext } from "./menu-item.context";

export interface MenuItemLabelOptions {}

export interface MenuItemLabelCommonProps<T extends HTMLElement = HTMLElement> {
	id: string;
	ref: T | ((el: T) => void);
}

export interface MenuItemLabelRenderProps
	extends MenuItemLabelCommonProps,
		MenuItemDataSet {}

export type MenuItemLabelProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = MenuItemLabelOptions & Partial<MenuItemLabelCommonProps<ElementOf<T>>>;

/**
 * An accessible label to be announced for the menu item.
 * Useful for menu items that have more complex content (e.g. icons, multiple lines of text, etc.)
 */
export function MenuItemLabel<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, MenuItemLabelProps<T>>,
) {
	const context = useMenuItemContext();

	const mergedProps = mergeDefaultProps(
		{
			id: context.generateId("label"),
		},
		props as MenuItemLabelProps,
	);

	const [local, others] = splitProps(mergedProps, ["ref", "id"]);

	createEffect(() => onCleanup(context.registerLabel(local.id)));

	return (
		<Polymorphic<MenuItemLabelRenderProps>
			as="div"
			ref={mergeRefs(context.setLabelRef, local.ref)}
			id={local.id}
			{...context.dataset()}
			{...others}
		/>
	);
}
