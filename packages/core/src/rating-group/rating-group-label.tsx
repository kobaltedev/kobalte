/*
 * Portions of this file are based on code from chakra-ui/zag
 * MIT Licensed, Copyright (c) 2019 Segun Adebayo.
 *
 * Credits to the Chakra UI team:
 * https://github.com/chakra-ui/zag/tree/main/packages/machines/rating-group
 */

import {
	type Component,
	type ValidComponent,
	createEffect,
	onCleanup,
} from "solid-js";

import { mergeDefaultProps } from "@kobalte/utils";
import { FormControlLabel } from "../form-control";
import type { ElementOf, PolymorphicProps } from "../polymorphic";
import { useRatingGroupContext } from "./rating-group-context";

export interface RatingGroupLabelOptions {}

export interface RatingGroupLabelCommonProps<
	T extends HTMLElement = HTMLElement,
> {}

export interface RatingGroupLabelRenderProps
	extends RatingGroupLabelCommonProps {}

export type RatingGroupLabelProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = RatingGroupLabelOptions &
	Partial<RatingGroupLabelCommonProps<ElementOf<T>>>;

/**
 * The label that gives the user information on the rating group.
 */
export function RatingGroupLabel<T extends ValidComponent = "span">(
	props: PolymorphicProps<T, RatingGroupLabelProps<T>>,
) {
	return (
		<FormControlLabel<Component<RatingGroupLabelRenderProps>>
			as="span"
			{...(props as RatingGroupLabelProps)}
		/>
	);
}
