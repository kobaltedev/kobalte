import { NumberFormatter, NumberParser } from "@internationalized/number";
import {
	getPrecision,
	snapValueToStep,
	type ValidationState,
} from "@kobalte/utils";
import { createFormResetListener } from "@solid-primitives/form";
import { access } from "@solid-primitives/utils";
import type { JSX, ValidComponent } from "@solidjs/web";
import {
	createEffect,
	createMemo,
	createSignal,
	createUniqueId,
	merge,
	omit,
	type Ref,
	untrack,
} from "solid-js";
import {
	createFormControl,
	FORM_CONTROL_PROP_NAMES,
	FormControlContext,
	type FormControlDataSet,
} from "../form-control/index.ts";
import { useLocale } from "../i18n/index.tsx";
import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic/index.tsx";
import { createControllableSignal } from "../primitives/index.ts";
import type { SpinButtonRootOptions } from "../spin-button/index.tsx";
import {
	NumberFieldContext,
	type NumberFieldContextValue,
} from "./number-field-context.tsx";

export interface NumberFieldRootOptions
	extends Pick<SpinButtonRootOptions, "textValue" | "translations"> {
	/** The controlled value of the number field. */
	value?: string | number;

	/**
	 * The default value when initially rendered.
	 * Useful when you do not need to control the value.
	 */
	defaultValue?: string | number;

	/**
	 * Event handler called when the value of the number field changes.
	 * Hands back the formatted string when `format` is `true`, and the raw
	 * number when it is `false`, so that a controlled round-trip
	 * (`value={count()}` paired with `onChange={setCount}`) keeps the type it
	 * was given. An empty field is reported as an empty string.
	 */
	onChange?: (value: string | number) => void;

	/** The controlled raw value of the number field. */
	rawValue?: number;

	/**
	 * Event handler called when the raw value of the number field changes.
	 * `NaN` is reported when the field is empty.
	 */
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
	ref: Ref<T>;
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
	const [ref, setRef] = createSignal<HTMLElement | undefined>(undefined, {
		ownedWrite: true,
	});

	const defaultId = `NumberField-${createUniqueId()}`;

	const mergedProps = merge(
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

	const formControlProps = omit(
		mergedProps,
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
		"allowedInput",
	) as unknown as typeof mergedProps;
	const others = omit(
		mergedProps,
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
		"allowedInput",
		...FORM_CONTROL_PROP_NAMES,
	);

	const { locale } = useLocale();

	const numberParser = createMemo(() => {
		return new NumberParser(locale(), mergedProps.formatOptions);
	});

	const numberFormatter = createMemo(() => {
		return new NumberFormatter(locale(), mergedProps.formatOptions);
	});

	const formatNumber = (number: number) =>
		mergedProps.format ? numberFormatter().format(number) : number.toString();

	const parseRawValue = (value: string | number | undefined) => {
		// An empty field is a state of its own: `Number("")` would report a zero,
		// which is below `minValue` and indistinguishable from a real one.
		if (value === undefined || (typeof value === "string" && value === "")) {
			return Number.NaN;
		}

		return mergedProps.format && typeof value !== "number"
			? numberParser().parse(value)
			: Number(value);
	};

	const isValidPartialValue = (value: string | number | undefined) =>
		mergedProps.format && typeof value !== "number"
			? numberParser().isValidPartialNumber(
					value ?? "",
					mergedProps.minValue,
					mergedProps.maxValue,
				)
			: !Number.isNaN(Number(value));

	const [value, setValue] = createControllableSignal({
		value: () => mergedProps.value,
		defaultValue: () => mergedProps.defaultValue ?? mergedProps.rawValue,
		onChange: (value) => {
			// Only a formatted value is reported as a string: an unformatted
			// field hands back the number, so feeding the result back into
			// `value` keeps the type the consumer gave it.
			mergedProps.onChange?.(
				typeof value === "number" && mergedProps.format
					? formatNumber(value)
					: value,
			);
		},
	});

	// The text the input shows.
	const displayValue = (): string => {
		const rawValue = parseRawValue(value());

		return value() === undefined || Number.isNaN(rawValue)
			? ""
			: formatNumber(rawValue);
	};

	function isAllowedInput(char: string): boolean {
		if (mergedProps.allowedInput !== undefined)
			return mergedProps.allowedInput.test(char);
		return true;
	}

	const { formControlContext } = createFormControl(formControlProps);

	createFormResetListener(ref, () => {
		setValue(mergedProps.defaultValue ?? "");
	});

	const [inputRef, setInputRef] = createSignal<HTMLInputElement | undefined>(
		undefined,
		{ ownedWrite: true },
	);
	const [hiddenInputRef, setHiddenInputRef] = createSignal<
		HTMLInputElement | undefined
	>(undefined, { ownedWrite: true });

	// Bumped by every input event so the normalization below also runs when the
	// change was rejected, in which case the value signal never changes.
	const [inputEventCount, setInputEventCount] = createSignal(0, {
		ownedWrite: true,
	});

	let caretPosition: number | null | undefined;

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

		caretPosition = cursorPosition;
		setInputEventCount((count) => count + 1);
	};

	// Unlike in React, inputs `value` can be out of sync with our value state.
	// even if an input is controlled (ex: `<input value="foo" />`,
	// typing on the input will change its internal `value`.
	//
	// To prevent this, we need to force the input `value` to be in sync with the text field value state.
	// This has to happen once the batch has been flushed: reading `value()` in
	// the input handler returns the value from before the write, which would put
	// the previous text back for the rest of the task.
	createEffect(
		() => ({
			input: inputRef(),
			inputEventCount: inputEventCount(),
			text: displayValue(),
		}),
		({ input, text }) => {
			if (!input || input.value === text) return;

			input.value = text;

			const position = Math.min(caretPosition ?? text.length, text.length);
			input.setSelectionRange?.(position, position);
		},
	);

	const context: NumberFieldContextValue = {
		value,
		setValue,
		rawValue: () => parseRawValue(value()),
		generateId: (suffix: string) => `${access(formControlProps.id)}-${suffix}`,
		formatNumber,
		displayValue,
		format: () => {
			if (!mergedProps.format) return;
			let rawValue = context.rawValue();

			if (Number.isNaN(rawValue)) {
				if (hiddenInputRef()) hiddenInputRef()!.value = "";
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
		textValue: () => mergedProps.textValue,
		minValue: () => mergedProps.minValue!,
		maxValue: () => mergedProps.maxValue!,
		step: () => mergedProps.step!,
		largeStep: () => mergedProps.largeStep ?? mergedProps.step! * 10,
		changeOnWheel: () => mergedProps.changeOnWheel!,
		translations: () => mergedProps.translations,
		inputRef,
		setInputRef,
		hiddenInputRef,
		setHiddenInputRef,
		varyValue: (offset) => {
			let rawValue = context.rawValue() ?? 0;
			if (Number.isNaN(rawValue)) rawValue = 0;

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
		},
	};

	createEffect(
		() => mergedProps.rawValue,
		(rawValue) => {
			if (rawValue !== untrack(context.rawValue)) {
				if (Number.isNaN(rawValue)) return;
				setValue(rawValue ?? "");
				context.format();
			}
		},
		{ defer: true },
	);

	// Reported from an effect, not from the render body: the consumer's
	// callback is owned by `<NumberField>`'s scope there, and writing state
	// from it throws `REACTIVE_WRITE_IN_OWNED_SCOPE` and halts reactivity.
	createEffect(
		() => {
			const text = value();
			return text === undefined ? undefined : parseRawValue(text);
		},
		(rawValue) => {
			if (rawValue === undefined) return;
			mergedProps.onRawValueChange?.(rawValue);
		},
	);

	return (
		<FormControlContext value={formControlContext}>
			<NumberFieldContext value={context}>
				<Polymorphic<NumberFieldRootRenderProps>
					as="div"
					ref={[setRef, mergedProps.ref]}
					role="group"
					id={access(formControlProps.id)}
					{...formControlContext.dataset()}
					{...others}
				/>
			</NumberFieldContext>
		</FormControlContext>
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
