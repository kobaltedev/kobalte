import {
	type ValidationState,
	access,
	createGenerateId,
	getPrecision,
	mergeDefaultProps,
	mergeRefs,
	snapValueToStep,
} from "@kobalte/utils";
import {
	type JSX,
	type ValidComponent,
	batch,
	createEffect,
	createMemo,
	createSignal,
	createUniqueId,
	on,
	splitProps,
} from "solid-js";

import { NumberFormatter, NumberParser } from "@internationalized/number";
import {
	FORM_CONTROL_PROP_NAMES,
	FormControlContext,
	type FormControlDataSet,
	createFormControl,
} from "../form-control";
import { useLocale } from "../i18n";
import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";
import {
	createControllableSignal,
	createFormResetListener,
} from "../primitives";
import type { SpinButtonRootOptions } from "../spin-button";
import {
	NumberFieldContext,
	type NumberFieldContextValue,
} from "./number-field-context";

export interface NumberFieldRootOptions
	extends Pick<SpinButtonRootOptions, "textValue" | "translations"> {
	/** The controlled formatted value of the number field. */
	value?: string | number;

	/**
	 * The default formatted value when initially rendered.
	 * Useful when you do not need to control the value.
	 */
	defaultValue?: string | number;

	/** Event handler called when the formatted value of the number field changes. */
	onChange?: (value: string) => void;

	/** The controlled raw value of the number field. */
	rawValue?: number;

	/** Event handler called when the raw value of the number field changes. */
	onRawValueChange?: (value: number) => void;

	/** The smallest value allowed, defaults to `Number.MIN_SAFE_INTEGER`. */
	minValue?: number;

	/** The largest value allowed, defaults to `Number.MAX_SAFE_INTEGER`. */
	maxValue?: number;

	/** Increment/Decrement step (Arrow). */
	step?: number;

	/** Increment/Decrement step (Page Up/Down), defaults `10 * step`. */
	largeStep?: number;

	/** Whether to increment/decrement on wheel. */
	changeOnWheel?: boolean;

	/** Whether to format the input value. */
	format?: boolean;

	/** Options for formatting input value. */
	formatOptions?: Intl.NumberFormatOptions;

	/** Allowed input characters, defaults to valid format characters. */
	allowedInput?: RegExp;

	/**
	 * A unique identifier for the component.
	 * The id is used to generate id attributes for nested components.
	 * If no id prop is provided, a generated id will be used.
	 */
	id?: string;

	/**
	 * The name of the text field, used when submitting an HTML form.
	 * See [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#htmlattrdefname).
	 */
	name?: string;

	/** Whether the text field should display its "valid" or "invalid" visual styling. */
	validationState?: ValidationState;

	/** Whether the user must fill the text field before the owning form can be submitted. */
	required?: boolean;

	/** Whether the text field is disabled. */
	disabled?: boolean;

	/** Whether the text field is read only. */
	readOnly?: boolean;
}

export interface NumberFieldRootCommonProps<
	T extends HTMLElement = HTMLElement,
> {
	id: string;
	ref: T | ((el: T) => void);
}

export interface NumberFieldRootRenderProps
	extends NumberFieldRootCommonProps,
		FormControlDataSet {
	role: "group";
}

export type NumberFieldRootProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = NumberFieldRootOptions & Partial<NumberFieldRootCommonProps<ElementOf<T>>>;

/**
 * A text input that allow users to input custom text entries with a keyboard.
 */
export function NumberFieldRoot<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, NumberFieldRootProps<T>>,
) {
	let ref: HTMLElement | undefined;

	const defaultId = `NumberField-${createUniqueId()}`;

	const mergedProps = mergeDefaultProps(
		{
			id: defaultId,
			format: true,
			minValue: Number.MIN_SAFE_INTEGER,
			maxValue: Number.MAX_SAFE_INTEGER,
			step: 1,
			changeOnWheel: true,
		},
		props as NumberFieldRootProps,
	);

	const [local, formControlProps, others] = splitProps(
		mergedProps,
		[
			"ref",
			"value",
			"defaultValue",
			"onChange",
			"rawValue",
			"onRawValueChange",
			"translations",
			"format",
			"formatOptions",
			"textValue",
			"minValue",
			"maxValue",
			"step",
			"largeStep",
			"changeOnWheel",
			"translations",
			"allowedInput",
		],
		FORM_CONTROL_PROP_NAMES,
	);

	const { locale } = useLocale();

	const numberParser = createMemo(() => {
		return new NumberParser(locale(), local.formatOptions);
	});

	const numberFormatter = createMemo(() => {
		return new NumberFormatter(locale(), local.formatOptions);
	});

	const formatNumber = (number: number) =>
		local.format ? numberFormatter().format(number) : number.toString();

	const parseRawValue = (value: string | number | undefined) =>
		local.format && typeof value !== "number"
			? numberParser().parse(value ?? "")
			: Number(value ?? "");

	const isValidPartialValue = (value: string | number | undefined) =>
		local.format && typeof value !== "number"
			? numberParser().isValidPartialNumber(
					value ?? "",
					mergedProps.minValue,
					mergedProps.maxValue,
				)
			: !Number.isNaN(Number(value));

	const [value, setValue] = createControllableSignal({
		value: () => local.value,
		defaultValue: () => local.defaultValue ?? local.rawValue,
		onChange: (value) => {
			local.onChange?.(typeof value === "number" ? formatNumber(value) : value);
			local.onRawValueChange?.(parseRawValue(value));
		},
	});

	if (value() !== undefined) local.onRawValueChange?.(parseRawValue(value()));

	function isAllowedInput(char: string): boolean {
		if (local.allowedInput !== undefined) return local.allowedInput.test(char);
		return true;
	}

	const { formControlContext } = createFormControl(formControlProps);

	createFormResetListener(
		() => ref,
		() => {
			setValue(local.defaultValue ?? "");
		},
	);

	const [inputRef, setInputRef] = createSignal<HTMLInputElement>();
	const [hiddenInputRef, setHiddenInputRef] = createSignal<HTMLInputElement>();
	const onInput: JSX.EventHandlerUnion<HTMLInputElement, InputEvent> = (e) => {
		if (formControlContext.isReadOnly() || formControlContext.isDisabled()) {
			return;
		}

		const target = e.target as HTMLInputElement;
		// cache the cursor position in case we need to update the input's value.
		let cursorPosition = target.selectionStart;

		if (isValidPartialValue(target.value)) {
			if (e.inputType !== "insertText" || isAllowedInput(e.data || "")) {
				setValue(target.value);
			}
		} else {
			if (e.inputType === "deleteContentBackward") {
				if (cursorPosition !== null) cursorPosition += 1;
			}
		}

		// Unlike in React, inputs `value` can be out of sync with our value state.
		// even if an input is controlled (ex: `<input value="foo" />`,
		// typing on the input will change its internal `value`.
		//
		// To prevent this, we need to force the input `value` to be in sync with the text field value state.
		const v = value();
		if (v !== target.value) {
			target.value = String(v ?? "");
			if (cursorPosition !== null) {
				target.selectionStart = cursorPosition;
				target.selectionEnd = cursorPosition;
			}
		}
	};

	const context: NumberFieldContextValue = {
		value,
		setValue,
		rawValue: () => parseRawValue(value()),
		generateId: createGenerateId(() => access(formControlProps.id)!),
		formatNumber,
		format: () => {
			if (!local.format) return;
			let rawValue = context.rawValue();

			if (Number.isNaN(rawValue)) {
				if (hiddenInputRef()) hiddenInputRef()!.value = "";
				local.onRawValueChange?.(rawValue);
				return;
			}

			if (context.minValue())
				rawValue = Math.max(rawValue, context.minValue()!);
			if (context.maxValue())
				rawValue = Math.min(rawValue, context.maxValue()!);

			const formattedValue = context.formatNumber(rawValue);

			// biome-ignore lint/suspicious/noDoubleEquals: loose comparison
			if (value() != formattedValue) setValue(formattedValue);
			if (inputRef()) inputRef()!.value = formattedValue;

			if (hiddenInputRef()) hiddenInputRef()!.value = String(rawValue);
		},
		onInput,
		textValue: () => local.textValue,
		minValue: () => local.minValue!,
		maxValue: () => local.maxValue!,
		step: () => local.step!,
		largeStep: () => local.largeStep ?? local.step! * 10,
		changeOnWheel: () => local.changeOnWheel!,
		translations: () => local.translations,
		inputRef,
		setInputRef,
		hiddenInputRef,
		setHiddenInputRef,
		varyValue: (offset) => {
			let rawValue = context.rawValue() ?? 0;
			if (Number.isNaN(rawValue)) rawValue = 0;

			batch(() => {
				let newValue = rawValue;

				const operation = offset > 0 ? "+" : "-";
				const localStep = Math.abs(offset);
				// If there was no min or max provided, don't use our default values
				// use NaN instead to help with the calculation which will use 0
				// instead for a NaN value
				const min =
					props.minValue === undefined ? Number.NaN : context.minValue();
				const max =
					props.maxValue === undefined ? Number.NaN : context.maxValue();

				// Try to snap the value to the nearest step
				newValue = snapValueToStep(rawValue, min, max, localStep);

				// If the value didn't change in the direction we wanted to,
				// then add the step and snap that value
				if (
					!(
						(operation === "+" && newValue > rawValue) ||
						(operation === "-" && newValue < rawValue)
					)
				) {
					newValue = snapValueToStep(
						handleDecimalOperation(operation, rawValue, localStep),
						min,
						max,
						localStep,
					);
				}

				context.setValue(newValue);
				context.format();
			});
		},
	};

	createEffect(
		on(
			() => local.rawValue,
			(rawValue) => {
				if (rawValue !== context.rawValue()) {
					if (Number.isNaN(rawValue)) return;
					batch(() => {
						setValue(rawValue ?? "");
						context.format();
					});
				}
			},
			{ defer: true },
		),
	);

	return (
		<FormControlContext.Provider value={formControlContext}>
			<NumberFieldContext.Provider value={context}>
				<Polymorphic<NumberFieldRootRenderProps>
					as="div"
					ref={mergeRefs((el) => (ref = el), local.ref)}
					role="group"
					id={access(formControlProps.id)}
					{...formControlContext.dataset()}
					{...others}
				/>
			</NumberFieldContext.Provider>
		</FormControlContext.Provider>
	);
}

function handleDecimalOperation(
	operator: "-" | "+",
	value1: number,
	value2: number,
): number {
	let result = operator === "+" ? value1 + value2 : value1 - value2;
	if (
		Number.isFinite(value1) &&
		Number.isFinite(value2) &&
		(value2 % 1 !== 0 || value1 % 1 !== 0)
	) {
		const offsetPrecision = getPrecision(value2);
		const valuePrecision = getPrecision(value1);

		const multiplier = 10 ** Math.max(offsetPrecision, valuePrecision);

		const multipliedOffset = Math.round(value2 * multiplier);
		const multipliedValue = Math.round(value1 * multiplier);

		const next =
			operator === "+"
				? multipliedValue + multipliedOffset
				: multipliedValue - multipliedOffset;

		// Undo multiplier to get the new value
		result = next / multiplier;
	}

	return result;
}
