import { OverrideComponentProps, mergeDefaultProps } from "@kobalte/utils";
import { ValidComponent, createEffect, onCleanup } from "solid-js";

import { Polymorphic, PolymorphicProps } from "../polymorphic";
import {
	FormControlDataSet,
	useFormControlContext,
} from "./form-control-context";

export interface FormControlDescriptionOptions {}

export interface FormControlDescriptionCommonProps {
	id: string;
}

export interface FormControlDescriptionRenderProps
	extends FormControlDescriptionCommonProps,
		FormControlDataSet {}

export type FormControlDescriptionProps = FormControlDescriptionOptions &
	Partial<FormControlDescriptionCommonProps>;

/**
 * The description that gives the user more information on the form control.
 */
export function FormControlDescription<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, FormControlDescriptionProps>,
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
