/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/c183944ce6a8ca1cf280a1c7b88d2ba393dd0252/packages/@react-aria/accordion/src/useAccordion.ts
 */

import { createGenerateId, mergeDefaultProps } from "@kobalte/utils";
import {
	Component,
	createSignal,
	createUniqueId,
	JSX,
	splitProps,
	ValidComponent,
} from "solid-js";

import * as Collapsible from "../collapsible";
import { PolymorphicProps } from "../polymorphic";
import { createRegisterId } from "../primitives";
import { useAccordionContext } from "./accordion-context";
import {
	AccordionItemContext,
	AccordionItemContextValue,
} from "./accordion-item-context";

export interface AccordionItemOptions
	extends Collapsible.CollapsibleRootOptions {
	/** A unique value for the item. */
	value: string;

	/** Whether the item is disabled. */
	disabled?: boolean;

	/**
	 * Used to force mounting the item content when more control is needed.
	 * Useful when controlling animation with SolidJS animation libraries.
	 */
	forceMount?: boolean;
}

export interface AccordionItemCommonProps
	extends Collapsible.CollapsibleRootCommonProps {}

export interface AccordionItemRenderProps
	extends AccordionItemCommonProps,
		Collapsible.CollapsibleRootRenderProps {}

export type AccordionItemProps = AccordionItemOptions &
	Partial<AccordionItemRenderProps>;

/**
 * An item of the accordion, contains all the parts of a collapsible section.
 */
export function AccordionItem<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, AccordionItemProps>,
) {
	const accordionContext = useAccordionContext();

	const defaultId = `${accordionContext.generateId(
		"item",
	)}-${createUniqueId()}`;

	const mergedProps = mergeDefaultProps(
		{ id: defaultId },
		props as AccordionItemProps,
	);

	const [local, others] = splitProps(mergedProps, ["value", "disabled"]);

	const [triggerId, setTriggerId] = createSignal<string>();
	const [contentId, setContentId] = createSignal<string>();

	const selectionManager = () =>
		accordionContext.listState().selectionManager();

	const isExpanded = () => {
		return selectionManager().isSelected(local.value);
	};

	const context: AccordionItemContextValue = {
		value: () => local.value,
		triggerId,
		contentId,
		generateId: createGenerateId(() => others.id!),
		registerTriggerId: createRegisterId(setTriggerId),
		registerContentId: createRegisterId(setContentId),
	};

	return (
		<AccordionItemContext.Provider value={context}>
			<Collapsible.Root<
				Component<
					Omit<
						AccordionItemRenderProps,
						keyof Collapsible.CollapsibleRootRenderProps
					>
				>
			>
				open={isExpanded()}
				disabled={local.disabled}
				{...others}
			/>
		</AccordionItemContext.Provider>
	);
}
