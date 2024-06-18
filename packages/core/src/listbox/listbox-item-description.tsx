/*
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/b35d5c02fe900badccd0cf1a8f23bb593419f238/packages/@react-aria/listbox/src/useOption.ts
 */

import { mergeDefaultProps } from "@kobalte/utils";
import { type ValidComponent, createEffect, onCleanup } from "solid-js";

import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";
import {
	type ListboxItemDataSet,
	useListboxItemContext,
} from "./listbox-item-context";

export interface ListboxItemDescriptionOptions {}

export interface ListboxItemDescriptionCommonProps<
	T extends HTMLElement = HTMLElement,
> {
	id: string;
}

export interface ListboxItemDescriptionRenderProps
	extends ListboxItemDescriptionCommonProps,
		ListboxItemDataSet {}

export type ListboxItemDescriptionProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = ListboxItemDescriptionOptions &
	Partial<ListboxItemDescriptionCommonProps<ElementOf<T>>>;

/**
 * An optional accessible description to be announced for the item.
 * Useful for items that have more complex content (e.g. icons, multiple lines of text, etc.)
 */
export function ListboxItemDescription<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, ListboxItemDescriptionProps<T>>,
) {
	const context = useListboxItemContext();

	const mergedProps = mergeDefaultProps(
		{
			id: context.generateId("description"),
		},
		props as ListboxItemDescriptionProps,
	);

	createEffect(() => onCleanup(context.registerDescriptionId(mergedProps.id)));

	return (
		<Polymorphic<ListboxItemDescriptionRenderProps>
			as="div"
			{...context.dataset()}
			{...mergedProps}
		/>
	);
}
