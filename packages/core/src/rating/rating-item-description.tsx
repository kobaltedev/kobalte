import type { ValidComponent } from "@solidjs/web";
import { createEffect, merge } from "solid-js";

import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic/index.tsx";
import {
	type RatingItemDataSet,
	useRatingItemContext,
} from "./rating-item-context.tsx";

export interface RatingItemDescriptionOptions {}

export interface RatingItemDescriptionCommonProps<
	_T extends HTMLElement = HTMLElement,
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

	const mergedProps = merge(
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
