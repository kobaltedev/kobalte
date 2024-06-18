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
import { useFormControlContext } from "../form-control";
import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";
import { useRadioGroupContext } from "./radio-group-context";
import {
	type RadioGroupItemDataSet,
	useRadioGroupItemContext,
} from "./radio-group-item-context";

export interface RadioGroupItemInputOptions {}

export interface RadioGroupItemInputCommonProps<
	T extends HTMLElement = HTMLInputElement,
> {
	id: string;
	ref: T | ((el: T) => void);
	"aria-labelledby": string | undefined;
	"aria-describedby": string | undefined;
	onChange: JSX.EventHandlerUnion<T, Event>;
	onFocus: JSX.EventHandlerUnion<T, FocusEvent>;
	onBlur: JSX.EventHandlerUnion<T, FocusEvent>;
	"aria-label"?: string;
	style?: JSX.CSSProperties | string;
}

export interface RadioGroupItemInputRenderProps
	extends RadioGroupItemInputCommonProps,
		RadioGroupItemDataSet {
	type: "radio";
	name: string;
	value: string;
	checked: boolean;
	required: boolean | undefined;
	disabled: boolean | undefined;
	readonly: boolean | undefined;
}

export type RadioGroupItemInputProps<
	T extends ValidComponent | HTMLElement = HTMLInputElement,
> = RadioGroupItemInputOptions &
	Partial<RadioGroupItemInputCommonProps<ElementOf<T>>>;

/**
 * The native html input that is visually hidden in the radio button.
 */
export function RadioGroupItemInput<T extends ValidComponent = "input">(
	props: PolymorphicProps<T, RadioGroupItemInputProps<T>>,
) {
	const formControlContext = useFormControlContext();
	const radioGroupContext = useRadioGroupContext();
	const radioContext = useRadioGroupItemContext();

	const mergedProps = mergeDefaultProps(
		{
			id: radioContext.generateId("input"),
		},
		props as RadioGroupItemInputProps,
	);

	const [local, others] = splitProps(mergedProps, [
		"ref",
		"style",
		"aria-labelledby",
		"aria-describedby",
		"onChange",
		"onFocus",
		"onBlur",
	]);

	const ariaLabelledBy = () => {
		return (
			[
				local["aria-labelledby"],
				radioContext.labelId(),
				// If there is both an aria-label and aria-labelledby, add the input itself has an aria-labelledby
				local["aria-labelledby"] != null && others["aria-label"] != null
					? others.id
					: undefined,
			]
				.filter(Boolean)
				.join(" ") || undefined
		);
	};

	const ariaDescribedBy = () => {
		return (
			[
				local["aria-describedby"],
				radioContext.descriptionId(),
				radioGroupContext.ariaDescribedBy(),
			]
				.filter(Boolean)
				.join(" ") || undefined
		);
	};

	const [isInternalChangeEvent, setIsInternalChangeEvent] = createSignal(false);

	const onChange: JSX.EventHandlerUnion<HTMLInputElement, Event> = (e) => {
		callHandler(e, local.onChange);

		e.stopPropagation();

		if (!isInternalChangeEvent()) {
			radioGroupContext.setSelectedValue(radioContext.value());

			const target = e.target as HTMLInputElement;

			// Unlike in React, inputs `checked` state can be out of sync with our state.
			// for example a readonly `<input type="radio" />` is always "checkable".
			//
			// Also, even if an input is controlled (ex: `<input type="radio" checked={isChecked} />`,
			// clicking on the input will change its internal `checked` state.
			//
			// To prevent this, we need to force the input `checked` state to be in sync with our state.
			target.checked = radioContext.isSelected();
		}
		setIsInternalChangeEvent(false);
	};

	const onFocus: JSX.EventHandlerUnion<HTMLInputElement, FocusEvent> = (e) => {
		callHandler(e, local.onFocus);
		radioContext.setIsFocused(true);
	};

	const onBlur: JSX.EventHandlerUnion<HTMLInputElement, FocusEvent> = (e) => {
		callHandler(e, local.onBlur);
		radioContext.setIsFocused(false);
	};

	createEffect(
		on(
			[() => radioContext.isSelected(), () => radioContext.value()],
			(c) => {
				if (!c[0] && c[1] === radioContext.value()) return;
				setIsInternalChangeEvent(true);

				const ref = radioContext.inputRef();
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
	createEffect(() => onCleanup(radioContext.registerInput(others.id!)));

	return (
		<Polymorphic<RadioGroupItemInputRenderProps>
			as="input"
			ref={mergeRefs(radioContext.setInputRef, local.ref)}
			type="radio"
			name={formControlContext.name()}
			value={radioContext.value()}
			checked={radioContext.isSelected()}
			required={formControlContext.isRequired()}
			disabled={radioContext.isDisabled()}
			readonly={formControlContext.isReadOnly()}
			style={combineStyle({ ...visuallyHiddenStyles }, local.style)}
			aria-labelledby={ariaLabelledBy()}
			aria-describedby={ariaDescribedBy()}
			onChange={onChange}
			onFocus={onFocus}
			onBlur={onBlur}
			{...radioContext.dataset()}
			{...others}
		/>
	);
}
