import {
	type ValidationState,
	access,
	createGenerateId,
	mergeDefaultProps,
	mergeRefs,
} from "@kobalte/utils";
import type { JSX, ValidComponent } from "@solidjs/web";
import { createUniqueId, omit } from "solid-js";

import {
	FORM_CONTROL_PROP_NAMES,
	FormControlContext,
	type FormControlDataSet,
	createFormControl,
} from "../form-control";
import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";
import { createFormResetListener } from "@solid-primitives/form";
import {
	createControllableSignal,
} from "../primitives";
import {
	TextFieldContext,
	type TextFieldContextValue,
} from "./text-field-context";

export interface TextFieldRootOptions {
	/** The controlled value of the text field. */
	value?: string;

	/**
	 * The default value when initially rendered.
	 * Useful when you do not need to control the value.
	 */
	defaultValue?: string;

	/** Event handler called when the value of the text field changes. */
	onChange?: (value: string) => void;

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

export interface TextFieldRootCommonProps<T extends HTMLElement = HTMLElement> {
	id: string;
	ref: T | ((el: T) => void);
}

export interface TextFieldRootRenderProps
	extends TextFieldRootCommonProps,
		FormControlDataSet {
	role: "group";
}

export type TextFieldRootProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = TextFieldRootOptions & Partial<TextFieldRootCommonProps<ElementOf<T>>>;

/**
 * A text input that allow users to input custom text entries with a keyboard.
 */
export function TextFieldRoot<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, TextFieldRootProps<T>>,
) {
	let ref: HTMLElement | undefined;

	const defaultId = `textfield-${createUniqueId()}`;

	const mergedProps = mergeDefaultProps(
		{ id: defaultId },
		props as TextFieldRootProps,
	);

	const others = omit(
		mergedProps,
		"ref",
		"value",
		"defaultValue",
		"onChange",
		...FORM_CONTROL_PROP_NAMES,
	);

	// Disable reactivity to only track controllability on first run
	// Our current implementation breaks with undefined (stops tracking controlled value)
	const initialValue = mergedProps.value;

	const [value, setValue] = createControllableSignal({
		value: () => (initialValue === undefined ? undefined : mergedProps.value ?? ""),
		defaultValue: () => mergedProps.defaultValue,
		onChange: (value) => mergedProps.onChange?.(value),
	});

	const { formControlContext } = createFormControl(mergedProps);

	createFormResetListener(
		() => ref,
		() => setValue(mergedProps.defaultValue ?? ""),
	);

	const onInput: JSX.EventHandlerUnion<
		HTMLInputElement | HTMLTextAreaElement,
		InputEvent
	> = (e) => {
		if (formControlContext.isReadOnly() || formControlContext.isDisabled()) {
			return;
		}

		const target = e.target as HTMLInputElement | HTMLTextAreaElement;

		setValue(target.value);

		// Unlike in React, inputs `value` can be out of sync with our value state.
		// even if an input is controlled (ex: `<input value="foo" />`,
		// typing on the input will change its internal `value`.
		//
		// To prevent this, we need to force the input `value` to be in sync with the text field value state.
		target.value = value() ?? "";
	};

	const context: TextFieldContextValue = {
		value,
		generateId: createGenerateId(() => access(mergedProps.id)!),
		onInput,
	};

	return (
		<FormControlContext value={formControlContext}>
			<TextFieldContext value={context}>
				<Polymorphic<TextFieldRootRenderProps>
					as="div"
					ref={mergeRefs((el) => (ref = el), mergedProps.ref)}
					role="group"
					id={access(mergedProps.id)}
					{...formControlContext.dataset()}
					{...others}
				/>
			</TextFieldContext>
		</FormControlContext>
	);
}
