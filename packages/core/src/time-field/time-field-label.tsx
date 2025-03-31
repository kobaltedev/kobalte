import type { Component, ValidComponent } from "solid-js";

import { FormControlLabel } from "../form-control";
import type { ElementOf, PolymorphicProps } from "../polymorphic";

export interface TimeFieldLabelOptions {}

export interface TimeFieldLabelCommonProps<
	T extends HTMLElement = HTMLElement,
> {}

export interface TimeFieldLabelRenderProps extends TimeFieldLabelCommonProps {}

export type TimeFieldLabelProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = TimeFieldLabelOptions & Partial<TimeFieldLabelCommonProps<ElementOf<T>>>;

export function TimeFieldLabel<T extends ValidComponent = "span">(
	props: PolymorphicProps<T, TimeFieldLabelProps<T>>,
) {
	return (
		<FormControlLabel<Component<TimeFieldLabelRenderProps>>
			as="span"
			{...(props as TimeFieldLabelProps)}
		/>
	);
}
