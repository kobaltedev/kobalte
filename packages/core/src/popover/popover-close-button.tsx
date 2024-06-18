import { callHandler } from "@kobalte/utils";
import {
	type Component,
	type JSX,
	type ValidComponent,
	splitProps,
} from "solid-js";

import * as Button from "../button";
import type { ElementOf, PolymorphicProps } from "../polymorphic";
import { type PopoverDataSet, usePopoverContext } from "./popover-context";

export interface PopoverCloseButtonOptions {}

export interface PopoverCloseButtonCommonProps<
	T extends HTMLElement = HTMLElement,
> {
	"aria-label": string;
	onClick: JSX.EventHandlerUnion<T, MouseEvent>;
}

export interface PopoverCloseButtonRenderProps
	extends PopoverCloseButtonCommonProps,
		Button.ButtonRootRenderProps,
		PopoverDataSet {}

export type PopoverCloseButtonProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = PopoverCloseButtonOptions &
	Partial<PopoverCloseButtonCommonProps<ElementOf<T>>>;

/**
 * The button that closes the popover.
 */
export function PopoverCloseButton<T extends ValidComponent = "button">(
	props: PolymorphicProps<T, PopoverCloseButtonProps<T>>,
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
