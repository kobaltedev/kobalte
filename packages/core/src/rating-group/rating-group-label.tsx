import type { Component, ValidComponent } from "solid-js";

import { FormControlLabel } from "../form-control";
import type { ElementOf, PolymorphicProps } from "../polymorphic";

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
