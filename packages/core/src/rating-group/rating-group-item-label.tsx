/*
 * Portions of this file are based on code from chakra-ui/zag
 * MIT Licensed, Copyright (c) 2019 Segun Adebayo.
 *
 * Credits to the Chakra UI team:
 * https://github.com/chakra-ui/zag/tree/main/packages/machines/rating-group
 */

import { mergeDefaultProps, visuallyHiddenStyles } from "@kobalte/utils";
import { combineStyle } from "@solid-primitives/props";
import {
	type JSX,
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

	const [local, others] = splitProps(mergedProps, ["style"]);

	createEffect(() => onCleanup(context.registerLabel(others.id!)));

	return (
		<Polymorphic<RatingGroupItemLabelRenderProps>
			as="label"
			for={context.itemId()}
			style={combineStyle(visuallyHiddenStyles, local.style)}
			{...context.dataset()}
			{...others}
		/>
	);
}
