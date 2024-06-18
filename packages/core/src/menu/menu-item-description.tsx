/*
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/b35d5c02fe900badccd0cf1a8f23bb593419f238/packages/@react-aria/listbox/src/useOption.ts
 */

import { mergeDefaultProps } from "@kobalte/utils";
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

export interface MenuItemDescriptionOptions {}

export interface MenuItemDescriptionCommonProps<
	T extends HTMLElement = HTMLElement,
> {
	id: string;
}

export interface MenuItemDescriptionRenderProps
	extends MenuItemDescriptionCommonProps,
		MenuItemDataSet {}

export type MenuItemDescriptionProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = MenuItemDescriptionOptions &
	Partial<MenuItemDescriptionCommonProps<ElementOf<T>>>;

/**
 * An optional accessible description to be announced for the menu item.
 * Useful for menu items that have more complex content (e.g. icons, multiple lines of text, etc.)
 */
export function MenuItemDescription<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, MenuItemDescriptionProps<T>>,
) {
	const context = useMenuItemContext();

	const mergedProps = mergeDefaultProps(
		{
			id: context.generateId("description"),
		},
		props as MenuItemDescriptionProps,
	);

	const [local, others] = splitProps(mergedProps, ["id"]);

	createEffect(() => onCleanup(context.registerDescription(local.id)));

	return (
		<Polymorphic<MenuItemDescriptionRenderProps>
			as="div"
			id={local.id}
			{...context.dataset()}
			{...others}
		/>
	);
}
