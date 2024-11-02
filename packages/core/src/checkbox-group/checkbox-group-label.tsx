import type { Component, ValidComponent } from "solid-js";

import { FormControlLabel } from "../form-control";
import type { ElementOf, PolymorphicProps } from "../polymorphic";

export interface CheckboxGroupLabelOptions {}

export interface CheckboxGroupLabelCommonProps<
	T extends HTMLElement = HTMLElement,
> {}

export interface CheckboxGroupLabelRenderProps
	extends CheckboxGroupLabelCommonProps {}

export type CheckboxGroupLabelProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = CheckboxGroupLabelOptions &
	Partial<CheckboxGroupLabelCommonProps<ElementOf<T>>>;

/**
 * The label that gives the user information on the Checkbox group.
 */
export function CheckboxGroupLabel<T extends ValidComponent = "span">(
	props: PolymorphicProps<T, CheckboxGroupLabelProps<T>>,
) {
	return (
		<FormControlLabel<Component<CheckboxGroupLabelRenderProps>>
			as="span"
			{...(props as CheckboxGroupLabelProps)}
		/>
	);
}
