import { OverrideComponentProps, mergeDefaultProps } from "@kobalte/utils";
import { type ValidComponent, createEffect, onCleanup } from "solid-js";

import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";
import {
	type FormControlDataSet,
	useFormControlContext,
} from "./form-control-context";

export interface FormControlDescriptionOptions {}

export interface FormControlDescriptionCommonProps<
	T extends HTMLElement = HTMLElement,
> {
	id: string;
}

export interface FormControlDescriptionRenderProps
	extends FormControlDescriptionCommonProps,
		FormControlDataSet {}

export type FormControlDescriptionProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = FormControlDescriptionOptions &
	Partial<FormControlDescriptionCommonProps<ElementOf<T>>>;

/**
 * The description that gives the user more information on the form control.
 */
export function FormControlDescription<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, FormControlDescriptionProps<T>>,
) {
	const context = useFormControlContext();

	const mergedProps = mergeDefaultProps(
		{
			id: context.generateId("description"),
		},
		props as FormControlDescriptionProps,
	);

	createEffect(() => onCleanup(context.registerDescription(mergedProps.id!)));

	return (
		<Polymorphic<FormControlDescriptionRenderProps>
			as="div"
			{...context.dataset()}
			{...mergedProps}
		/>
	);
}
