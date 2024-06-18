/*
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/6b51339cca0b8344507d3c8e81e7ad05d6e75f9b/packages/@react-aria/tabs/src/useTab.ts
 */

import {
	type Orientation,
	composeEventHandlers,
	focusWithoutScrolling,
	isWebKit,
	mergeDefaultProps,
	mergeRefs,
} from "@kobalte/utils";
import {
	type JSX,
	type ValidComponent,
	createEffect,
	on,
	splitProps,
} from "solid-js";

import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";
import type { CollectionItemWithRef } from "../primitives";
import { createDomCollectionItem } from "../primitives/create-dom-collection";
import { createSelectableItem } from "../selection";
import { useTabsContext } from "./tabs-context";

export interface TabsTriggerOptions {
	/** The unique key that associates the tab with a tab panel. */
	value: string;

	/** Whether the tab should be disabled. */
	disabled?: boolean;
}

export interface TabsTriggerCommonProps<T extends HTMLElement = HTMLElement> {
	id: string;
	ref: T | ((el: T) => void);
	type: "button";
	onPointerDown: JSX.EventHandlerUnion<T, PointerEvent>;
	onPointerUp: JSX.EventHandlerUnion<T, PointerEvent>;
	onClick: JSX.EventHandlerUnion<T, MouseEvent>;
	onKeyDown: JSX.EventHandlerUnion<T, KeyboardEvent>;
	onMouseDown: JSX.EventHandlerUnion<T, MouseEvent>;
	onFocus: JSX.EventHandlerUnion<T, FocusEvent>;
}

export interface TabsTriggerRenderProps extends TabsTriggerCommonProps {
	role: "tab";
	tabIndex: number | undefined;
	disabled: boolean;
	"aria-selected": boolean;
	"aria-disabled": boolean | undefined;
	"aria-controls": string | undefined;
	"data-key": string | undefined;
	"data-orientation": Orientation;
	"data-selected": string | undefined;
	"data-highlighted": string | undefined;
	"data-disabled": string | undefined;
}

export type TabsTriggerProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = TabsTriggerOptions & Partial<TabsTriggerCommonProps<ElementOf<T>>>;

/**
 * The button that activates its associated tab panel.
 */
export function TabsTrigger<T extends ValidComponent = "button">(
	props: PolymorphicProps<T, TabsTriggerProps<T>>,
) {
	let ref: HTMLElement | undefined;

	const context = useTabsContext();

	const mergedProps = mergeDefaultProps(
		{
			type: "button",
		} as const,
		props as TabsTriggerProps,
	);

	const [local, others] = splitProps(mergedProps, [
		"ref",
		"id",
		"value",
		"disabled",
		"onPointerDown",
		"onPointerUp",
		"onClick",
		"onKeyDown",
		"onMouseDown",
		"onFocus",
	]);

	const id = () => local.id ?? context.generateTriggerId(local.value);

	const isHighlighted = () =>
		context.listState().selectionManager().focusedKey() === local.value;

	const isDisabled = () => local.disabled || context.isDisabled();

	const contentId = () => context.contentIdsMap().get(local.value);

	createDomCollectionItem<CollectionItemWithRef>({
		getItem: () => ({
			ref: () => ref,
			type: "item",
			key: local.value,
			textValue: "", // not applicable here
			disabled: isDisabled(),
		}),
	});

	const selectableItem = createSelectableItem(
		{
			key: () => local.value,
			selectionManager: () => context.listState().selectionManager(),
			disabled: isDisabled,
		},
		() => ref,
	);

	const onClick: JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent> = (e) => {
		// Force focusing the trigger on click on safari.
		if (isWebKit()) {
			focusWithoutScrolling(e.currentTarget);
		}
	};

	createEffect(
		on([() => local.value, id], ([value, id]) => {
			context.triggerIdsMap().set(value, id);
		}),
	);

	return (
		<Polymorphic<TabsTriggerRenderProps>
			as="button"
			ref={mergeRefs((el) => (ref = el), local.ref)}
			id={id()}
			role="tab"
			tabIndex={!isDisabled() ? selectableItem.tabIndex() : undefined}
			disabled={isDisabled()}
			aria-selected={selectableItem.isSelected()}
			aria-disabled={isDisabled() || undefined}
			aria-controls={selectableItem.isSelected() ? contentId() : undefined}
			data-key={selectableItem.dataKey()}
			data-orientation={context.orientation()}
			data-selected={selectableItem.isSelected() ? "" : undefined}
			data-highlighted={isHighlighted() ? "" : undefined}
			data-disabled={isDisabled() ? "" : undefined}
			onPointerDown={composeEventHandlers([
				local.onPointerDown,
				selectableItem.onPointerDown,
			])}
			onPointerUp={composeEventHandlers([
				local.onPointerUp,
				selectableItem.onPointerUp,
			])}
			onClick={composeEventHandlers([
				local.onClick,
				selectableItem.onClick,
				onClick,
			])}
			onKeyDown={composeEventHandlers([
				local.onKeyDown,
				selectableItem.onKeyDown,
			])}
			onMouseDown={composeEventHandlers([
				local.onMouseDown,
				selectableItem.onMouseDown,
			])}
			onFocus={composeEventHandlers([local.onFocus, selectableItem.onFocus])}
			{...others}
		/>
	);
}
