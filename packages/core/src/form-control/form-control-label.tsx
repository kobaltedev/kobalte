import {
	OverrideComponentProps,
	mergeDefaultProps,
	mergeRefs,
} from "@kobalte/utils";
import {
	type ValidComponent,
	createEffect,
	onCleanup,
	splitProps,
} from "solid-js";

import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";
import { createTagName } from "../primitives";
import {
	type FormControlDataSet,
	useFormControlContext,
} from "./form-control-context";

export interface FormControlLabelOptions {}

export interface FormControlLabelCommonProps<
	T extends HTMLElement = HTMLElement,
> {
	id: string;
	ref: T | ((el: T) => void);
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
	let ref: HTMLElement | undefined;

	const context = useFormControlContext();

	const mergedProps = mergeDefaultProps(
		{
			id: context.generateId("label"),
		},
		props as FormControlLabelProps,
	);

	const [local, others] = splitProps(mergedProps, ["ref"]);

	const tagName = createTagName(
		() => ref,
		() => "label",
	);

	createEffect(() => onCleanup(context.registerLabel(others.id)));

	return (
		<Polymorphic<FormControlLabelRenderProps>
			as="label"
			ref={mergeRefs((el) => (ref = el), local.ref)}
			for={tagName() === "label" ? context.fieldId() : undefined}
			{...context.dataset()}
			{...others}
		/>
	);
}
