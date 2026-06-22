import type { ValidComponent } from "@solidjs/web";
import type { Component } from "solid-js";
import {
	FormControlDescription,
	type FormControlDescriptionCommonProps,
	type FormControlDescriptionProps,
	type FormControlDescriptionRenderProps,
} from "../form-control";
import type { PolymorphicProps } from "../polymorphic";
import { type CheckboxDataSet, useCheckboxContext } from "./checkbox-context";

export interface CheckboxDescriptionOptions
	extends FormControlDescriptionProps {}

export interface CheckboxDescriptionCommonProps
	extends FormControlDescriptionCommonProps {}

export interface CheckboxDescriptionRenderProps
	extends CheckboxDescriptionCommonProps,
		CheckboxDataSet,
		FormControlDescriptionRenderProps {}

export type CheckboxDescriptionProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = CheckboxDescriptionOptions & Partial<CheckboxDescriptionCommonProps>;

/**
 * The description that gives the user more information on the checkbox.
 */
export function CheckboxDescription<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, CheckboxDescriptionProps<T>>,
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
