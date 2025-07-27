import type { Component, ValidComponent } from "solid-js";

import { FormControlLabel } from "../form-control";
import type { ElementOf, PolymorphicProps } from "../polymorphic";

export interface RatingLabelOptions {}

export interface RatingLabelCommonProps<
	T extends HTMLElement = HTMLElement,
> {}

export interface RatingLabelRenderProps
	extends RatingLabelCommonProps {}

export type RatingLabelProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = RatingLabelOptions &
	Partial<RatingLabelCommonProps<ElementOf<T>>>;

export function RatingLabel<T extends ValidComponent = "span">(
	props: PolymorphicProps<T, RatingLabelProps<T>>,
) {
	return (
		<FormControlLabel<Component<RatingLabelRenderProps>>
			as="span"
			{...(props as RatingLabelProps)}
		/>
	);
}
