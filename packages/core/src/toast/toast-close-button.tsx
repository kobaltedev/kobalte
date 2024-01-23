/*!
 * Portions of this file are based on code from radix-ui-primitives.
 * MIT Licensed, Copyright (c) 2022 WorkOS.
 *
 * Credits to the Radix UI team:
 * https://github.com/radix-ui/primitives/blob/72018163e1fdb79b51d322d471c8fc7d14df2b59/packages/react/toast/src/Toast.tsx
 */

import { OverrideComponentProps, callHandler } from "@kobalte/utils";
import { JSX, splitProps } from "solid-js";

import * as Button from "../button";
import { useToastContext } from "./toast-context";

export interface ToastCloseButtonOptions extends Button.ButtonRootOptions {}

export type ToastCloseButtonProps = OverrideComponentProps<
	"button",
	ToastCloseButtonOptions
>;

/**
 * The button that closes the toast.
 */
export function ToastCloseButton(props: ToastCloseButtonProps) {
	const context = useToastContext();

	const [local, others] = splitProps(props, ["aria-label", "onClick"]);

	const onClick: JSX.EventHandlerUnion<any, MouseEvent> = (e) => {
		callHandler(e, local.onClick);
		context.close();
	};

	return (
		<Button.Root
			aria-label={local["aria-label"] || context.translations().close}
			onClick={onClick}
			{...others}
		/>
	);
}
