import { Component, ValidComponent } from "solid-js";
import {
	FormControlDescription,
	FormControlDescriptionCommonProps,
	FormControlDescriptionProps,
	FormControlDescriptionRenderProps,
} from "../form-control";
import { PolymorphicProps } from "../polymorphic";
import { CheckboxDataSet, useCheckboxContext } from "./checkbox-context";

export interface CheckboxDescriptionOptions
	extends FormControlDescriptionProps {}

export interface CheckboxDescriptionCommonProps
	extends FormControlDescriptionCommonProps {}

export interface CheckboxDescriptionRenderProps
	extends CheckboxDescriptionCommonProps,
		CheckboxDataSet,
		FormControlDescriptionRenderProps {}

export type CheckboxDescriptionProps = CheckboxDescriptionOptions &
	Partial<CheckboxDescriptionCommonProps>;

/**
 * The description that gives the user more information on the checkbox.
 */
export function CheckboxDescription<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, CheckboxDescriptionProps>,
) {
	const context = useCheckboxContext();

	return (
		<FormControlDescription<
			Component<
				Omit<
					CheckboxDescriptionRenderProps,
					keyof FormControlDescriptionRenderProps
				>
			>
		>
			{...context.dataset()}
			{...(props as CheckboxDescriptionProps)}
		/>
	);
}
