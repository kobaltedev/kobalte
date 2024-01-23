/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/70e7caf1946c423bc9aa9cb0e50dbdbe953d239b/packages/@react-aria/radio/src/useCheckbox.ts
 * https://github.com/adobe/react-spectrum/blob/3155e4db7eba07cf06525747ce0adb54c1e2a086/packages/@react-aria/toggle/src/useToggle.ts
 */

import {
	OverrideComponentProps,
	callHandler,
	mergeDefaultProps,
	mergeRefs,
	visuallyHiddenStyles,
} from "@kobalte/utils";
import { JSX, createEffect, createSignal, on, splitProps } from "solid-js";

import {
	FORM_CONTROL_FIELD_PROP_NAMES,
	createFormControlField,
	useFormControlContext,
} from "../form-control";
import { useCheckboxContext } from "./checkbox-context";

export interface CheckboxInputOptions {
	/** The HTML styles attribute (object form only). */
	style?: JSX.CSSProperties;
}

export interface CheckboxInputProps
	extends OverrideComponentProps<"input", CheckboxInputOptions> {}

/**
 * The native html input that is visually hidden in the checkbox.
 */
export function CheckboxInput(props: CheckboxInputProps) {
	let ref: HTMLInputElement | undefined;

	const formControlContext = useFormControlContext();
	const context = useCheckboxContext();

	const mergedProps = mergeDefaultProps(
		{
			id: context.generateId("input"),
		},
		props,
	);

	const [local, formControlFieldProps, others] = splitProps(
		mergedProps,
		["ref", "style", "onChange", "onFocus", "onBlur"],
		FORM_CONTROL_FIELD_PROP_NAMES,
	);

	const { fieldProps } = createFormControlField(formControlFieldProps);

	const [isInternalChangeEvent, setIsInternalChangeEvent] = createSignal(false);

	const onChange: JSX.ChangeEventHandlerUnion<HTMLInputElement, Event> = (
		e,
	) => {
		callHandler(e, local.onChange);

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

	const onFocus: JSX.FocusEventHandlerUnion<HTMLElement, FocusEvent> = (e) => {
		callHandler(e, local.onFocus as typeof onFocus);
		context.setIsFocused(true);
	};

	const onBlur: JSX.FocusEventHandlerUnion<HTMLElement, FocusEvent> = (e) => {
		callHandler(e, local.onBlur as typeof onBlur);
		context.setIsFocused(false);
	};

	createEffect(
		on(
			[() => context.checked(), () => context.value()],
			() => {
				setIsInternalChangeEvent(true);

				ref?.dispatchEvent(
					new Event("input", { bubbles: true, cancelable: true }),
				);
				ref?.dispatchEvent(
					new Event("change", { bubbles: true, cancelable: true }),
				);
			},
			{
				defer: true,
			},
		),
	);

	// indeterminate is a property, but it can only be set via javascript
	// https://css-tricks.com/indeterminate-checkboxes/
	// Unlike in React, inputs `indeterminate` state can be out of sync with our.
	// Clicking on the input will change its internal `indeterminate` state.
	// To prevent this, we need to force the input `indeterminate` state to be in sync with our.
	createEffect(
		on(
			[() => ref, () => context.indeterminate(), () => context.checked()],
			([ref, indeterminate]) => {
				if (ref) {
					ref.indeterminate = indeterminate;
				}
			},
		),
	);

	return (
		<input
			ref={mergeRefs((el) => {
				context.setInputRef(el);
				ref = el;
			}, local.ref)}
			type="checkbox"
			id={fieldProps.id()}
			name={formControlContext.name()}
			value={context.value()}
			checked={context.checked()}
			required={formControlContext.isRequired()}
			disabled={formControlContext.isDisabled()}
			readonly={formControlContext.isReadOnly()}
			style={{ ...visuallyHiddenStyles, ...local.style }}
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
