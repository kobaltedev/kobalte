import { Component, ValidComponent } from "solid-js";
import {
	FormControlLabel,
	FormControlLabelCommonProps,
	FormControlLabelOptions,
	FormControlLabelRenderProps,
} from "../form-control";
import { PolymorphicProps } from "../polymorphic";
import { CheckboxDataSet, useCheckboxContext } from "./checkbox-context";

export interface CheckboxLabelOptions extends FormControlLabelOptions {}

export interface CheckboxLabelCommonProps extends FormControlLabelCommonProps {}

export interface CheckboxLabelRenderProps
	extends CheckboxLabelCommonProps,
		FormControlLabelRenderProps,
		CheckboxDataSet {}

export type CheckboxLabelProps = CheckboxLabelOptions &
	Partial<CheckboxLabelCommonProps>;

/**
 * The label that gives the user information on the checkbox.
 */
export function CheckboxLabel<T extends ValidComponent = "label">(
	props: PolymorphicProps<T, CheckboxLabelProps>,
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
