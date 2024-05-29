import { Component, ValidComponent } from "solid-js";
import {
	FormControlErrorMessage,
	FormControlErrorMessageCommonProps,
	FormControlErrorMessageProps,
	FormControlErrorMessageRenderProps,
} from "../form-control";
import { ElementOf, PolymorphicProps } from "../polymorphic";
import { CheckboxDataSet, useCheckboxContext } from "./checkbox-context";

export interface CheckboxErrorMessageOptions
	extends FormControlErrorMessageProps {}

export interface CheckboxErrorMessageCommonProps<
	T extends HTMLElement = HTMLElement,
> extends FormControlErrorMessageCommonProps<T> {}

export interface CheckboxErrorMessageRenderProps
	extends CheckboxErrorMessageCommonProps,
		CheckboxDataSet,
		FormControlErrorMessageRenderProps {}

export type CheckboxErrorMessageProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = CheckboxErrorMessageOptions &
	Partial<CheckboxErrorMessageCommonProps<ElementOf<T>>>;

/**
 * The error message that gives the user information about how to fix a validation error on the checkbox.
 */
export function CheckboxErrorMessage<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, CheckboxErrorMessageProps<T>>,
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
