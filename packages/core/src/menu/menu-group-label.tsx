/*
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/e6808d1b5e80cef7af7e63974f658043593b2e1e/packages/@react-aria/menu/src/useMenuSection.ts
 */

import type { ValidComponent } from "@solidjs/web";
import { createEffect, merge, omit } from "solid-js";

import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic/index.tsx";
import { useMenuGroupContext } from "./menu-group-context.tsx";

export interface MenuGroupLabelOptions {}

export interface MenuGroupLabelCommonProps<
	_T extends HTMLElement = HTMLElement,
> {
	id: string;
}

export interface MenuGroupLabelRenderProps extends MenuGroupLabelCommonProps {
	"aria-hidden": "true";
}

export type MenuGroupLabelProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = MenuGroupLabelOptions & Partial<MenuGroupLabelCommonProps<ElementOf<T>>>;

/**
 * A component used to render the label of a `Menu.Group`.
 * It won't be focusable using arrow keys.
 */
export function MenuGroupLabel<T extends ValidComponent = "span">(
	props: PolymorphicProps<T, MenuGroupLabelProps<T>>,
) {
	const context = useMenuGroupContext();

	const mergedProps = merge(
		{
			id: context.generateId("label"),
		},
		props as MenuGroupLabelProps,
	);

	const others = omit(mergedProps, "id");

	createEffect(
		() => mergedProps.id!,
		(id) => context.registerLabelId(id),
	);

	return (
		<Polymorphic<MenuGroupLabelRenderProps>
			as="span"
			id={mergedProps.id}
			aria-hidden="true"
			{...others}
		/>
	);
}
