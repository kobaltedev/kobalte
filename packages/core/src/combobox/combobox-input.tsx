/*
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/ba727bdc0c4a57626131e84d9c9b661d0b65b754/packages/@react-stately/combobox/src/useComboBoxState.ts
 * https://github.com/adobe/react-spectrum/blob/ba727bdc0c4a57626131e84d9c9b661d0b65b754/packages/@react-aria/combobox/src/useComboBox.ts
 */

import {
	callHandler,
	contains,
	mergeDefaultProps,
	mergeRefs,
} from "@kobalte/utils";
import { type JSX, type ValidComponent, splitProps } from "solid-js";

import {
	FORM_CONTROL_FIELD_PROP_NAMES,
	type FormControlDataSet,
	createFormControlField,
	useFormControlContext,
} from "../form-control";
import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";
import { useComboboxContext } from "./combobox-context";

export interface ComboboxInputOptions {}

export interface ComboboxInputCommonProps<
	T extends HTMLElement = HTMLInputElement,
> {
	id: string;
	ref: T | ((el: T) => void);
	onInput: JSX.EventHandlerUnion<T, InputEvent>;
	onKeyDown: JSX.EventHandlerUnion<T, KeyboardEvent>;
	onClick: JSX.EventHandlerUnion<T, MouseEvent>;
	onFocus: JSX.EventHandlerUnion<T, FocusEvent>;
	onBlur: JSX.EventHandlerUnion<T, FocusEvent>;
	onTouchEnd: JSX.EventHandlerUnion<T, TouchEvent>;
	disabled: boolean | undefined;
	"aria-label": string | undefined;
	"aria-labelledby": string | undefined;
	"aria-describedby": string | undefined;
}

export interface ComboboxInputRenderProps
	extends ComboboxInputCommonProps,
		FormControlDataSet {
	value: string | undefined;
	required: boolean | undefined;
	readonly: boolean | undefined;
	placeholder: JSX.Element;
	"aria-invalid": boolean | undefined;
	"aria-required": boolean | undefined;
	"aria-disabled": boolean | undefined;
	"aria-readonly": boolean | undefined;
	type: "text";
	role: "combobox";
	autoComplete: "off";
	autoCorrect: "off";
	spellCheck: "false";
	"aria-haspopup": "listbox";
	"aria-autocomplete": "list";
	"aria-expanded": boolean;
	"aria-controls": string | undefined;
	"aria-activedescendant": string | undefined;
}

export type ComboboxInputProps<
	T extends ValidComponent | HTMLElement = HTMLInputElement,
> = ComboboxInputOptions & Partial<ComboboxInputCommonProps<ElementOf<T>>>;

export function ComboboxInput<T extends ValidComponent = "input">(
	props: PolymorphicProps<T, ComboboxInputProps<T>>,
) {
	let ref: HTMLInputElement | undefined;

	const formControlContext = useFormControlContext();
	const context = useComboboxContext();

	const mergedProps = mergeDefaultProps(
		{
			id: context.generateId("input"),
		},
		props as ComboboxInputProps,
	);

	const [local, formControlFieldProps, others] = splitProps(
		mergedProps,
		[
			"ref",
			"disabled",
			"onClick",
			"onInput",
			"onKeyDown",
			"onFocus",
			"onBlur",
			"onTouchEnd",
		],
		FORM_CONTROL_FIELD_PROP_NAMES,
	);

	const collection = () => context.listState().collection();
	const selectionManager = () => context.listState().selectionManager();

	const isDisabled = () => {
		return (
			local.disabled || context.isDisabled() || formControlContext.isDisabled()
		);
	};

	const { fieldProps } = createFormControlField(formControlFieldProps);

	const onClick: JSX.EventHandlerUnion<HTMLInputElement, MouseEvent> = (e) => {
		callHandler(e, local.onClick);

		if (context.triggerMode() === "focus" && !context.isOpen()) {
			context.open(false, "focus");
		}
	};

	const onInput: JSX.EventHandlerUnion<HTMLInputElement, InputEvent> = (e) => {
		callHandler(e, local.onInput);

		if (formControlContext.isReadOnly() || isDisabled()) {
			return;
		}

		const target = e.target as HTMLInputElement;

		context.setInputValue(target.value);

		// Unlike in React, inputs `value` can be out of sync with our value state.
		// even if an input is controlled (ex: `<input value="foo" />`,
		// typing on the input will change its internal `value`.
		//
		// To prevent this, we need to force the input `value` to be in sync with the input value state.
		target.value = context.inputValue() ?? "";

		if (context.isOpen()) {
			if (collection().getSize() <= 0 && !context.allowsEmptyCollection()) {
				context.close();
			}
		} else {
			if (collection().getSize() > 0 || context.allowsEmptyCollection()) {
				context.open(false, "input");
			}
		}
	};

	const onKeyDown: JSX.EventHandlerUnion<HTMLInputElement, KeyboardEvent> = (
		e,
	) => {
		callHandler(e, local.onKeyDown);

		if (formControlContext.isReadOnly() || isDisabled()) {
			return;
		}

		if (context.isOpen()) {
			callHandler(e, context.onInputKeyDown);
		}

		switch (e.key) {
			case "Enter":
				// Prevent form submission if menu is open since we may be selecting an option.
				if (context.isOpen()) {
					e.preventDefault();

					const focusedKey = selectionManager().focusedKey();

					if (focusedKey != null) {
						selectionManager().select(focusedKey);
					}
				}

				break;
			case "Tab":
				if (context.isOpen()) {
					context.close();
					context.resetInputValue(
						context.listState().selectionManager().selectedKeys(),
					);
				}
				break;
			case "Escape":
				if (context.isOpen()) {
					context.close();
					context.resetInputValue(
						context.listState().selectionManager().selectedKeys(),
					);
				} else {
					// trigger a remove selection.
					context.setInputValue("");
				}
				break;
			case "ArrowDown":
				if (!context.isOpen()) {
					context.open(e.altKey ? false : "first", "manual");
				}
				break;
			case "ArrowUp":
				if (!context.isOpen()) {
					context.open("last", "manual");
				} else {
					if (e.altKey) {
						context.close();
						context.resetInputValue(
							context.listState().selectionManager().selectedKeys(),
						);
					}
				}
				break;
			case "ArrowLeft":
			case "ArrowRight":
				selectionManager().setFocusedKey(undefined);
				break;
			case "Backspace":
				// Remove last selection in multiple mode if input is empty.
				if (
					context.removeOnBackspace() &&
					selectionManager().selectionMode() === "multiple" &&
					context.inputValue() === ""
				) {
					const lastSelectedKey =
						[...selectionManager().selectedKeys()].pop() ?? "";
					selectionManager().toggleSelection(lastSelectedKey);
				}
				break;
		}
	};

	const onFocus: JSX.EventHandlerUnion<HTMLInputElement, FocusEvent> = (e) => {
		callHandler(e, local.onFocus);

		if (context.isInputFocused()) {
			return;
		}

		context.setIsInputFocused(true);
	};

	const onBlur: JSX.EventHandlerUnion<HTMLInputElement, FocusEvent> = (e) => {
		callHandler(e, local.onBlur);

		// Ignore blur if focused moved into the control or menu.
		if (
			contains(context.controlRef(), e.relatedTarget as any) ||
			contains(context.contentRef(), e.relatedTarget as any)
		) {
			return;
		}

		context.setIsInputFocused(false);
	};

	// If a touch happens on direct center of Combobox input, might be virtual click from iPad so open ComboBox menu
	let lastEventTime = 0;

	const onTouchEnd: JSX.EventHandlerUnion<HTMLInputElement, TouchEvent> = (
		e,
	) => {
		callHandler(e, local.onTouchEnd);

		if (!ref || formControlContext.isReadOnly() || isDisabled()) {
			return;
		}

		// Sometimes VoiceOver on iOS fires two touchend events in quick succession. Ignore the second one.
		if (e.timeStamp - lastEventTime < 500) {
			e.preventDefault();
			ref.focus();
			return;
		}

		const rect = e.target.getBoundingClientRect();
		const touch = e.changedTouches[0];

		const centerX = Math.ceil(rect.left + 0.5 * rect.width);
		const centerY = Math.ceil(rect.top + 0.5 * rect.height);

		if (touch.clientX === centerX && touch.clientY === centerY) {
			e.preventDefault();
			ref.focus();
			context.toggle(false, "manual");

			lastEventTime = e.timeStamp;
		}
	};

	// Omit `formControlContext.name()` here because it's used in the hidden select.
	return (
		<Polymorphic<ComboboxInputRenderProps>
			as="input"
			ref={mergeRefs((el) => {
				context.setInputRef(el);
				ref = el;
			}, local.ref)}
			id={fieldProps.id()}
			value={context.inputValue()}
			required={formControlContext.isRequired()}
			disabled={formControlContext.isDisabled()}
			readonly={formControlContext.isReadOnly()}
			placeholder={context.placeholder()}
			type="text"
			role="combobox"
			autoComplete="off"
			autoCorrect="off"
			spellCheck="false"
			aria-haspopup="listbox"
			aria-autocomplete="list"
			aria-expanded={context.isOpen()}
			aria-controls={context.isOpen() ? context.listboxId() : undefined}
			aria-activedescendant={context.activeDescendant()}
			aria-label={fieldProps.ariaLabel()}
			aria-labelledby={fieldProps.ariaLabelledBy()}
			aria-describedby={fieldProps.ariaDescribedBy()}
			aria-invalid={
				formControlContext.validationState() === "invalid" || undefined
			}
			aria-required={formControlContext.isRequired() || undefined}
			aria-disabled={formControlContext.isDisabled() || undefined}
			aria-readonly={formControlContext.isReadOnly() || undefined}
			onClick={onClick}
			onInput={onInput}
			onKeyDown={onKeyDown}
			onFocus={onFocus}
			onBlur={onBlur}
			onTouchEnd={onTouchEnd}
			{...context.dataset()}
			{...formControlContext.dataset()}
			{...others}
		/>
	);
}
