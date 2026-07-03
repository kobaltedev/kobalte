import { mergeDefaultProps } from "@kobalte/utils";
import type { ValidComponent } from "@solidjs/web";
import { createEffect } from "solid-js";

import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";
import {
	type RatingItemDataSet,
	useRatingItemContext,
} from "./rating-item-context";

export interface RatingItemDescriptionOptions {}

export interface RatingItemDescriptionCommonProps<
	T extends HTMLElement = HTMLElement,
> {
	id: string;
}

export interface RatingItemDescriptionRenderProps
	extends RatingItemDescriptionCommonProps,
		RatingItemDataSet {}

export type RatingItemDescriptionProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = RatingItemDescriptionOptions &
	Partial<RatingItemDescriptionCommonProps<ElementOf<T>>>;

export function RatingItemDescription<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, RatingItemDescriptionProps<T>>,
) {
	const context = useRatingItemContext();

	const mergedProps = mergeDefaultProps(
		{
			id: context.generateId("description"),
		},
		props as RatingItemDescriptionProps,
	);

	createEffect(
		() => mergedProps.id,
		(id) => context.registerDescription(id),
	);

	return (
		<Polymorphic<RatingItemDescriptionRenderProps>
			as="div"
			{...context.dataset()}
			{...mergedProps}
		/>
	);
}
