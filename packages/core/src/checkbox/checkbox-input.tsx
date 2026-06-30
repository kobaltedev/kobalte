/*
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/70e7caf1946c423bc9aa9cb0e50dbdbe953d239b/packages/@react-aria/radio/src/useCheckbox.ts
 * https://github.com/adobe/react-spectrum/blob/3155e4db7eba07cf06525747ce0adb54c1e2a086/packages/@react-aria/toggle/src/useToggle.ts
 */

import {
	callHandler,
	mergeDefaultProps,
	mergeRefs,
	visuallyHiddenStyles,
} from "@kobalte/utils";
import { combineStyle } from "@solid-primitives/props";
import type { JSX, ValidComponent } from "@solidjs/web";
import { createEffect, createSignal, omit } from "solid-js";

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
import { type CheckboxDataSet, useCheckboxContext } from "./checkbox-context";

export interface CheckboxInputOptions {}

export interface CheckboxInputCommonProps<
	T extends HTMLElement = HTMLInputElement,
> {
	id: string;
	ref: T | ((el: T) => void);
	style: JSX.CSSProperties | string;
	onChange: JSX.EventHandlerUnion<T, InputEvent>;
	onFocus: JSX.EventHandlerUnion<T, FocusEvent>;
	onBlur: JSX.EventHandlerUnion<T, FocusEvent>;
	"aria-label": string | undefined;
	"aria-labelledby": string | undefined;
	"aria-describedby": string | undefined;
}

export interface CheckboxInputRenderProps
	extends CheckboxInputCommonProps,
		FormControlDataSet,
		CheckboxDataSet {
	type: "checkbox";
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

export type CheckboxInputProps<
	T extends ValidComponent | HTMLElement = HTMLInputElement,
> = CheckboxInputOptions & Partial<CheckboxInputCommonProps<ElementOf<T>>>;

/**
 * The native html input that is visually hidden in the checkbox.
 */
export function CheckboxInput<T extends ValidComponent = "input">(
	props: PolymorphicProps<T, CheckboxInputProps<T>>,
) {
	const [ref, setRef] = createSignal<HTMLInputElement | undefined>(undefined, {
		ownedWrite: true,
	});

	const formControlContext = useFormControlContext();
	const context = useCheckboxContext();

	const mergedProps = mergeDefaultProps(
		{
			id: context.generateId("input"),
		},
		props as CheckboxInputProps,
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
		"id",
		"aria-label",
		"aria-labelledby",
		"aria-describedby",
	);

	const { fieldProps } = createFormControlField(formControlFieldProps);

	const [isInternalChangeEvent, setIsInternalChangeEvent] = createSignal(false);

	const onChange: JSX.EventHandlerUnion<HTMLInputElement, InputEvent> = (e) => {
		callHandler(e, mergedProps.onChange);

		e.stopPropagation();

		if (!isInternalChangeEvent()) {
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
		}
		setIsInternalChangeEvent(false);
	};

	const onFocus: JSX.EventHandlerUnion<HTMLInputElement, FocusEvent> = (e) => {
		callHandler(e, mergedProps.onFocus);
		context.setIsFocused(true);
	};

	const onBlur: JSX.EventHandlerUnion<HTMLInputElement, FocusEvent> = (e) => {
		callHandler(e, mergedProps.onBlur);
		context.setIsFocused(false);
	};

	createEffect(
		() => [context.checked(), context.value()],
		() => {
			setIsInternalChangeEvent(true);

			ref()?.dispatchEvent(
				new Event("input", { bubbles: true, cancelable: true }),
			);
			ref()?.dispatchEvent(
				new Event("change", { bubbles: true, cancelable: true }),
			);
		},
		{ defer: true },
	);

	// indeterminate is a property, but it can only be set via javascript
	// https://css-tricks.com/indeterminate-checkboxes/
	// Unlike in React, inputs `indeterminate` state can be out of sync with our.
	// Clicking on the input will change its internal `indeterminate` state.
	// To prevent this, we need to force the input `indeterminate` state to be in sync with our.
	createEffect(
		() => [ref(), context.indeterminate(), context.checked()] as const,
		([elRef, indeterminate]) => {
			if (elRef) {
				elRef.indeterminate = indeterminate;
			}
		},
	);

	return (
		<Polymorphic<CheckboxInputRenderProps>
			as="input"
			ref={mergeRefs((el) => {
				context.setInputRef(el);
				setRef(el);
			}, mergedProps.ref)}
			type="checkbox"
			id={fieldProps.id()}
			name={formControlContext.name()}
			value={context.value()}
			checked={context.checked()}
			required={formControlContext.isRequired()}
			disabled={formControlContext.isDisabled()}
			readonly={formControlContext.isReadOnly()}
			style={combineStyle(visuallyHiddenStyles, mergedProps.style)}
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
