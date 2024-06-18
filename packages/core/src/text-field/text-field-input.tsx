/*
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/0af91c08c745f4bb35b6ad4932ca17a0d85dd02c/packages/@react-aria/textfield/src/useTextField.ts
 */

import { composeEventHandlers, mergeDefaultProps } from "@kobalte/utils";
import { type JSX, type ValidComponent, splitProps } from "solid-js";

import {
	FORM_CONTROL_FIELD_PROP_NAMES,
	type FormControlDataSet,
	createFormControlField,
	useFormControlContext,
} from "../form-control";
import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";
import { useTextFieldContext } from "./text-field-context";

export interface TextFieldInputOptions {}

export interface TextFieldInputCommonProps<
	T extends HTMLElement = HTMLElement,
> {
	id: string;
	onInput: JSX.EventHandlerUnion<T, InputEvent>;
	"aria-label": string | undefined;
	"aria-labelledby": string | undefined;
	"aria-describedby": string | undefined;
}

export interface TextFieldInputRenderProps
	extends TextFieldInputCommonProps,
		FormControlDataSet {
	name: string;
	value: string | undefined;
	required: boolean | undefined;
	disabled: boolean | undefined;
	readonly: boolean | undefined;
	"aria-invalid": boolean | undefined;
	"aria-required": boolean | undefined;
	"aria-disabled": boolean | undefined;
	"aria-readonly": boolean | undefined;
}

export type TextFieldInputProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = TextFieldInputOptions & Partial<TextFieldInputCommonProps<ElementOf<T>>>;

export function TextFieldInput<T extends ValidComponent = "input">(
	props: PolymorphicProps<T, TextFieldInputProps<T>>,
) {
	return <TextFieldInputBase type="text" {...(props as TextFieldInputProps)} />;
}

export function TextFieldInputBase<T extends ValidComponent = "input">(
	props: PolymorphicProps<T, TextFieldInputProps<T>>,
) {
	const formControlContext = useFormControlContext();
	const context = useTextFieldContext();

	const mergedProps = mergeDefaultProps(
		{
			id: context.generateId("input"),
		},
		props as TextFieldInputProps,
	);

	const [local, formControlFieldProps, others] = splitProps(
		mergedProps,
		["onInput"],
		FORM_CONTROL_FIELD_PROP_NAMES,
	);

	const { fieldProps } = createFormControlField(formControlFieldProps);

	return (
		<Polymorphic<TextFieldInputRenderProps>
			as="input"
			id={fieldProps.id()}
			name={formControlContext.name()}
			value={context.value()}
			required={formControlContext.isRequired()}
			disabled={formControlContext.isDisabled()}
			readonly={formControlContext.isReadOnly()}
			aria-label={fieldProps.ariaLabel()}
			aria-labelledby={fieldProps.ariaLabelledBy()}
			aria-describedby={fieldProps.ariaDescribedBy()}
			aria-invalid={
				formControlContext.validationState() === "invalid" || undefined
			}
			aria-required={formControlContext.isRequired() || undefined}
			aria-disabled={formControlContext.isDisabled() || undefined}
			aria-readonly={formControlContext.isReadOnly() || undefined}
			onInput={composeEventHandlers([local.onInput, context.onInput])}
			{...formControlContext.dataset()}
			{...others}
		/>
	);
}
