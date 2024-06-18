import { mergeDefaultProps } from "@kobalte/utils";
import type { JSX, ValidComponent } from "solid-js";

import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";
import { type MenuDataSet, useMenuContext } from "./menu-context";

export interface MenuIconOptions {}

export interface MenuIconCommonProps<T extends HTMLElement = HTMLElement> {
	children: JSX.Element;
}

export interface MenuIconRenderProps extends MenuIconCommonProps, MenuDataSet {
	"aria-hidden": "true";
}

export type MenuIconProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = MenuIconOptions & Partial<MenuIconCommonProps<ElementOf<T>>>;

/**
 * A small icon often displayed inside the menu trigger as a visual affordance for the fact it can be open.
 * It renders a `▼` by default, but you can use your own icon by providing a `children`.
 */
export function MenuIcon<T extends ValidComponent = "span">(
	props: PolymorphicProps<T, MenuIconProps<T>>,
) {
	const context = useMenuContext();

	const mergedProps = mergeDefaultProps(
		{ children: "▼" },
		props as MenuIconProps,
	);

	return (
		<Polymorphic<MenuIconRenderProps>
			as="span"
			aria-hidden="true"
			{...context.dataset()}
			{...mergedProps}
		/>
	);
}
