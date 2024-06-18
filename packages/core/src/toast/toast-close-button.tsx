/*
 * Portions of this file are based on code from radix-ui-primitives.
 * MIT Licensed, Copyright (c) 2022 WorkOS.
 *
 * Credits to the Radix UI team:
 * https://github.com/radix-ui/primitives/blob/72018163e1fdb79b51d322d471c8fc7d14df2b59/packages/react/toast/src/Toast.tsx
 */

import { callHandler } from "@kobalte/utils";
import {
	type Component,
	type JSX,
	type ValidComponent,
	splitProps,
} from "solid-js";

import * as Button from "../button";
import type { ElementOf, PolymorphicProps } from "../polymorphic";
import { useToastContext } from "./toast-context";

export interface ToastCloseButtonOptions {}

export interface ToastCloseButtonCommonProps<
	T extends HTMLElement = HTMLElement,
> {
	"aria-label": string;
	onClick: JSX.EventHandlerUnion<T, MouseEvent>;
}

export interface ToastCloseButtonRenderProps
	extends ToastCloseButtonCommonProps,
		Button.ButtonRootRenderProps {}

export type ToastCloseButtonProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = ToastCloseButtonOptions &
	Partial<ToastCloseButtonCommonProps<ElementOf<T>>>;

/**
 * The button that closes the toast.
 */
export function ToastCloseButton<T extends ValidComponent = "button">(
	props: PolymorphicProps<T, ToastCloseButtonProps<T>>,
) {
	const context = useToastContext();

	const [local, others] = splitProps(props as ToastCloseButtonProps, [
		"aria-label",
		"onClick",
	]);

	const onClick: JSX.EventHandlerUnion<any, MouseEvent> = (e) => {
		callHandler(e, local.onClick);
		context.close();
	};

	return (
		<Button.Root<
			Component<
				Omit<ToastCloseButtonRenderProps, keyof Button.ButtonRootRenderProps>
			>
		>
			aria-label={local["aria-label"] || context.translations().close}
			onClick={onClick}
			{...others}
		/>
	);
}
