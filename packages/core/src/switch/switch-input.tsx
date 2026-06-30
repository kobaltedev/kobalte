/*
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/3155e4db7eba07cf06525747ce0adb54c1e2a086/packages/@react-aria/switch/src/useSwitch.ts
 * https://github.com/adobe/react-spectrum/blob/3155e4db7eba07cf06525747ce0adb54c1e2a086/packages/@react-aria/toggle/src/useToggle.ts
 */

import {
	callHandler,
	mergeDefaultProps,
	mergeRefs,
	OverrideComponentProps,
	visuallyHiddenStyles,
} from "@kobalte/utils";
import { combineStyle } from "@solid-primitives/props";
import type { ComponentProps, JSX, ValidComponent } from "@solidjs/web";
import { omit } from "solid-js";
import {
	createFormControlField,
	FORM_CONTROL_FIELD_PROP_NAMES,
	type FormControlDataSet,
	useFormControlContext,
} from "../form-control";
import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";
import { type SwitchDataSet, useSwitchContext } from "./switch-context";

export interface SwitchInputOptions {}

export interface SwitchInputCommonProps<
	T extends HTMLElement = HTMLInputElement,
> {
	id: string;
	ref: T | ((el: T) => void);
	style?: JSX.CSSProperties | string;
	onChange: JSX.EventHandlerUnion<T, Event>;
	onFocus: JSX.EventHandlerUnion<T, FocusEvent>;
	onBlur: JSX.EventHandlerUnion<T, FocusEvent>;
	"aria-label": string | undefined;
	"aria-labelledby": string | undefined;
	"aria-describedby": string | undefined;
}

export interface SwitchInputRenderProps
	extends SwitchInputCommonProps,
		FormControlDataSet,
		SwitchDataSet {
	type: "checkbox";
	role: "switch";
	name: string;
	value: string;
	checked: boolean;
	required: boolean | undefined;
	disabled: boolean | undefined;
	readonly: boolean | undefined;
	"aria-invalid": "true" | undefined;
	"aria-required": "true" | undefined;
	"aria-disabled": "true" | undefined;
	"aria-readonly": "true" | undefined;
}

export type SwitchInputProps<
	T extends ValidComponent | HTMLElement = HTMLInputElement,
> = SwitchInputOptions & Partial<SwitchInputCommonProps<ElementOf<T>>>;

/**
 * The native html input that is visually hidden in the switch.
 */
export function SwitchInput<T extends ValidComponent = "input">(
	props: PolymorphicProps<T, SwitchInputProps<T>>,
) {
	const formControlContext = useFormControlContext();
	const context = useSwitchContext();

	const mergedProps = mergeDefaultProps(
		{ id: context.generateId("input") },
		props as SwitchInputProps,
	);

	const formControlFieldProps = omit(
		mergedProps,
		"ref",
		"style",
		"onChange",
		"onFocus",
		"onBlur",
	);
	const others = omit(
		mergedProps,
		"ref",
		"style",
		"onChange",
		"onFocus",
		"onBlur",
		...FORM_CONTROL_FIELD_PROP_NAMES,
	);

	const { fieldProps } = createFormControlField(formControlFieldProps);

	const onChange: JSX.EventHandlerUnion<HTMLInputElement, Event> = (e) => {
		callHandler(e, mergedProps.onChange);

		e.stopPropagation();

		const target = e.target as HTMLInputElement;

		context.setIsChecked(target.checked);

		// Unlike in React, inputs `checked` state can be out of sync with our toggle state.
		// for example a readonly `<input type="checkbox" />` is always "checkable".
		//
		// Also, even if an input is controlled (ex: `<input type="checkbox" checked={isChecked} />`,
		// clicking on the input will change its internal `checked` state.
		//
		// To prevent this, we need to force the input `checked` state to be in sync with the toggle state.
		target.checked = context.checked();
	};

	const onFocus: JSX.EventHandlerUnion<HTMLInputElement, FocusEvent> = (e) => {
		callHandler(e, mergedProps.onFocus);
		context.setIsFocused(true);
	};

	const onBlur: JSX.EventHandlerUnion<HTMLInputElement, FocusEvent> = (e) => {
		callHandler(e, mergedProps.onBlur);
		context.setIsFocused(false);
	};

	return (
		<Polymorphic<SwitchInputRenderProps>
			as="input"
			ref={mergeRefs(context.setInputRef, mergedProps.ref)}
			type="checkbox"
			role="switch"
			id={fieldProps.id()}
			name={formControlContext.name()}
			value={context.value()}
			checked={context.checked()}
			required={formControlContext.isRequired()}
			disabled={formControlContext.isDisabled()}
			readonly={formControlContext.isReadOnly()}
			style={combineStyle({ ...visuallyHiddenStyles }, mergedProps.style)}
			aria-checked={context.checked() ? "true" : "false"}
			aria-label={fieldProps.ariaLabel()}
			aria-labelledby={fieldProps.ariaLabelledBy()}
			aria-describedby={fieldProps.ariaDescribedBy()}
			aria-invalid={
				formControlContext.validationState() === "invalid" ? "true" : undefined
			}
			aria-required={formControlContext.isRequired() ? "true" : undefined}
			aria-disabled={formControlContext.isDisabled() ? "true" : undefined}
			aria-readonly={formControlContext.isReadOnly() ? "true" : undefined}
			onChange={onChange}
			onFocus={onFocus}
			onBlur={onBlur}
			{...formControlContext.dataset()}
			{...context.dataset()}
			{...others}
		/>
	);
}
