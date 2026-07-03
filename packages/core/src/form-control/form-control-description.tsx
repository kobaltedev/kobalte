import { mergeDefaultProps } from "@kobalte/utils";
import type { ValidComponent } from "@solidjs/web";
import { createEffect, onCleanup } from "solid-js";

import { Polymorphic, type PolymorphicProps } from "../polymorphic";
import {
	type FormControlDataSet,
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

	createEffect(
		() => mergedProps.id!,
		(id) => {
			onCleanup(context.registerDescription(id));
		},
	);

	return (
		<Polymorphic<FormControlDescriptionRenderProps>
			as="div"
			{...context.dataset()}
			{...mergedProps}
		/>
	);
}
