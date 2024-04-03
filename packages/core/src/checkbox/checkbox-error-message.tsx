import { Component, ValidComponent } from "solid-js";
import {
	FormControlErrorMessage,
	FormControlErrorMessageCommonProps,
	FormControlErrorMessageProps,
	FormControlErrorMessageRenderProps,
} from "../form-control";
import { PolymorphicProps } from "../polymorphic";
import { CheckboxDataSet, useCheckboxContext } from "./checkbox-context";

export interface CheckboxErrorMessageOptions
	extends FormControlErrorMessageProps {}

export interface CheckboxErrorMessageCommonProps
	extends FormControlErrorMessageCommonProps {}

export interface CheckboxErrorMessageRenderProps
	extends CheckboxErrorMessageCommonProps,
		CheckboxDataSet,
		FormControlErrorMessageRenderProps {}

export type CheckboxErrorMessageProps = CheckboxErrorMessageOptions &
	Partial<CheckboxErrorMessageCommonProps>;

/**
 * The error message that gives the user information about how to fix a validation error on the checkbox.
 */
export function CheckboxErrorMessage<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, CheckboxErrorMessageProps>,
) {
	const context = useCheckboxContext();

	return (
		<FormControlErrorMessage<
			Component<
				Omit<
					CheckboxErrorMessageRenderProps,
					keyof FormControlErrorMessageRenderProps
				>
			>
		>
			{...context.dataset()}
			{...(props as CheckboxErrorMessageProps)}
		/>
	);
}
