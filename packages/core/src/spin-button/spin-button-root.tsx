/*
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/99ca82e87ba2d7fdd54f5b49326fd242320b4b51/packages/%40react-aria/spinbutton/src/useSpinButton.ts
 */

import { mergeDefaultProps } from "@kobalte/utils";
import { type ValidationState, callHandler } from "@kobalte/utils";
import {
	type JSX,
	type ValidComponent,
	createEffect,
	createMemo,
	on,
	splitProps,
} from "solid-js";

import { combineStyle } from "@solid-primitives/props";
import { announce, clearAnnouncer } from "../live-announcer";
import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";
import {
	SPIN_BUTTON_INTL_TRANSLATIONS,
	type SpinButtonIntlTranslations,
} from "./spin-button.intl";

export interface SpinButtonRootOptions {
	/** The localized strings of the component. */
	translations?: SpinButtonIntlTranslations;

	/** The controlled value of the spin button. */
	value?: number | string;

	/** The string representation of the value. */
	textValue?: string;

	/** The smallest value allowed for the spin button. */
	minValue?: number;

	/** The largest value allowed for the spin button. */
	maxValue?: number;

	/** Whether the spin button should display its "valid" or "invalid" visual styling. */
	validationState?: ValidationState;

	/** Whether the user must fill the spin button before the owning form can be submitted. */
	required?: boolean;

	/** Whether the spin button is disabled. */
	disabled?: boolean;

	/** Whether the spin button is read only. */
	readOnly?: boolean;

	/** Event handler called to increment the value of the spin button by one step. */
	onIncrement?: () => void;

	/** Event handler called to increment the value of the spin button by one page. */
	onIncrementPage?: () => void;

	/** Event handler called to decrement the value of the spin button by one step. */
	onDecrement?: () => void;

	/** Event handler called to decrement the value of the spin button by one page. */
	onDecrementPage?: () => void;

	/** Event handler called to decrement the value of the spin button to the `minValue`. */
	onDecrementToMin?: () => void;

	/** Event handler called to increment the value of the spin button to the `maxValue`. */
	onIncrementToMax?: () => void;
}

export interface SpinButtonRootCommonProps<
	T extends HTMLElement = HTMLElement,
> {
	style?: JSX.CSSProperties | string;
	onKeyDown: JSX.EventHandlerUnion<T, KeyboardEvent>;
	onFocus: JSX.EventHandlerUnion<T, FocusEvent>;
	onBlur: JSX.EventHandlerUnion<T, FocusEvent>;
}

export interface SpinButtonRootRenderProps extends SpinButtonRootCommonProps {
	role: "spinbutton";
	"aria-valuenow": number | string | undefined;
	"aria-valuetext": string | undefined;
	"aria-valuemin": number | undefined;
	"aria-valuemax": number | undefined;
	"aria-required": boolean | undefined;
	"aria-disabled": boolean | undefined;
	"aria-readonly": boolean | undefined;
	"aria-invalid": boolean | undefined;
}

export type SpinButtonRootProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = SpinButtonRootOptions & Partial<SpinButtonRootCommonProps<ElementOf<T>>>;

export function SpinButtonRoot<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, SpinButtonRootProps<T>>,
) {
	const mergedProps = mergeDefaultProps(
		{
			translations: SPIN_BUTTON_INTL_TRANSLATIONS,
		},
		props as SpinButtonRootProps,
	);

	const [local, others] = splitProps(mergedProps, [
		"style",
		"translations",
		"value",
		"textValue",
		"minValue",
		"maxValue",
		"validationState",
		"onIncrement",
		"onIncrementPage",
		"onDecrement",
		"onDecrementPage",
		"onDecrementToMin",
		"onIncrementToMax",
		"onKeyDown",
		"onFocus",
		"onBlur",
	]);

	let isFocused = false;

	// Replace Unicode hyphen-minus (U+002D) with minus sign (U+2212).
	// This ensures that macOS VoiceOver announces it as "minus" even with other characters between the minus sign
	// and the number (e.g. currency symbol). Otherwise, it announces nothing because it assumes the character is a hyphen.
	// In addition, replace the empty string with the word "Empty" so that iOS VoiceOver does not read "50%" for an empty field.
	const textValue = createMemo(() => {
		if (local.textValue === "") {
			return local.translations?.empty;
		}

		return (local.textValue || `${local.value}`).replace("-", "\u2212");
	});

	const onKeyDown: JSX.EventHandlerUnion<HTMLElement, KeyboardEvent> = (e) => {
		callHandler(e, local.onKeyDown);

		if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey || props.readOnly) {
			return;
		}

		switch (e.key) {
			// biome-ignore lint/suspicious/noFallthroughSwitchClause: fallthrough
			case "PageUp":
				if (local.onIncrementPage) {
					e.preventDefault();
					local.onIncrementPage();
					break;
				}
			// fallthrough!
			case "ArrowUp":
			case "Up":
				if (local.onIncrement) {
					e.preventDefault();
					local.onIncrement();
				}
				break;
			// biome-ignore lint/suspicious/noFallthroughSwitchClause: fallthrough
			case "PageDown":
				if (local.onDecrementPage) {
					e.preventDefault();
					local.onDecrementPage();
					break;
				}
			// fallthrough!
			case "ArrowDown":
			case "Down":
				if (local.onDecrement) {
					e.preventDefault();
					local.onDecrement();
				}
				break;
			case "Home":
				if (local.onDecrementToMin) {
					e.preventDefault();
					local.onDecrementToMin();
				}
				break;
			case "End":
				if (local.onIncrementToMax) {
					e.preventDefault();
					local.onIncrementToMax();
				}
				break;
		}
	};

	const onFocus: JSX.EventHandlerUnion<HTMLElement, FocusEvent> = (e) => {
		callHandler(e, local.onFocus);

		isFocused = true;
	};

	const onBlur: JSX.EventHandlerUnion<HTMLElement, FocusEvent> = (e) => {
		callHandler(e, local.onBlur);

		isFocused = false;
	};

	createEffect(
		on(textValue, (textValue) => {
			if (isFocused) {
				clearAnnouncer("assertive");
				announce(textValue ?? "", "assertive");
			}
		}),
	);

	return (
		<Polymorphic<SpinButtonRootRenderProps>
			as="div"
			role="spinbutton"
			style={combineStyle(
				{
					"touch-action": "none",
				},
				local.style,
			)}
			aria-valuenow={
				local.value != null && !Number.isNaN(local.value)
					? local.value
					: undefined
			}
			aria-valuetext={textValue()}
			aria-valuemin={local.minValue}
			aria-valuemax={local.maxValue}
			aria-required={props.required || undefined}
			aria-disabled={props.disabled || undefined}
			aria-readonly={props.readOnly || undefined}
			aria-invalid={local.validationState === "invalid" || undefined}
			onKeyDown={onKeyDown}
			onFocus={onFocus}
			onBlur={onBlur}
			{...others}
		/>
	);
}
