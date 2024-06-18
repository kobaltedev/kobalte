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
import {
	type ListboxItemDataSet,
	useListboxItemContext,
} from "./listbox-item-context";

export interface ListboxItemLabelOptions {}

export interface ListboxItemLabelCommonProps<
	T extends HTMLElement = HTMLElement,
> {
	id: string;
}

export interface ListboxItemLabelRenderProps
	extends ListboxItemLabelCommonProps,
		ListboxItemDataSet {}

export type ListboxItemLabelProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = ListboxItemLabelOptions &
	Partial<ListboxItemLabelCommonProps<ElementOf<T>>>;

/**
 * An accessible label to be announced for the item.
 * Useful for items that have more complex content (e.g. icons, multiple lines of text, etc.)
 */
export function ListboxItemLabel<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, ListboxItemLabelProps<T>>,
) {
	const context = useListboxItemContext();

	const mergedProps = mergeDefaultProps(
		{
			id: context.generateId("label"),
		},
		props as ListboxItemLabelProps,
	);

	createEffect(() => onCleanup(context.registerLabelId(mergedProps.id)));

	return (
		<Polymorphic<ListboxItemLabelRenderProps>
			as="div"
			{...context.dataset()}
			{...mergedProps}
		/>
	);
}
