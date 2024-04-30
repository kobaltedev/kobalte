import { Component, ValidComponent } from "solid-js";

import { FormControlLabel } from "../form-control";
import { PolymorphicProps } from "../polymorphic";

export interface RadioGroupLabelOptions {}

export interface RadioGroupLabelCommonProps {}

export interface RadioGroupLabelRenderProps
	extends RadioGroupLabelCommonProps {}

export type RadioGroupLabelProps = RadioGroupLabelOptions &
	Partial<RadioGroupLabelCommonProps>;

/**
 * The label that gives the user information on the radio group.
 */
export function RadioGroupLabel<T extends ValidComponent = "span">(
	props: PolymorphicProps<T, RadioGroupLabelProps>,
) {
	return (
		<FormControlLabel<Component<RadioGroupLabelRenderProps>>
			as="span"
			{...(props as RadioGroupLabelProps)}
		/>
	);
}
