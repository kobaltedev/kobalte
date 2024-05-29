/*
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/3155e4db7eba07cf06525747ce0adb54c1e2a086/packages/@react-aria/switch/src/useSwitch.ts
 * https://github.com/adobe/react-spectrum/blob/3155e4db7eba07cf06525747ce0adb54c1e2a086/packages/@react-aria/toggle/src/useToggle.ts
 */

import {
	OverrideComponentProps,
	callHandler,
	mergeDefaultProps,
	mergeRefs,
	visuallyHiddenStyles,
} from "@kobalte/utils";
import { ComponentProps, JSX, ValidComponent, splitProps } from "solid-js";

import {
	FORM_CONTROL_FIELD_PROP_NAMES,
	FormControlDataSet,
	createFormControlField,
	useFormControlContext,
} from "../form-control";
import { ElementOf, Polymorphic, PolymorphicProps } from "../polymorphic";
import { SwitchDataSet, useSwitchContext } from "./switch-context";

export interface SwitchInputOptions {}

export interface SwitchInputCommonProps<
	T extends HTMLElement = HTMLInputElement,
> {
	id: string;
	ref: T | ((el: T) => void);
	/** The HTML styles attribute (object form only). */
	style?: JSX.CSSProperties;
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
	"aria-invalid": boolean | undefined;
	"aria-required": boolean | undefined;
	"aria-disabled": boolean | undefined;
	"aria-readonly": boolean | undefined;
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

	const [local, formControlFieldProps, others] = splitProps(
		mergedProps,
		["ref", "style", "onChange", "onFocus", "onBlur"],
		FORM_CONTROL_FIELD_PROP_NAMES,
	);

	const { fieldProps } = createFormControlField(formControlFieldProps);

	const onChange: JSX.EventHandlerUnion<HTMLInputElement, Event> = (e) => {
		callHandler(e, local.onChange);

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
		callHandler(e, local.onFocus);
		context.setIsFocused(true);
	};

	const onBlur: JSX.EventHandlerUnion<HTMLInputElement, FocusEvent> = (e) => {
		callHandler(e, local.onBlur);
		context.setIsFocused(false);
	};

	return (
		<Polymorphic<SwitchInputRenderProps>
			as="input"
			ref={mergeRefs(context.setInputRef, local.ref)}
			type="checkbox"
			role="switch"
			id={fieldProps.id()}
			name={formControlContext.name()}
			value={context.value()}
			checked={context.checked()}
			required={formControlContext.isRequired()}
			disabled={formControlContext.isDisabled()}
			readonly={formControlContext.isReadOnly()}
			style={{ ...visuallyHiddenStyles, ...local.style }}
			aria-checked={context.checked()}
			aria-label={fieldProps.ariaLabel()}
			aria-labelledby={fieldProps.ariaLabelledBy()}
			aria-describedby={fieldProps.ariaDescribedBy()}
			aria-invalid={
				formControlContext.validationState() === "invalid" || undefined
			}
			aria-required={formControlContext.isRequired() || undefined}
			aria-disabled={formControlContext.isDisabled() || undefined}
			aria-readonly={formControlContext.isReadOnly() || undefined}
			onChange={onChange}
			onFocus={onFocus}
			onBlur={onBlur}
			{...formControlContext.dataset()}
			{...context.dataset()}
			{...others}
		/>
	);
}
