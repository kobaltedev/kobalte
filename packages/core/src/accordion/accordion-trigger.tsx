/*
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/c183944ce6a8ca1cf280a1c7b88d2ba393dd0252/packages/@react-aria/accordion/src/useAccordion.ts
 */

import {
	callHandler,
	composeEventHandlers,
	mergeDefaultProps,
	mergeRefs,
} from "@kobalte/utils";
import {
	type Component,
	createEffect,
	omit,
} from "solid-js";
import type { JSX, ValidComponent } from "@solidjs/web";

import * as Collapsible from "../collapsible";
import { useCollapsibleContext } from "../collapsible/collapsible-context";
import type { ElementOf, PolymorphicProps } from "../polymorphic";
import type { CollectionItemWithRef } from "../primitives";
import { createDomCollectionItem } from "../primitives/create-dom-collection";
import { createSelectableItem } from "../selection";
import { useAccordionContext } from "./accordion-context";
import { useAccordionItemContext } from "./accordion-item-context";

export interface AccordionTriggerOptions {}

export interface AccordionTriggerCommonProps<
	T extends HTMLElement = HTMLElement,
> extends Collapsible.CollapsibleTriggerCommonProps<T> {
	id: string;
	onPointerDown: JSX.EventHandlerUnion<T, PointerEvent>;
	onPointerUp: JSX.EventHandlerUnion<T, PointerEvent>;
	onKeyDown: JSX.EventHandlerUnion<T, KeyboardEvent>;
	onMouseDown: JSX.EventHandlerUnion<T, MouseEvent>;
	onFocus: JSX.EventHandlerUnion<T, FocusEvent>;
}

export interface AccordionTriggerRenderProps
	extends AccordionTriggerCommonProps,
		Collapsible.CollapsibleTriggerRenderProps {
	"data-key": string | undefined;
}

export type AccordionTriggerProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = AccordionTriggerOptions &
	Partial<AccordionTriggerCommonProps<ElementOf<T>>>;

/**
 * Toggles the collapsed state of its associated item. It should be nested inside an `Accordion.Header`.
 */
export function AccordionTrigger<T extends ValidComponent = "button">(
	props: PolymorphicProps<T, AccordionTriggerProps<T>>,
) {
	let ref: HTMLElement | undefined;

	const accordionContext = useAccordionContext();
	const itemContext = useAccordionItemContext();
	const collapsibleContext = useCollapsibleContext();

	const defaultId = itemContext.generateId("trigger");

	const mergedProps = mergeDefaultProps(
		{ id: defaultId },
		props as AccordionTriggerProps,
	);

	const others = omit(mergedProps, "ref", "onPointerDown", "onPointerUp", "onClick", "onKeyDown", "onMouseDown", "onFocus");

	createDomCollectionItem<CollectionItemWithRef>({
		getItem: () => ({
			ref: () => ref,
			type: "item",
			key: itemContext.value(),
			textValue: "", // not applicable here
			disabled: collapsibleContext.disabled(),
		}),
	});

	const selectableItem = createSelectableItem(
		{
			key: () => itemContext.value(),
			selectionManager: () => accordionContext.listState().selectionManager(),
			disabled: () => collapsibleContext.disabled(),
			shouldSelectOnPressUp: true,
		},
		() => ref,
	);

	const onKeyDown: JSX.EventHandlerUnion<Element, KeyboardEvent> = (e) => {
		// Prevent `Enter` and `Space` default behavior which fires a click event when using a <button>.
		if (["Enter", " "].includes(e.key)) {
			e.preventDefault();
		}

		callHandler(e, mergedProps.onKeyDown as typeof onKeyDown);
		callHandler(e, selectableItem.onKeyDown);
	};

	createEffect(
		() => others.id!,
		(id) => itemContext.registerTriggerId(id),
	);

	return (
		<Collapsible.Trigger<
			Component<
				Omit<
					AccordionTriggerRenderProps,
					keyof Collapsible.CollapsibleTriggerRenderProps
				>
			>
		>
			ref={mergeRefs((el) => (ref = el), mergedProps.ref)}
			data-key={selectableItem.dataKey()}
			onPointerDown={composeEventHandlers([
				mergedProps.onPointerDown,
				selectableItem.onPointerDown,
			])}
			onPointerUp={composeEventHandlers([
				mergedProps.onPointerUp,
				selectableItem.onPointerUp,
			])}
			onClick={composeEventHandlers([mergedProps.onClick, selectableItem.onClick])}
			onKeyDown={onKeyDown}
			onMouseDown={composeEventHandlers([
				mergedProps.onMouseDown,
				selectableItem.onMouseDown,
			])}
			onFocus={composeEventHandlers([mergedProps.onFocus, selectableItem.onFocus])}
			{...others}
		/>
	);
}
