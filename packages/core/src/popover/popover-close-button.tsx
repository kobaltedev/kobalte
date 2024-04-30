import { callHandler } from "@kobalte/utils";
import { Component, JSX, ValidComponent, splitProps } from "solid-js";

import * as Button from "../button";
import { PolymorphicProps } from "../polymorphic";
import { PopoverDataSet, usePopoverContext } from "./popover-context";

export interface PopoverCloseButtonOptions {}

export interface PopoverCloseButtonCommonProps {
	"aria-label": string;
	onClick: JSX.EventHandlerUnion<HTMLElement, MouseEvent>;
}

export interface PopoverCloseButtonRenderProps
	extends PopoverCloseButtonCommonProps,
		Button.ButtonRootRenderProps,
		PopoverDataSet {}

export type PopoverCloseButtonProps = PopoverCloseButtonOptions &
	Partial<PopoverCloseButtonCommonProps>;

/**
 * The button that closes the popover.
 */
export function PopoverCloseButton<T extends ValidComponent = "button">(
	props: PolymorphicProps<T, PopoverCloseButtonProps>,
) {
	const context = usePopoverContext();

	const [local, others] = splitProps(props as PopoverCloseButtonProps, [
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
				Omit<PopoverCloseButtonRenderProps, keyof Button.ButtonRootRenderProps>
			>
		>
			aria-label={local["aria-label"] || context.translations().dismiss}
			onClick={onClick}
			{...context.dataset()}
			{...others}
		/>
	);
}
