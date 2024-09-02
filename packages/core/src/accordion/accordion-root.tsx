/*
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/c183944ce6a8ca1cf280a1c7b88d2ba393dd0252/packages/@react-aria/accordion/src/useAccordion.ts
 */

import {
	composeEventHandlers,
	createGenerateId,
	mergeDefaultProps,
	mergeRefs,
} from "@kobalte/utils";
import {
	type JSX,
	type ValidComponent,
	createSignal,
	createUniqueId,
	splitProps,
} from "solid-js";

import { createListState, createSelectableList } from "../list";
import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";
import type { CollectionItemWithRef } from "../primitives";
import { createDomCollection } from "../primitives/create-dom-collection";
import {
	AccordionContext,
	type AccordionContextValue,
} from "./accordion-context";

export interface AccordionRootOptions {
	/** The controlled value of the accordion item(s) to expand. */
	value?: string[];

	/**
	 * The value of the accordion item(s) to expand when initially rendered.
	 * Useful when you do not need to control the state.
	 */
	defaultValue?: string[];

	/** Event handler called when the value changes. */
	onChange?: (value: string[]) => void;

	/** Whether multiple items can be opened at the same time. */
	multiple?: boolean;

	/** When `multiple` is `false`, allows closing content when clicking trigger for an open item. */
	collapsible?: boolean;

	/** Whether focus should wrap around when the end/start is reached. */
	shouldFocusWrap?: boolean;
}

export interface AccordionRootCommonProps<T extends HTMLElement = HTMLElement> {
	id: string;
	ref: T | ((el: T) => void);
	onKeyDown: JSX.EventHandlerUnion<T, KeyboardEvent>;
	onMouseDown: JSX.EventHandlerUnion<T, MouseEvent>;
	onFocusIn: JSX.EventHandlerUnion<T, FocusEvent>; // TODO: remove next breaking
	onFocusOut: JSX.EventHandlerUnion<T, FocusEvent>;
}

export interface AccordionRootRenderProps extends AccordionRootCommonProps {}

export type AccordionRootProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = AccordionRootOptions & Partial<AccordionRootCommonProps<ElementOf<T>>>;

/**
 * A vertically stacked set of interactive headings that each reveal an associated section of content.
 */
export function AccordionRoot<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, AccordionRootProps<T>>,
) {
	let ref: HTMLElement | undefined;

	const defaultId = `accordion-${createUniqueId()}`;

	const mergedProps = mergeDefaultProps(
		{
			id: defaultId,
			multiple: false,
			collapsible: false,
			shouldFocusWrap: true,
		},
		props as AccordionRootProps,
	);

	const [local, others] = splitProps(mergedProps, [
		"id",
		"ref",
		"value",
		"defaultValue",
		"onChange",
		"multiple",
		"collapsible",
		"shouldFocusWrap",
		"onKeyDown",
		"onMouseDown",
		"onFocusIn", // TODO: remove next breaking
		"onFocusOut",
	]);

	const [items, setItems] = createSignal<CollectionItemWithRef[]>([]);

	const { DomCollectionProvider } = createDomCollection({
		items,
		onItemsChange: setItems,
	});

	const listState = createListState({
		selectedKeys: () => local.value,
		defaultSelectedKeys: () => local.defaultValue,
		onSelectionChange: (value) => local.onChange?.(Array.from(value)),
		disallowEmptySelection: () => !local.multiple && !local.collapsible,
		selectionMode: () => (local.multiple ? "multiple" : "single"),
		dataSource: items,
	});

	listState.selectionManager().setFocusedKey("item-1");

	const selectableList = createSelectableList(
		{
			selectionManager: () => listState.selectionManager(),
			collection: () => listState.collection(),
			disallowEmptySelection: () =>
				listState.selectionManager().disallowEmptySelection(),
			shouldFocusWrap: () => local.shouldFocusWrap,
			disallowTypeAhead: true,
			allowsTabNavigation: true,
		},
		() => ref,
	);

	const context: AccordionContextValue = {
		listState: () => listState,
		generateId: createGenerateId(() => local.id),
	};

	return (
		<DomCollectionProvider>
			<AccordionContext.Provider value={context}>
				<Polymorphic<AccordionRootRenderProps>
					as="div"
					id={local.id}
					ref={mergeRefs((el) => (ref = el), local.ref)}
					onKeyDown={composeEventHandlers([
						local.onKeyDown,
						selectableList.onKeyDown,
					])}
					onMouseDown={composeEventHandlers([
						local.onMouseDown,
						selectableList.onMouseDown,
					])}
					onFocusIn={composeEventHandlers([
						local.onFocusIn, // TODO: remove next breaking
					])}
					onFocusOut={composeEventHandlers([
						local.onFocusOut,
						selectableList.onFocusOut,
					])}
					{...others}
				/>
			</AccordionContext.Provider>
		</DomCollectionProvider>
	);
}
