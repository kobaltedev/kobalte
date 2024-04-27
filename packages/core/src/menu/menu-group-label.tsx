/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/e6808d1b5e80cef7af7e63974f658043593b2e1e/packages/@react-aria/menu/src/useMenuSection.ts
 */

import { mergeDefaultProps } from "@kobalte/utils";
import { createEffect, onCleanup, splitProps, ValidComponent } from "solid-js";

import { Polymorphic, PolymorphicProps } from "../polymorphic";
import { useMenuGroupContext } from "./menu-group-context";

export interface MenuGroupLabelOptions {
}

export interface MenuGroupLabelCommonProps {
	id: string;
}

export interface MenuGroupLabelRenderProps extends MenuGroupLabelCommonProps {
	"aria-hidden": "true";
}

export type MenuGroupLabelProps = MenuGroupLabelOptions & Partial<MenuGroupLabelCommonProps>;

/**
 * A component used to render the label of a `Menu.Group`.
 * It won't be focusable using arrow keys.
 */
export function MenuGroupLabel<T extends ValidComponent = "span">(props: PolymorphicProps<T, MenuGroupLabelProps>) {
	const context = useMenuGroupContext();

	const mergedProps = mergeDefaultProps(
		{
			id: context.generateId("label"),
		},
		props as MenuGroupLabelProps,
	);

	const [local, others] = splitProps(mergedProps, ["id"]);

	createEffect(() => onCleanup(context.registerLabelId(local.id!)));

	return <Polymorphic<MenuGroupLabelRenderProps> as="span" id={local.id} aria-hidden="true" {...others} />;
}
