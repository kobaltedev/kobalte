import { mergeDefaultProps } from "@kobalte/utils";
import type { ValidComponent } from "@solidjs/web";
import { createEffect, createSignal, omit, type Ref } from "solid-js";

import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic/index.tsx";
import { createTagName } from "../primitives/index.ts";
import {
	type FormControlDataSet,
	useFormControlContext,
} from "./form-control-context.tsx";

export interface FormControlLabelOptions {}

export interface FormControlLabelCommonProps<
	T extends HTMLElement = HTMLElement,
> {
	id: string;
	ref: Ref<T>;
}

export interface FormControlLabelRenderProps
	extends FormControlLabelCommonProps,
		FormControlDataSet {
	for: string | undefined;
}

export type FormControlLabelProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = FormControlLabelOptions &
	Partial<FormControlLabelCommonProps<ElementOf<T>>>;

/**
 * The label that gives the user information on the form control.
 */
export function FormControlLabel<T extends ValidComponent = "label">(
	props: PolymorphicProps<T, FormControlLabelProps<T>>,
) {
	const [ref, setRef] = createSignal<HTMLElement | undefined>(undefined, {
		ownedWrite: true,
	});

	const context = useFormControlContext();

	const mergedProps = mergeDefaultProps(
		{
			id: context.generateId("label"),
		},
		props as FormControlLabelProps,
	);

	const others = omit(mergedProps, "ref");

	const tagName = createTagName(ref, () => "label");

	createEffect(
		() => others.id,
		(id) => context.registerLabel(id),
	);

	return (
		<Polymorphic<FormControlLabelRenderProps>
			as="label"
			ref={[setRef, mergedProps.ref]}
			for={tagName() === "label" ? context.fieldId() : undefined}
			{...context.dataset()}
			{...others}
		/>
	);
}
