/*
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/c183944ce6a8ca1cf280a1c7b88d2ba393dd0252/packages/@react-aria/accordion/src/useAccordion.ts
 */

import { mergeDefaultProps } from "@kobalte/utils";
import {
	type Component,
	type ValidComponent,
	createEffect,
	onCleanup,
	splitProps,
} from "solid-js";

import { combineStyle } from "@solid-primitives/props";
import * as Collapsible from "../collapsible";
import type { ElementOf, PolymorphicProps } from "../polymorphic";
import { useAccordionItemContext } from "./accordion-item-context";

export interface AccordionContentOptions {}

export interface AccordionContentCommonProps<
	T extends HTMLElement = HTMLElement,
> extends Collapsible.CollapsibleContentCommonProps<T> {
	id: string;
}

export interface AccordionContentRenderProps
	extends AccordionContentCommonProps,
		Collapsible.CollapsibleContentRenderProps {
	role: "region";
	"aria-labelledby": string | undefined;
}

export type AccordionContentProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = AccordionContentOptions &
	Partial<AccordionContentCommonProps<ElementOf<T>>>;

/**
 * Contains the content to be rendered when the `Accordion.Item` is expanded.
 */
export function AccordionContent<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, AccordionContentProps<T>>,
) {
	const itemContext = useAccordionItemContext();

	const defaultId = itemContext.generateId("content");

	const mergedProps = mergeDefaultProps(
		{ id: defaultId },
		props as AccordionContentProps,
	);

	const [local, others] = splitProps(mergedProps, ["id", "style"]);

	createEffect(() => onCleanup(itemContext.registerContentId(local.id)));

	return (
		<Collapsible.Content<
			Component<
				Omit<
					AccordionContentRenderProps,
					keyof Collapsible.CollapsibleContentRenderProps
				>
			>
		>
			role="region"
			aria-labelledby={itemContext.triggerId()}
			style={combineStyle(
				{
					"--kb-accordion-content-height":
						"var(--kb-collapsible-content-height)",
					"--kb-accordion-content-width": "var(--kb-collapsible-content-width)",
				},
				local.style,
			)}
			{...others}
		/>
	);
}
