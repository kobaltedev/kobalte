/*
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/e6808d1b5e80cef7af7e63974f658043593b2e1e/packages/@react-aria/menu/src/useMenuSection.ts
 */

import { createGenerateId, mergeDefaultProps } from "@kobalte/utils";
import { type ValidComponent, createSignal, createUniqueId } from "solid-js";

import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";
import { createRegisterId } from "../primitives";
import {
	MenuGroupContext,
	type MenuGroupContextValue,
} from "./menu-group-context";
import { useMenuRootContext } from "./menu-root-context";

export interface MenuGroupOptions {}

export interface MenuGroupCommonProps<T extends HTMLElement = HTMLElement> {
	id: string;
}

export interface MenuGroupRenderProps extends MenuGroupCommonProps {
	role: "group";
	"aria-labelledby": string | undefined;
}

export type MenuGroupProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = MenuGroupOptions & Partial<MenuGroupCommonProps<ElementOf<T>>>;

/**
 * A container used to group multiple `Menu.Item`s.
 */
export function MenuGroup<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, MenuGroupProps<T>>,
) {
	const rootContext = useMenuRootContext();

	const mergedProps = mergeDefaultProps(
		{
			id: rootContext.generateId(`group-${createUniqueId()}`),
		},
		props as MenuGroupProps,
	);

	const [labelId, setLabelId] = createSignal<string>();

	const context: MenuGroupContextValue = {
		generateId: createGenerateId(() => mergedProps.id!),
		registerLabelId: createRegisterId(setLabelId),
	};

	return (
		<MenuGroupContext.Provider value={context}>
			<Polymorphic<MenuGroupRenderProps>
				as="div"
				role="group"
				aria-labelledby={labelId()}
				{...mergedProps}
			/>
		</MenuGroupContext.Provider>
	);
}
