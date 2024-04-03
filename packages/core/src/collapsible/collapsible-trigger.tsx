/*!
 * Portions of this file are based on code from radix-ui-primitives.
 * MIT Licensed, Copyright (c) 2022 WorkOS.
 *
 * Credits to the Radix UI team:
 * https://github.com/radix-ui/primitives/blob/21a7c97dc8efa79fecca36428eec49f187294085/packages/react/collapsible/src/Collapsible.tsx
 */

import { OverrideComponentProps, callHandler } from "@kobalte/utils";
import { JSX, splitProps, ValidComponent } from "solid-js";

import * as Button from "../button";
import { PolymorphicProps } from "../polymorphic";
import { useCollapsibleContext } from "./collapsible-context";

export interface CollapsibleTriggerOptions {
	onClick?: any; // TODO
}

export interface CollapsibleTriggerCommonProps {
	id: string;
	ref: HTMLElement | ((el: HTMLElement) => void);
}

// TODO impl ButtonRenderProps!
export interface CollapsibleTriggerRenderProps
	extends CollapsibleTriggerCommonProps {}

export type CollapsibleTriggerProps = CollapsibleTriggerOptions &
	Partial<CollapsibleTriggerCommonProps>;

/**
 * The button that expands/collapses the collapsible content.
 */
export function CollapsibleTrigger<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, CollapsibleTriggerProps>,
) {
	const context = useCollapsibleContext();

	const [local, others] = splitProps(props, ["onClick"]);

	const onClick: JSX.EventHandlerUnion<HTMLElement, MouseEvent> = (e) => {
		callHandler(e, local.onClick as typeof onClick);
		context.toggle();
	};

	return (
		<Button.Root
			aria-expanded={context.isOpen()}
			aria-controls={context.isOpen() ? context.contentId() : undefined}
			disabled={context.disabled()}
			onClick={onClick}
			{...context.dataset()}
			{...others}
		/>
	);
}
