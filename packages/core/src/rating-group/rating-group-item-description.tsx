/*
 * Portions of this file are based on code from chakra-ui/zag
 * MIT Licensed, Copyright (c) 2019 Segun Adebayo.
 *
 * Credits to the Chakra UI team:
 * https://github.com/chakra-ui/zag/tree/main/packages/machines/rating-group
 */

import { mergeDefaultProps } from "@kobalte/utils";
import { type ValidComponent, createEffect, onCleanup } from "solid-js";

import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";
import {
	type RatingGroupItemDataSet,
	useRatingGroupItemContext,
} from "./rating-group-item-context";

export interface RatingGroupItemDescriptionOptions {}

export interface RatingGroupItemDescriptionCommonProps<
	T extends HTMLElement = HTMLElement,
> {
	id: string;
}

export interface RatingGroupItemDescriptionRenderProps
	extends RatingGroupItemDescriptionCommonProps,
		RatingGroupItemDataSet {}

export type RatingGroupItemDescriptionProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = RatingGroupItemDescriptionOptions &
	Partial<RatingGroupItemDescriptionCommonProps<ElementOf<T>>>;

export function RatingGroupItemDescription<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, RatingGroupItemDescriptionProps<T>>,
) {
	const context = useRatingGroupItemContext();

	const mergedProps = mergeDefaultProps(
		{
			id: context.generateId("description"),
		},
		props as RatingGroupItemDescriptionProps,
	);

	createEffect(() => onCleanup(context.registerDescription(mergedProps.id)));

	return (
		<Polymorphic<RatingGroupItemDescriptionRenderProps>
			as="div"
			{...context.dataset()}
			{...mergedProps}
		/>
	);
}
