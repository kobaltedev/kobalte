import { callHandler } from "@kobalte/utils";
import type { JSX, ValidComponent } from "@solidjs/web";
import { type Component, omit } from "solid-js";

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

	const p = props as PopoverCloseButtonProps;
	const others = omit(p, "aria-label", "onClick");

	const onClick: JSX.EventHandlerUnion<HTMLElement, MouseEvent> = (e) => {
		callHandler(e, p.onClick);
		context.close();
	};

	return (
		<Button.Root<
			Component<
				Omit<PopoverCloseButtonRenderProps, keyof Button.ButtonRootRenderProps>
			>
		>
			aria-label={p["aria-label"] || context.translations().dismiss}
			onClick={onClick}
			{...context.dataset()}
			{...others}
		/>
	);
}
