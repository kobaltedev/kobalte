import { mergeDefaultProps, visuallyHiddenStyles } from "@kobalte/utils";
import { combineStyle } from "@solid-primitives/props";
import type { JSX, ValidComponent } from "@solidjs/web";
import { createEffect, omit } from "solid-js";
import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic/index.tsx";
import {
	type RatingItemDataSet,
	useRatingItemContext,
} from "./rating-item-context.tsx";

export interface RatingItemLabelOptions {}

export interface RatingItemLabelCommonProps<
	T extends HTMLElement = HTMLElement,
> {
	id: string;
	style: JSX.CSSProperties | string;
}

export interface RatingItemLabelRenderProps
	extends RatingItemLabelCommonProps,
		RatingItemDataSet {
	for: string | undefined;
}

export type RatingItemLabelProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = RatingItemLabelOptions & Partial<RatingItemLabelCommonProps<ElementOf<T>>>;

export function RatingItemLabel<T extends ValidComponent = "label">(
	props: PolymorphicProps<T, RatingItemLabelProps<T>>,
) {
	const context = useRatingItemContext();

	const mergedProps = mergeDefaultProps(
		{
			id: context.generateId("label"),
		},
		props as RatingItemLabelProps,
	);

	const others = omit(mergedProps, "style");

	createEffect(
		() => others.id,
		(id) => context.registerLabel(id!),
	);

	return (
		<Polymorphic<RatingItemLabelRenderProps>
			as="label"
			for={context.itemId()}
			style={combineStyle(visuallyHiddenStyles, mergedProps.style)}
			{...context.dataset()}
			{...others}
		/>
	);
}
