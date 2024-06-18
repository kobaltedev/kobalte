import type { Component, ValidComponent } from "solid-js";

import { FormControlLabel } from "../form-control";
import type { ElementOf, PolymorphicProps } from "../polymorphic";

export interface RadioGroupLabelOptions {}

export interface RadioGroupLabelCommonProps<
	T extends HTMLElement = HTMLElement,
> {}

export interface RadioGroupLabelRenderProps
	extends RadioGroupLabelCommonProps {}

export type RadioGroupLabelProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = RadioGroupLabelOptions & Partial<RadioGroupLabelCommonProps<ElementOf<T>>>;

/**
 * The label that gives the user information on the radio group.
 */
export function RadioGroupLabel<T extends ValidComponent = "span">(
	props: PolymorphicProps<T, RadioGroupLabelProps<T>>,
) {
	return (
		<FormControlLabel<Component<RadioGroupLabelRenderProps>>
			as="span"
			{...(props as RadioGroupLabelProps)}
		/>
	);
}
