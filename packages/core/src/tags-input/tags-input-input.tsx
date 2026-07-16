import { callHandler, mergeDefaultProps, mergeRefs } from "@kobalte/utils";
import type { JSX, ValidComponent } from "@solidjs/web";
import { omit } from "solid-js";
import {
	createFormControlField,
	FORM_CONTROL_FIELD_PROP_NAMES,
	type FormControlDataSet,
	useFormControlContext,
} from "../form-control";
import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";
import { useTagsInputContext } from "./tags-input-context";

export interface TagsInputInputOptions {}

export interface TagsInputInputCommonProps<
	T extends HTMLElement = HTMLInputElement,
> {
	id: string;
	ref: T | ((el: T) => void);
	onInput: JSX.EventHandlerUnion<T, InputEvent>;
	onKeyDown: JSX.EventHandlerUnion<T, KeyboardEvent>;
	onPaste: JSX.EventHandlerUnion<T, ClipboardEvent>;
	onBlur: JSX.EventHandlerUnion<T, FocusEvent>;
	"aria-label": string | undefined;
	"aria-labelledby": string | undefined;
	"aria-describedby": string | undefined;
}

export interface TagsInputInputRenderProps
	extends TagsInputInputCommonProps,
		FormControlDataSet {
	value: string;
	type: "text";
	disabled: boolean | undefined;
	required: boolean | undefined;
	readonly: boolean | undefined;
	"aria-invalid": "true" | undefined;
	"aria-required": "true" | undefined;
	"aria-disabled": "true" | undefined;
	"aria-readonly": "true" | undefined;
}

export type TagsInputInputProps<
	T extends ValidComponent | HTMLElement = HTMLInputElement,
> = TagsInputInputOptions &
	Partial<TagsInputInputCommonProps<ElementOf<T>>>;

export function TagsInputInput<T extends ValidComponent = "input">(
	props: PolymorphicProps<T, TagsInputInputProps<T>>,
) {
	const formControlContext = useFormControlContext();
	const context = useTagsInputContext();

	const mergedProps = mergeDefaultProps(
		{ id: context.generateId("input") },
		props as TagsInputInputProps,
	);

	const formControlFieldProps = omit(
		mergedProps,
		"ref",
		"onInput",
		"onKeyDown",
		"onPaste",
		"onBlur",
	);
	const others = omit(
		mergedProps,
		"ref",
		"onInput",
		"onKeyDown",
		"onPaste",
		"onBlur",
		"id",
		"aria-label",
		"aria-labelledby",
		"aria-describedby",
	);

	const { fieldProps } = createFormControlField(formControlFieldProps);

	const isInteractive = () =>
		!formControlContext.isDisabled() && !formControlContext.isReadOnly();

	const commitSegments = (raw: string, target: HTMLInputElement) => {
		const segments = raw.split(context.delimiter());

		// All but the last segment are complete tags; the last segment is what
		// stays in the input (it may still be empty, or mid-typing).
		const remainder = segments.pop() ?? "";

		for (const segment of segments) {
			context.addTagValue(segment);
		}

		context.setInputValue(remainder);

		// The browser already applied the raw (pre-split) text to the DOM
		// input outside of Solid's reactivity. If the computed remainder is
		// unchanged from the signal's previous value (e.g. both are ""),
		// Solid's `value` binding sees no diff and won't touch the DOM again
		// — so sync it explicitly to avoid leaving stale text visible.
		target.value = remainder;
	};

	const onInput: JSX.EventHandlerUnion<HTMLInputElement, InputEvent> = (e) => {
		callHandler(e, mergedProps.onInput);

		if (!isInteractive()) {
			return;
		}

		const target = e.target as HTMLInputElement;

		// A paste we don't want to auto-split is delivered as a single
		// "insertFromPaste" input event; accept it as plain text.
		if (e.inputType === "insertFromPaste" && !context.addOnPaste()) {
			context.setInputValue(target.value);
			return;
		}

		commitSegments(target.value, target);
	};

	const onKeyDown: JSX.EventHandlerUnion<HTMLInputElement, KeyboardEvent> = (
		e,
	) => {
		callHandler(e, mergedProps.onKeyDown);

		if (!isInteractive()) {
			return;
		}

		switch (e.key) {
			case "Enter": {
				e.preventDefault();

				const text = context.inputValue();

				if (text !== "" && context.addTagValue(text)) {
					context.setInputValue("");
				}

				break;
			}
			case "Backspace": {
				if (context.inputValue() === "" && context.value().length > 0) {
					context.removeTagAt(context.value().length - 1);
				}

				break;
			}
			case "ArrowLeft": {
				const target = e.currentTarget as HTMLInputElement;

				if (
					context.value().length > 0 &&
					target.selectionStart === 0 &&
					target.selectionEnd === 0
				) {
					e.preventDefault();
					context.focusItemAt(context.value().length - 1);
				}

				break;
			}
		}
	};

	const onPaste: JSX.EventHandlerUnion<HTMLInputElement, ClipboardEvent> = (
		e,
	) => {
		callHandler(e, mergedProps.onPaste);

		if (!isInteractive() || !context.addOnPaste()) {
			return;
		}

		e.preventDefault();

		const text = e.clipboardData?.getData("text") ?? "";

		commitSegments(context.inputValue() + text, e.currentTarget as HTMLInputElement);
	};

	const onBlur: JSX.EventHandlerUnion<HTMLInputElement, FocusEvent> = (e) => {
		callHandler(e, mergedProps.onBlur);

		if (!isInteractive()) {
			return;
		}

		const text = context.inputValue();

		if (text === "") {
			return;
		}

		if (context.blurBehavior() === "add") {
			if (context.addTagValue(text)) {
				context.setInputValue("");
			}
		} else if (context.blurBehavior() === "clear") {
			context.setInputValue("");
		}
	};

	return (
		<Polymorphic<TagsInputInputRenderProps>
			as="input"
			ref={mergeRefs(context.setInputRef, mergedProps.ref)}
			id={fieldProps.id()}
			value={context.inputValue()}
			type="text"
			disabled={formControlContext.isDisabled()}
			required={formControlContext.isRequired()}
			readonly={formControlContext.isReadOnly()}
			aria-label={fieldProps.ariaLabel()}
			aria-labelledby={fieldProps.ariaLabelledBy()}
			aria-describedby={fieldProps.ariaDescribedBy()}
			aria-invalid={
				formControlContext.validationState() === "invalid" ? "true" : undefined
			}
			aria-required={formControlContext.isRequired() ? "true" : undefined}
			aria-disabled={formControlContext.isDisabled() ? "true" : undefined}
			aria-readonly={formControlContext.isReadOnly() ? "true" : undefined}
			onInput={onInput}
			onKeyDown={onKeyDown}
			onPaste={onPaste}
			onBlur={onBlur}
			{...formControlContext.dataset()}
			{...others}
		/>
	);
}
