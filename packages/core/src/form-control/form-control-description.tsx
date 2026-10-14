import { isServer, type ValidComponent } from "@solidjs/web";
import { createEffect, merge, untrack } from "solid-js";

import { Polymorphic, type PolymorphicProps } from "../polymorphic/index.tsx";
import {
	type FormControlDataSet,
	useFormControlContext,
} from "./form-control-context.tsx";

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

	const mergedProps = merge(
		{
			id: context.generateId("description"),
		},
		props as FormControlDescriptionProps,
	);

	// Register while rendering, so a field rendered after the description can
	// read the id in the same pass. The effect keeps the registration in sync
	// when the id changes and unregisters it on unmount. Registration is a
	// signal write, so it stays client-side: on the server the association
	// falls back to the part's deterministic id (`${rootId}-description`).
	if (!isServer) untrack(() => context.registerDescription(mergedProps.id!));

	createEffect(
		() => mergedProps.id!,
		(id) => context.registerDescription(id),
	);

	return (
		<Polymorphic<FormControlDescriptionRenderProps>
			as="div"
			{...context.dataset()}
			{...mergedProps}
		/>
	);
}
