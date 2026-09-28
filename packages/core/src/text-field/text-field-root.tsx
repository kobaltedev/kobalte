import type { ValidationState } from "@kobalte/utils";
import { createFormResetListener } from "@solid-primitives/form";
import { access } from "@solid-primitives/utils";
import type { JSX, ValidComponent } from "@solidjs/web";
import {
	createEffect,
	createSignal,
	createUniqueId,
	merge,
	omit,
	type Ref,
} from "solid-js";
import {
	createFormControl,
	FORM_CONTROL_PROP_NAMES,
	FormControlContext,
	type FormControlDataSet,
} from "../form-control/index.ts";
import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic/index.tsx";
import { createControllableSignal } from "../primitives/index.ts";
import {
	TextFieldContext,
	type TextFieldContextValue,
} from "./text-field-context.tsx";

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
	ref: Ref<T>;
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
	const [ref, setRef] = createSignal<HTMLElement | undefined>(undefined, {
		ownedWrite: true,
	});

	const defaultId = `textfield-${createUniqueId()}`;

	const mergedProps = merge({ id: defaultId }, props as TextFieldRootProps);

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
		value: () =>
			initialValue === undefined ? undefined : (mergedProps.value ?? ""),
		defaultValue: () => mergedProps.defaultValue,
		onChange: (value) => mergedProps.onChange?.(value),
	});

	const { formControlContext } = createFormControl(mergedProps);

	createFormResetListener(ref, () => setValue(mergedProps.defaultValue ?? ""));

	const [inputRef, setInputRef] = createSignal<
		HTMLInputElement | HTMLTextAreaElement | undefined
	>(undefined, { ownedWrite: true });

	// Bumped by every input event so the normalization below also runs when the
	// change was rejected, in which case the value signal never changes.
	const [inputEventCount, setInputEventCount] = createSignal(0, {
		ownedWrite: true,
	});

	let caretPosition: number | null | undefined;

	const onInput: JSX.EventHandlerUnion<
		HTMLInputElement | HTMLTextAreaElement,
		InputEvent
	> = (e) => {
		if (formControlContext.isReadOnly() || formControlContext.isDisabled()) {
			return;
		}

		const target = e.target as HTMLInputElement | HTMLTextAreaElement;

		// cache the cursor position in case we need to update the input's value.
		caretPosition = target.selectionStart;

		setValue(target.value);
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
			text: value(),
		}),
		({ input, text }) => {
			if (!input) return;

			const nextText = text ?? "";
			if (input.value === nextText) return;

			input.value = nextText;

			const position = Math.min(
				caretPosition ?? nextText.length,
				nextText.length,
			);
			input.setSelectionRange?.(position, position);
		},
	);

	const context: TextFieldContextValue = {
		value,
		inputRef,
		setInputRef,
		generateId: (suffix: string) => `${access(mergedProps.id)}-${suffix}`,
		onInput,
	};

	return (
		<FormControlContext value={formControlContext}>
			<TextFieldContext value={context}>
				<Polymorphic<TextFieldRootRenderProps>
					as="div"
					ref={[setRef, mergedProps.ref]}
					role="group"
					id={access(mergedProps.id)}
					{...formControlContext.dataset()}
					{...others}
				/>
			</TextFieldContext>
		</FormControlContext>
	);
}
