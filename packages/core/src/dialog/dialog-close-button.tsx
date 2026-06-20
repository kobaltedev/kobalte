import { callHandler } from "@kobalte/utils";
import {
	type Component,
	type JSX,
	type ValidComponent,
	omit,
} from "solid-js";

import * as Button from "../button";
import type { ElementOf, PolymorphicProps } from "../polymorphic";
import { useDialogContext } from "./dialog-context";

export interface DialogCloseButtonOptions extends Button.ButtonRootOptions {}

export interface DialogCloseButtonCommonProps<
	T extends HTMLElement = HTMLElement,
> extends Button.ButtonRootCommonProps<T> {
	onClick: JSX.EventHandlerUnion<T, MouseEvent>;
	"aria-label": string;
}

export interface DialogCloseButtonRenderProps
	extends DialogCloseButtonCommonProps,
		Button.ButtonRootRenderProps {}

export type DialogCloseButtonProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = DialogCloseButtonOptions &
	Partial<DialogCloseButtonCommonProps<ElementOf<T>>>;

/**
 * The button that closes the dialog.
 */
export function DialogCloseButton<T extends ValidComponent = "button">(
	props: PolymorphicProps<T, DialogCloseButtonProps<T>>,
) {
	const context = useDialogContext();

	const others = omit(props as DialogCloseButtonProps, "aria-label", "onClick");

	const onClick: JSX.EventHandlerUnion<HTMLElement, MouseEvent> = (e) => {
		callHandler(e, props.onClick);
		context.close();
	};

	return (
		<Button.Root<
			Component<
				Omit<DialogCloseButtonRenderProps, keyof Button.ButtonRootRenderProps>
			>
		>
			aria-label={props["aria-label"] || context.translations().dismiss}
			onClick={onClick}
			{...others}
		/>
	);
}
