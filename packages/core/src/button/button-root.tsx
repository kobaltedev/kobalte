/*
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/a13802d8be6f83af1450e56f7a88527b10d9cadf/packages/@react-aria/button/src/useButton.ts
 *
 * Portions of this file are based on code from ariakit.
 * MIT Licensed, Copyright (c) Diego Haz.
 *
 * Credits to the Ariakit team:
 * https://github.com/ariakit/ariakit/blob/8a13899ff807bbf39f3d89d2d5964042ba4d5287/packages/ariakit/src/button/button.ts
 */

import { mergeDefaultProps, mergeRefs } from "@kobalte/utils";
import { type ValidComponent, createMemo, splitProps } from "solid-js";

import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";
import { createTagName } from "../primitives";
import { isButton } from "./is-button";

export interface ButtonRootOptions {}

export interface ButtonRootCommonProps<T extends HTMLElement = HTMLElement> {
	/** Whether the button is disabled. */
	disabled: boolean | undefined;
	type: string | undefined;
	ref: T | ((el: T) => void);
	tabIndex: number | string | undefined;
}

export interface ButtonRootRenderProps extends ButtonRootCommonProps {
	role: "menuitem" | "button" | undefined;
	"aria-disabled": boolean | undefined;
	"data-disabled": string | undefined;
}

export type ButtonRootProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = ButtonRootOptions & Partial<ButtonRootCommonProps<ElementOf<T>>>;

/**
 * Button enables users to trigger an action or event, such as submitting a form,
 * opening a dialog, canceling an action, or performing a delete operation.
 * This component is based on the [WAI-ARIA Button Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/button/)
 */
export function ButtonRoot<T extends ValidComponent = "button">(
	props: PolymorphicProps<T, ButtonRootProps<T>>,
) {
	let ref: HTMLElement | undefined;

	const mergedProps = mergeDefaultProps(
		{ type: "button" },
		props as ButtonRootProps,
	);

	const [local, others] = splitProps(mergedProps, ["ref", "type", "disabled"]);

	const tagName = createTagName(
		() => ref,
		() => "button",
	);

	const isNativeButton = createMemo(() => {
		const elementTagName = tagName();

		if (elementTagName == null) {
			return false;
		}

		return isButton({ tagName: elementTagName, type: local.type });
	});

	const isNativeInput = createMemo(() => {
		return tagName() === "input";
	});

	const isNativeLink = createMemo(() => {
		return tagName() === "a" && ref?.getAttribute("href") != null;
	});

	return (
		<Polymorphic<ButtonRootRenderProps>
			as="button"
			ref={mergeRefs((el) => (ref = el), local.ref)}
			type={isNativeButton() || isNativeInput() ? local.type : undefined}
			role={!isNativeButton() && !isNativeLink() ? "button" : undefined}
			tabIndex={
				!isNativeButton() && !isNativeLink() && !local.disabled ? 0 : undefined
			}
			disabled={
				isNativeButton() || isNativeInput() ? local.disabled : undefined
			}
			aria-disabled={
				!isNativeButton() && !isNativeInput() && local.disabled
					? true
					: undefined
			}
			data-disabled={local.disabled ? "" : undefined}
			{...others}
		/>
	);
}
