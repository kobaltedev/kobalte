import {
	OverrideComponentProps,
	ValidationState,
	access,
	createGenerateId,
	mergeDefaultProps,
	mergeRefs,
} from "@kobalte/utils";
import {
	JSX,
	createMemo,
	createSignal,
	createUniqueId,
	splitProps,
} from "solid-js";

import { NumberFormatter, NumberParser } from "@internationalized/number";
import {
	FORM_CONTROL_PROP_NAMES,
	FormControlContext,
	createFormControl,
} from "../form-control";
import { useLocale } from "../i18n";
import { AsChildProp, Polymorphic } from "../polymorphic";
import {
	createControllableSignal,
	createFormResetListener,
} from "../primitives";
import { SpinButtonRootOptions } from "../spin-button";
import {
	NumberFieldContext,
	NumberFieldContextValue,
} from "./number-field-context";

export interface NumberFieldRootOptions
	extends Pick<SpinButtonRootOptions, "textValue" | "translations">,
		AsChildProp {
	/** The controlled formatted value of the text field. */
	value?: number | string;

	/**
	 * The default formatted value when initially rendered.
	 * Useful when you do not need to control the value.
	 */
	defaultValue?: number | string;

	/** Event handler called when the formatted value of the text field changes. */
	onChange?: (value: number | string) => void;

	/** Event handler called when the raw value of the text field changes. */
	onRawValueChange?: (value: number) => void;

	/** The smallest value allowed, defaults to `Number.MIN_SAFE_INTEGER`. */
	minValue?: number;

	/** The largest value allowed, defaults to `Number.MAX_SAFE_INTEGER`. */
	maxValue?: number;

	/** Increment/Decrement step (Arrow) */
	step?: number;

	/** Increment/Decrement step (Page Up/Down), defaults `10 * step` */
	largeStep?: number;

	/** Whether to increment/decrement on wheel */
	changeOnWheel?: boolean;

	/** Whether to format the input value */
	format?: boolean;

	/** Options for formatting input value */
	formatOptions?: Intl.NumberFormatOptions;

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

export interface NumberFieldRootProps
	extends OverrideComponentProps<"div", NumberFieldRootOptions> {}

/**
 * A text input that allow users to input custom text entries with a keyboard.
 */
export function NumberFieldRoot(props: NumberFieldRootProps) {
	let ref: HTMLDivElement | undefined;

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
		props,
	);

	const [local, formControlProps, others] = splitProps(
		mergedProps,
		[
			"ref",
			"value",
			"defaultValue",
			"onChange",
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

	const parseRawValue = (value: string | number | undefined) =>
		local.format
			? numberParser().parse(String(value ?? ""))
			: Number(value ?? "");

	const [value, setValue] = createControllableSignal({
		value: () => local.value,
		defaultValue: () => local.defaultValue,
		onChange: (value) => {
			local.onChange?.(value);
			local.onRawValueChange?.(parseRawValue(value));
		},
	});

	const { formControlContext } = createFormControl(formControlProps);

	createFormResetListener(
		() => ref,
		() => {
			setValue(local.defaultValue ?? "");
			// @ts-ignore
			setValue(local.defaultValue);
		},
	);

	const onInput: JSX.EventHandlerUnion<HTMLInputElement, InputEvent> = (e) => {
		if (formControlContext.isReadOnly() || formControlContext.isDisabled()) {
			return;
		}

		const target = e.target as HTMLInputElement;

		setValue(target.value);

		// Unlike in React, inputs `value` can be out of sync with our value state.
		// even if an input is controlled (ex: `<input value="foo" />`,
		// typing on the input will change its internal `value`.
		//
		// To prevent this, we need to force the input `value` to be in sync with the text field value state.
		target.value = String(value() ?? "");
	};

	const [inputRef, setInputRef] = createSignal<HTMLInputElement>();
	const [hiddenInputRef, setHiddenInputRef] = createSignal<HTMLInputElement>();

	const context: NumberFieldContextValue = {
		value,
		setValue,
		rawValue: () => parseRawValue(value()),
		generateId: createGenerateId(() => access(formControlProps.id)!),
		format: () => {
			if (!local.format) return;
			let rawValue = context.rawValue();
			if (Number.isNaN(rawValue)) return;

			if (context.minValue())
				rawValue = Math.max(rawValue, context.minValue()!);
			if (context.maxValue())
				rawValue = Math.min(rawValue, context.maxValue()!);

			const formattedValue = numberFormatter().format(rawValue);

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
			const rawValue = context.rawValue() || 0;
			if (Number.isNaN(rawValue)) return;

			context.setValue(rawValue + offset);
			context.format();
		},
	};

	return (
		<FormControlContext.Provider value={formControlContext}>
			<NumberFieldContext.Provider value={context}>
				<Polymorphic
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
