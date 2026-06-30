import { mergeDefaultProps, visuallyHiddenStyles } from "@kobalte/utils";
import { combineStyle } from "@solid-primitives/props";
import type { JSX, ValidComponent } from "@solidjs/web";
import { createEffect, omit } from "solid-js";
import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";
import {
	type RatingGroupItemDataSet,
	useRatingGroupItemContext,
} from "./rating-group-item-context";

export interface RatingGroupItemLabelOptions {}

export interface RatingGroupItemLabelCommonProps<
	T extends HTMLElement = HTMLElement,
> {
	id: string;
	style: JSX.CSSProperties | string;
}

export interface RatingGroupItemLabelRenderProps
	extends RatingGroupItemLabelCommonProps,
		RatingGroupItemDataSet {
	for: string | undefined;
}

export type RatingGroupItemLabelProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = RatingGroupItemLabelOptions &
	Partial<RatingGroupItemLabelCommonProps<ElementOf<T>>>;

export function RatingGroupItemLabel<T extends ValidComponent = "label">(
	props: PolymorphicProps<T, RatingGroupItemLabelProps<T>>,
) {
	const context = useRatingGroupItemContext();

	const mergedProps = mergeDefaultProps(
		{
			id: context.generateId("label"),
		},
		props as RatingGroupItemLabelProps,
	);

	const others = omit(mergedProps, "style");

	createEffect(
		() => others.id,
		(id) => context.registerLabel(id!),
	);

	return (
		<Polymorphic<RatingGroupItemLabelRenderProps>
			as="label"
			for={context.itemId()}
			style={combineStyle(visuallyHiddenStyles, mergedProps.style)}
			{...context.dataset()}
			{...others}
		/>
	);
}
