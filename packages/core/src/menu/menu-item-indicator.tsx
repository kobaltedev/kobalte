import { OverrideComponentProps, mergeDefaultProps } from "@kobalte/utils";
import { Show, type ValidComponent, splitProps } from "solid-js";

import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";
import { type MenuItemDataSet, useMenuItemContext } from "./menu-item.context";

export interface MenuItemIndicatorOptions {
	/**
	 * Used to force mounting when more control is needed.
	 * Useful when controlling animation with SolidJS animation libraries.
	 */
	forceMount?: boolean;
}

export interface MenuItemIndicatorCommonProps<
	T extends HTMLElement = HTMLElement,
> {
	id: string;
}

export interface MenuItemIndicatorRenderProps
	extends MenuItemIndicatorCommonProps,
		MenuItemDataSet {}

export type MenuItemIndicatorProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = MenuItemIndicatorOptions &
	Partial<MenuItemIndicatorCommonProps<ElementOf<T>>>;

/**
 * The visual indicator rendered when the parent menu `CheckboxItem` or `RadioItem` is checked.
 * You can style this element directly, or you can use it as a wrapper to put an icon into, or both.
 */
export function MenuItemIndicator<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, MenuItemIndicatorProps<T>>,
) {
	const context = useMenuItemContext();

	const mergedProps = mergeDefaultProps(
		{
			id: context.generateId("indicator"),
		},
		props as MenuItemIndicatorProps,
	);

	const [local, others] = splitProps(mergedProps, ["forceMount"]);

	return (
		<Show when={local.forceMount || context.isChecked()}>
			<Polymorphic<MenuItemIndicatorRenderProps>
				as="div"
				{...context.dataset()}
				{...others}
			/>
		</Show>
	);
}
