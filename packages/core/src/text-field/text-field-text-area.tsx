/*
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/0af91c08c745f4bb35b6ad4932ca17a0d85dd02c/packages/@react-aria/textfield/src/useTextField.ts
 * https://github.com/adobe/react-spectrum/blob/0af91c08c745f4bb35b6ad4932ca17a0d85dd02c/packages/@react-spectrum/textfield/src/TextArea.tsx
 */

import { composeEventHandlers } from "@kobalte/utils";
import type { JSX, ValidComponent } from "@solidjs/web";
import {
	type Component,
	createEffect,
	createSignal,
	merge,
	omit,
	type Ref,
} from "solid-js";
import type { ElementOf, PolymorphicProps } from "../polymorphic/index.tsx";

import { useTextFieldContext } from "./text-field-context.tsx";
import {
	TextFieldInputBase,
	type TextFieldInputCommonProps,
	type TextFieldInputRenderProps,
} from "./text-field-input.tsx";

export interface TextFieldTextAreaOptions {
	/** Whether the textarea should adjust its height when the value changes. */
	autoResize?: boolean;

	/** Whether the form should be submitted when the user presses the enter key. */
	submitOnEnter?: boolean;
}

export interface TextFieldTextAreaCommonProps<
	T extends HTMLElement = HTMLElement,
> extends TextFieldInputCommonProps<T> {
	ref: Ref<T>;
	onKeyPress: JSX.EventHandlerUnion<T, KeyboardEvent>;
}

export interface TextFieldTextAreaRenderProps
	extends TextFieldTextAreaCommonProps,
		TextFieldInputRenderProps {
	"aria-multiline": string | undefined;
}

export type TextFieldTextAreaProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = TextFieldTextAreaOptions &
	Partial<TextFieldTextAreaCommonProps<ElementOf<T>>>;

/**
 * The native html textarea of the textfield.
 */
export function TextFieldTextArea<T extends ValidComponent = "textarea">(
	props: PolymorphicProps<T, TextFieldTextAreaProps<T>>,
) {
	const [ref, setRef] = createSignal<HTMLTextAreaElement | undefined>(
		undefined,
		{ ownedWrite: true },
	);

	const context = useTextFieldContext();

	const mergedProps = merge(
		{
			id: context.generateId("textarea"),
		},
		props as TextFieldTextAreaProps,
	);

	const others = omit(
		mergedProps,
		"ref",
		"autoResize",
		"submitOnEnter",
		"onKeyPress",
	);

	createEffect(
		() => ({ autoResize: mergedProps.autoResize, value: context.value() }),
		({ autoResize }) => {
			const el = ref();
			if (!el || !autoResize) return;
			adjustHeight(el);
		},
	);

	const onKeyPress = (event: KeyboardEvent) => {
		const el = ref();
		if (
			el &&
			mergedProps.submitOnEnter &&
			event.key === "Enter" &&
			!event.shiftKey
		) {
			if (el.form) {
				el.form.requestSubmit();
				event.preventDefault();
			}
		}
	};

	return (
		<TextFieldInputBase<
			Component<
				Omit<TextFieldTextAreaRenderProps, keyof TextFieldInputRenderProps>
			>
		>
			as="textarea"
			aria-multiline={mergedProps.submitOnEnter ? "false" : undefined}
			onKeyPress={composeEventHandlers([mergedProps.onKeyPress, onKeyPress])}
			ref={[setRef, mergedProps.ref]}
			{...others}
		/>
	);
}

/**
 * Adjust the height of the textarea based on its text value.
 */
function adjustHeight(el: HTMLElement) {
	const prevAlignment = el.style.alignSelf;
	const prevOverflow = el.style.overflow;

	// Firefox scroll position is lost when `overflow: 'hidden'` is applied, so we skip applying it.
	// The measure/applied height is also incorrect/reset if we turn on and off
	// overflow: hidden in Firefox https://bugzilla.mozilla.org/show_bug.cgi?id=1787062
	const isFirefox = "MozAppearance" in el.style;
	if (!isFirefox) {
		el.style.overflow = "hidden";
	}

	el.style.alignSelf = "start";
	el.style.height = "auto";

	// offsetHeight - clientHeight accounts for the border/padding.
	el.style.height = `${
		el.scrollHeight + (el.offsetHeight - el.clientHeight)
	}px`;
	el.style.overflow = prevOverflow;
	el.style.alignSelf = prevAlignment;
}
