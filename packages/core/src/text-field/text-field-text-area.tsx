/*
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/0af91c08c745f4bb35b6ad4932ca17a0d85dd02c/packages/@react-aria/textfield/src/useTextField.ts
 * https://github.com/adobe/react-spectrum/blob/0af91c08c745f4bb35b6ad4932ca17a0d85dd02c/packages/@react-spectrum/textfield/src/TextArea.tsx
 */

import {
	composeEventHandlers,
	mergeDefaultProps,
	mergeRefs,
} from "@kobalte/utils";
import {
	type Component,
	type JSX,
	type ValidComponent,
	createEffect,
	on,
	splitProps,
} from "solid-js";
import type { ElementOf, PolymorphicProps } from "../polymorphic";

import { useTextFieldContext } from "./text-field-context";
import {
	TextFieldInputBase,
	type TextFieldInputCommonProps,
	type TextFieldInputRenderProps,
} from "./text-field-input";

export interface TextFieldTextAreaOptions {
	/** Whether the textarea should adjust its height when the value changes. */
	autoResize?: boolean;

	/** Whether the form should be submitted when the user presses the enter key. */
	submitOnEnter?: boolean;
}

export interface TextFieldTextAreaCommonProps<
	T extends HTMLElement = HTMLElement,
> extends TextFieldInputCommonProps<T> {
	ref: T | ((el: T) => void);
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
	let ref: HTMLElement | undefined;

	const context = useTextFieldContext();

	const mergedProps = mergeDefaultProps(
		{
			id: context.generateId("textarea"),
		},
		props as TextFieldTextAreaProps,
	);

	const [local, others] = splitProps(mergedProps, [
		"ref",
		"autoResize",
		"submitOnEnter",
		"onKeyPress",
	]);

	createEffect(
		on(
			[() => ref, () => local.autoResize, () => context.value()],
			([ref, autoResize]) => {
				if (!ref || !autoResize) {
					return;
				}

				adjustHeight(ref);
			},
		),
	);

	const onKeyPress = (event: KeyboardEvent) => {
		if (
			ref &&
			local.submitOnEnter &&
			event.key === "Enter" &&
			!event.shiftKey
		) {
			if ((ref as HTMLTextAreaElement).form) {
				(ref as HTMLTextAreaElement).form!.requestSubmit();
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
			aria-multiline={local.submitOnEnter ? "false" : undefined}
			onKeyPress={composeEventHandlers([local.onKeyPress, onKeyPress])}
			ref={mergeRefs((el) => (ref = el), local.ref) as any}
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
