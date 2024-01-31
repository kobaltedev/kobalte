import { OverrideComponentProps, callHandler } from "@kobalte/utils";
import { JSX, splitProps } from "solid-js";

import * as Button from "../button";
import { useDialogContext } from "./dialog-context";

export interface DialogCloseButtonProps
	extends OverrideComponentProps<"button", Button.ButtonRootOptions> {}

/**
 * The button that closes the dialog.
 */
export function DialogCloseButton(props: DialogCloseButtonProps) {
	const context = useDialogContext();

	const [local, others] = splitProps(props, ["aria-label", "onClick"]);

	const onClick: JSX.EventHandlerUnion<any, MouseEvent> = (e) => {
		callHandler(e, local.onClick);
		context.close();
	};

	return (
		<Button.Root
			aria-label={local["aria-label"] || context.translations().dismiss}
			onClick={onClick}
			{...others}
		/>
	);
}
