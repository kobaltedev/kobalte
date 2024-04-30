import { callHandler } from "@kobalte/utils";
import { Component, JSX, ValidComponent, splitProps } from "solid-js";

import * as Button from "../button";
import { PolymorphicProps } from "../polymorphic";
import { useDialogContext } from "./dialog-context";

export interface DialogCloseButtonOptions extends Button.ButtonRootOptions {}

export interface DialogCloseButtonCommonProps
	extends Button.ButtonRootCommonProps {
	onClick: JSX.EventHandlerUnion<HTMLElement, MouseEvent>;
	"aria-label": string;
}

export interface DialogCloseButtonRenderProps
	extends DialogCloseButtonCommonProps,
		Button.ButtonRootRenderProps {}

export type DialogCloseButtonProps = DialogCloseButtonOptions &
	Partial<DialogCloseButtonCommonProps>;

/**
 * The button that closes the dialog.
 */
export function DialogCloseButton<T extends ValidComponent = "button">(
	props: PolymorphicProps<T, DialogCloseButtonProps>,
) {
	const context = useDialogContext();

	const [local, others] = splitProps(props as DialogCloseButtonProps, [
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
				Omit<DialogCloseButtonRenderProps, keyof Button.ButtonRootRenderProps>
			>
		>
			aria-label={local["aria-label"] || context.translations().dismiss}
			onClick={onClick}
			{...others}
		/>
	);
}
