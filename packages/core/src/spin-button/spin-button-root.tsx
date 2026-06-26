/*
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/99ca82e87ba2d7fdd54f5b49326fd242320b4b51/packages/%40react-aria/spinbutton/src/useSpinButton.ts
 */

import {
	callHandler,
	mergeDefaultProps,
	type ValidationState,
} from "@kobalte/utils";
import { combineStyle } from "@solid-primitives/props";
import type { JSX, ValidComponent } from "@solidjs/web";
import { createEffect, createMemo, omit } from "solid-js";
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
	style?: JSX.CSSProperties | string | false;
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
	"aria-required": "true" | undefined;
	"aria-disabled": "true" | undefined;
	"aria-readonly": "true" | undefined;
	"aria-invalid": "true" | undefined;
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

	const others = omit(
		mergedProps,
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
	);

	let isFocused = false;

	// Replace Unicode hyphen-minus (U+002D) with minus sign (U+2212).
	// This ensures that macOS VoiceOver announces it as "minus" even with other characters between the minus sign
	// and the number (e.g. currency symbol). Otherwise, it announces nothing because it assumes the character is a hyphen.
	// In addition, replace the empty string with the word "Empty" so that iOS VoiceOver does not read "50%" for an empty field.
	const textValue = createMemo(() => {
		if (mergedProps.textValue === "") {
			return mergedProps.translations?.empty;
		}

		return (mergedProps.textValue || `${mergedProps.value}`).replace(
			"-",
			"\u2212",
		);
	});

	const onKeyDown: JSX.EventHandlerUnion<HTMLElement, KeyboardEvent> = (e) => {
		callHandler(e, mergedProps.onKeyDown);

		if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey || props.readOnly) {
			return;
		}

		switch (e.key) {
			// biome-ignore lint/suspicious/noFallthroughSwitchClause: fallthrough
			case "PageUp":
				if (mergedProps.onIncrementPage) {
					e.preventDefault();
					mergedProps.onIncrementPage();
					break;
				}
			// fallthrough!
			case "ArrowUp":
			case "Up":
				if (mergedProps.onIncrement) {
					e.preventDefault();
					mergedProps.onIncrement();
				}
				break;
			// biome-ignore lint/suspicious/noFallthroughSwitchClause: fallthrough
			case "PageDown":
				if (mergedProps.onDecrementPage) {
					e.preventDefault();
					mergedProps.onDecrementPage();
					break;
				}
			// fallthrough!
			case "ArrowDown":
			case "Down":
				if (mergedProps.onDecrement) {
					e.preventDefault();
					mergedProps.onDecrement();
				}
				break;
			case "Home":
				if (mergedProps.onDecrementToMin) {
					e.preventDefault();
					mergedProps.onDecrementToMin();
				}
				break;
			case "End":
				if (mergedProps.onIncrementToMax) {
					e.preventDefault();
					mergedProps.onIncrementToMax();
				}
				break;
		}
	};

	const onFocus: JSX.EventHandlerUnion<HTMLElement, FocusEvent> = (e) => {
		callHandler(e, mergedProps.onFocus);

		isFocused = true;
	};

	const onBlur: JSX.EventHandlerUnion<HTMLElement, FocusEvent> = (e) => {
		callHandler(e, mergedProps.onBlur);

		isFocused = false;
	};

	createEffect(
		() => textValue(),
		(textValue) => {
			if (isFocused) {
				clearAnnouncer("assertive");
				announce(textValue ?? "", "assertive");
			}
		},
		{ defer: true },
	);

	return (
		<Polymorphic<SpinButtonRootRenderProps>
			as="div"
			role="spinbutton"
			style={combineStyle(
				{
					"touch-action": "none",
				},
				mergedProps.style || undefined,
			)}
			aria-valuenow={
				mergedProps.value != null && !Number.isNaN(mergedProps.value)
					? mergedProps.value
					: undefined
			}
			aria-valuetext={textValue()}
			aria-valuemin={mergedProps.minValue}
			aria-valuemax={mergedProps.maxValue}
			aria-required={props.required ? "true" : undefined}
			aria-disabled={props.disabled ? "true" : undefined}
			aria-readonly={props.readOnly ? "true" : undefined}
			aria-invalid={
				mergedProps.validationState === "invalid" ? "true" : undefined
			}
			onKeyDown={onKeyDown}
			onFocus={onFocus}
			onBlur={onBlur}
			{...others}
		/>
	);
}
