import { Component, ValidComponent } from "solid-js";
import {
	FormControlLabel,
	FormControlLabelCommonProps,
	FormControlLabelOptions,
	FormControlLabelRenderProps,
} from "../form-control";
import { ElementOf, PolymorphicProps } from "../polymorphic";
import { CheckboxDataSet, useCheckboxContext } from "./checkbox-context";

export interface CheckboxLabelOptions extends FormControlLabelOptions {}

export interface CheckboxLabelCommonProps<T extends HTMLElement = HTMLElement>
	extends FormControlLabelCommonProps<T> {}

export interface CheckboxLabelRenderProps
	extends CheckboxLabelCommonProps,
		FormControlLabelRenderProps,
		CheckboxDataSet {}

export type CheckboxLabelProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = CheckboxLabelOptions & Partial<CheckboxLabelCommonProps<ElementOf<T>>>;

/**
 * The label that gives the user information on the checkbox.
 */
export function CheckboxLabel<T extends ValidComponent = "label">(
	props: PolymorphicProps<T, CheckboxLabelProps<T>>,
) {
	const context = useCheckboxContext();

	return (
		<FormControlLabel<
			Component<
				Omit<CheckboxLabelRenderProps, keyof FormControlLabelRenderProps>
			>
		>
			{...context.dataset()}
			{...(props as CheckboxLabelProps)}
		/>
	);
}
