import {
	OverrideComponentProps,
	mergeDefaultProps,
	mergeRefs,
} from "@kobalte/utils";
import { ValidComponent, createEffect, onCleanup, splitProps } from "solid-js";

import { Polymorphic, PolymorphicProps } from "../polymorphic";
import { createTagName } from "../primitives";
import {
	FormControlDataSet,
	useFormControlContext,
} from "./form-control-context";

export interface FormControlLabelOptions {}

export interface FormControlLabelCommonProps {
	id: string;
	ref: HTMLElement | ((el: HTMLElement) => void);
}

export interface FormControlLabelRenderProps
	extends FormControlLabelCommonProps,
		FormControlDataSet {
	for: string | undefined;
}

export type FormControlLabelProps = FormControlLabelOptions &
	Partial<FormControlLabelCommonProps>;

/**
 * The label that gives the user information on the form control.
 */
export function FormControlLabel<T extends ValidComponent = "label">(
	props: PolymorphicProps<T, FormControlLabelProps>,
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
