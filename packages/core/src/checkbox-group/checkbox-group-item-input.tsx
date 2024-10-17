/*
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/70e7caf1946c423bc9aa9cb0e50dbdbe953d239b/packages/@react-aria/radio/src/useRadio.ts
 */

import {
	callHandler,
	mergeDefaultProps,
	mergeRefs,
	visuallyHiddenStyles,
} from "@kobalte/utils";
import {
	type JSX,
	type ValidComponent,
	createEffect,
	createSignal,
	on,
	onCleanup,
	splitProps,
} from "solid-js";

import { combineStyle } from "@solid-primitives/props";
import type {
	CheckboxInputCommonProps,
	CheckboxInputOptions,
	CheckboxInputRenderProps,
} from "../checkbox";
import {
	FORM_CONTROL_FIELD_PROP_NAMES,
	createFormControlField,
	useFormControlContext,
} from "../form-control";
import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";
import { useCheckboxGroupContext } from "./checkbox-group-context";
import {
	type CheckboxGroupItemDataSet,
	useCheckboxGroupItemContext,
} from "./checkbox-group-item-context";

export interface CheckboxGroupItemInputOptions extends CheckboxInputOptions {}

export interface CheckboxGroupItemInputCommonProps<
	T extends HTMLElement = HTMLInputElement,
> extends CheckboxInputCommonProps {}

export interface CheckboxGroupItemInputRenderProps
	extends CheckboxInputRenderProps,
		CheckboxGroupItemInputCommonProps,
		CheckboxGroupItemDataSet {}

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
	const context = useCheckboxGroupItemContext();

	const mergedProps = mergeDefaultProps(
		{
			id: context.generateId("input"),
		},
		props as CheckboxGroupItemInputProps,
	);

	const [local, formControlFieldProps, others] = splitProps(
		mergedProps,
		["ref", "style", "onChange", "onFocus", "onBlur"],
		FORM_CONTROL_FIELD_PROP_NAMES,
	);

	const { fieldProps } = createFormControlField(formControlFieldProps);

	const [isInternalChangeEvent, setIsInternalChangeEvent] = createSignal(false);

	const onChange: JSX.EventHandlerUnion<HTMLInputElement, InputEvent> = (e) => {
		callHandler(e, local.onChange);

		e.stopPropagation();

		if (!isInternalChangeEvent()) {
			const target = e.target as HTMLInputElement;
			// FIXME: set the values in context
			// checkboxGroupContext.setSelectedValue(context.value());

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

	const onFocus: JSX.FocusEventHandlerUnion<HTMLInputElement, FocusEvent> = (
		e,
	) => {
		callHandler(e, local.onFocus);
		context.setIsFocused(true);
	};

	const onBlur: JSX.FocusEventHandlerUnion<HTMLInputElement, FocusEvent> = (
		e,
	) => {
		callHandler(e, local.onBlur);
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
		<Polymorphic<CheckboxGroupItemInputRenderProps>
			as="input"
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
			style={combineStyle(visuallyHiddenStyles, local.style)}
			aria-label={fieldProps.ariaLabel()}
			aria-labelledby={fieldProps.ariaLabelledBy()}
			aria-describedby={fieldProps.ariaDescribedBy()}
			aria-invalid={
				formControlContext.validationState() === "invalid" || undefined
			}
			aria-required={formControlContext.isRequired()}
			aria-disabled={formControlContext.isDisabled()}
			aria-readonly={formControlContext.isReadOnly()}
			onChange={onChange}
			onFocus={onFocus}
			onBlur={onBlur}
			{...formControlContext.dataset()}
			{...context.dataset()}
			{...others}
		/>
	);
}
