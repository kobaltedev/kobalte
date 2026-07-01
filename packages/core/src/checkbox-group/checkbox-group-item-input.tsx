/*
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/main/packages/%40react-aria/checkbox/src/useCheckboxGroup.ts
 */

import { type Component, type ValidComponent, splitProps } from "solid-js";

import { mergeRefs } from "@kobalte/utils";
import {
	Checkbox,
	type CheckboxInputCommonProps,
	type CheckboxInputOptions,
	type CheckboxInputRenderProps,
} from "../checkbox";
import { useFormControlContext } from "../form-control";
import type { ElementOf, PolymorphicProps } from "../polymorphic";
import { useCheckboxGroupContext } from "./checkbox-group-context";

export interface CheckboxGroupItemInputOptions extends CheckboxInputOptions {}

export interface CheckboxGroupItemInputCommonProps<
	T extends HTMLElement = HTMLInputElement,
> extends CheckboxInputCommonProps {}

export interface CheckboxGroupItemInputRenderProps
	extends CheckboxInputRenderProps,
		CheckboxGroupItemInputCommonProps {}

export type CheckboxGroupItemInputProps<
	T extends ValidComponent | HTMLElement = HTMLInputElement,
> = CheckboxGroupItemInputOptions &
	Partial<CheckboxGroupItemInputCommonProps<ElementOf<T>>>;

/**
 * The native html input that is visually hidden in the checkbox.
 */
export function CheckboxGroupItemInput<T extends ValidComponent = "input">(
	props: PolymorphicProps<T, CheckboxGroupItemInputProps<T>>,
) {
	let ref: HTMLInputElement | undefined;

	const formControlContext = useFormControlContext();
	const checkboxGroupContext = useCheckboxGroupContext();

	const [local, others] = splitProps(props, ["aria-describedby", "ref"]);

	const ariaDescribedBy = () => {
		return (
			[local["aria-describedby"], checkboxGroupContext.ariaDescribedBy()]
				.filter(Boolean)
				.join(" ") || undefined
		);
	};

	return (
		<Checkbox.Input<
			Component<
				Omit<CheckboxGroupItemInputRenderProps, keyof CheckboxInputRenderProps>
			>
		>
			ref={mergeRefs((el) => (ref = el), local.ref)}
			as="input"
			aria-describedby={ariaDescribedBy() || undefined}
			{...formControlContext.dataset()}
			{...others}
		/>
	);
}
