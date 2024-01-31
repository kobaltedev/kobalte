import { OverrideComponentProps, callHandler } from "@kobalte/utils";
import { JSX, splitProps } from "solid-js";

import * as Button from "../button";
import { usePopoverContext } from "./popover-context";

export interface PopoverCloseButtonProps
	extends OverrideComponentProps<"button", Button.ButtonRootOptions> {}

/**
 * The button that closes the popover.
 */
export function PopoverCloseButton(props: PopoverCloseButtonProps) {
	const context = usePopoverContext();

	const [local, others] = splitProps(props, ["aria-label", "onClick"]);

	const onClick: JSX.EventHandlerUnion<any, MouseEvent> = (e) => {
		callHandler(e, local.onClick);
		context.close();
	};

	return (
		<Button.Root
			aria-label={local["aria-label"] || context.translations().dismiss}
			onClick={onClick}
			{...context.dataset()}
			{...others}
		/>
	);
}
