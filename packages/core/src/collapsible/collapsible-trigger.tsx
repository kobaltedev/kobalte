/*
 * Portions of this file are based on code from radix-ui-primitives.
 * MIT Licensed, Copyright (c) 2022 WorkOS.
 *
 * Credits to the Radix UI team:
 * https://github.com/radix-ui/primitives/blob/21a7c97dc8efa79fecca36428eec49f187294085/packages/react/collapsible/src/Collapsible.tsx
 */

import { callHandler } from "@kobalte/utils";
import type { JSX, ValidComponent } from "@solidjs/web";
import { type Component, omit } from "solid-js";

import * as Button from "../button";
import type { ElementOf, PolymorphicProps } from "../polymorphic";
import { useCollapsibleContext } from "./collapsible-context";

export interface CollapsibleTriggerOptions {}

export interface CollapsibleTriggerCommonProps<
	T extends HTMLElement = HTMLElement,
> extends Button.ButtonRootCommonProps<T> {
	ref: T | ((el: T) => void);
	onClick: JSX.EventHandlerUnion<T, MouseEvent>;
}

export interface CollapsibleTriggerRenderProps
	extends CollapsibleTriggerCommonProps,
		Button.ButtonRootRenderProps {
	"aria-expanded": "true" | "false";
	"aria-controls": string | undefined;
}

export type CollapsibleTriggerProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = CollapsibleTriggerOptions &
	Partial<CollapsibleTriggerCommonProps<ElementOf<T>>>;

/**
 * The button that expands/collapses the collapsible content.
 */
export function CollapsibleTrigger<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, CollapsibleTriggerProps<T>>,
) {
	const context = useCollapsibleContext();

	const others = omit(props, "onClick");

	const onClick: JSX.EventHandlerUnion<Element, MouseEvent> = (e) => {
		callHandler(e, props.onClick as JSX.EventHandlerUnion<Element, MouseEvent>);
		context.toggle();
	};

	return (
		<Button.Root<
			Component<
				Omit<CollapsibleTriggerRenderProps, keyof Button.ButtonRootRenderProps>
			>
		>
			aria-expanded={context.isOpen() ? "true" : "false"}
			aria-controls={context.isOpen() ? context.contentId() : undefined}
			disabled={context.disabled()}
			onClick={onClick}
			{...context.dataset()}
			{...others}
		/>
	);
}
