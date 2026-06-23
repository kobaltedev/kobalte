/*
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/22cb32d329e66c60f55d4fc4025d1d44bb015d71/packages/@react-aria/listbox/src/useOption.ts
 */

import {
	callHandler,
	composeEventHandlers,
	createGenerateId,
	focusWithoutScrolling,
	isMac,
	isWebKit,
	mergeDefaultProps,
	mergeRefs,
} from "@kobalte/utils";
import type { JSX, ValidComponent } from "@solidjs/web";
import {
	type Accessor,
	createMemo,
	createSignal,
	createUniqueId,
	omit,
} from "solid-js";

import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";
import {
	type CollectionNode,
	createRegisterId,
	getItemCount,
} from "../primitives";
import { createSelectableItem } from "../selection";
import { useListboxContext } from "./listbox-context";
import {
	ListboxItemContext,
	type ListboxItemContextValue,
	type ListboxItemDataSet,
} from "./listbox-item-context";

export interface ListboxItemOptions {
	/** The collection node to render. */
	item: CollectionNode;
}

export interface ListboxItemCommonProps<T extends HTMLElement = HTMLElement> {
	id: string;
	ref: T | ((el: T) => void);
	"aria-label": string | undefined;
	"aria-labelledby": string | undefined;
	"aria-describedby": string | undefined;
	onPointerMove: JSX.EventHandlerUnion<T, PointerEvent>;
	onPointerDown: JSX.EventHandlerUnion<T, PointerEvent>;
	onPointerUp: JSX.EventHandlerUnion<T, PointerEvent>;
	onClick: JSX.EventHandlerUnion<T, MouseEvent>;
	onKeyDown: JSX.EventHandlerUnion<T, KeyboardEvent>;
	onMouseDown: JSX.EventHandlerUnion<T, MouseEvent>;
	onFocus: JSX.EventHandlerUnion<T, FocusEvent>;
}

export interface ListboxItemRenderProps
	extends ListboxItemCommonProps,
		ListboxItemDataSet {
	role: "option";
	tabindex: number | undefined;
	"aria-disabled": boolean;
	"aria-selected": boolean | undefined;
	"aria-posinset": number | undefined;
	"aria-setsize": number | undefined;
	"data-key": string | undefined;
}

export type ListboxItemProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = ListboxItemOptions & Partial<ListboxItemCommonProps<ElementOf<T>>>;

/**
 * An item of the listbox.
 */
export function ListboxItem<T extends ValidComponent = "li">(
	props: PolymorphicProps<T, ListboxItemProps<T>>,
) {
	let ref: HTMLElement | undefined;

	const listBoxContext = useListboxContext();

	const defaultId = `${listBoxContext.generateId("item")}-${createUniqueId()}`;

	const mergedProps = mergeDefaultProps(
		{ id: defaultId },
		props as ListboxItemProps,
	);

	const others = omit(mergedProps, "ref", "item", "aria-label", "aria-labelledby", "aria-describedby", "onPointerMove", "onPointerDown", "onPointerUp", "onClick", "onKeyDown", "onMouseDown", "onFocus");

	const [labelId, setLabelId] = createSignal<string>();
	const [descriptionId, setDescriptionId] = createSignal<string>();

	const selectionManager = () => listBoxContext.listState().selectionManager();

	const isHighlighted = () =>
		selectionManager().focusedKey() === mergedProps.item.key;

	const selectableItem = createSelectableItem(
		{
			key: () => mergedProps.item.key,
			selectionManager: selectionManager,
			shouldSelectOnPressUp: listBoxContext.shouldSelectOnPressUp,
			allowsDifferentPressOrigin: () => {
				return (
					listBoxContext.shouldSelectOnPressUp() &&
					listBoxContext.shouldFocusOnHover()
				);
			},
			shouldUseVirtualFocus: listBoxContext.shouldUseVirtualFocus,
			disabled: () => mergedProps.item.disabled,
		},
		() => ref,
	);

	const ariaSelected = () => {
		if (selectionManager().selectionMode() === "none") {
			return undefined;
		}

		return selectableItem.isSelected();
	};

	// Safari with VoiceOver on macOS misreads options with aria-labelledby or aria-label as simply "text".
	// We should not map slots to the label and description on Safari and instead just have VoiceOver read the textContent.
	// https://bugs.webkit.org/show_bug.cgi?id=209279
	const isNotSafariMacOS = createMemo(() => !(isMac() && isWebKit()));

	const ariaLabel = () =>
		isNotSafariMacOS() ? mergedProps["aria-label"] : undefined;
	const ariaLabelledBy = () => (isNotSafariMacOS() ? labelId() : undefined);
	const ariaDescribedBy = () =>
		isNotSafariMacOS() ? descriptionId() : undefined;

	const ariaPosInSet = () => {
		if (!listBoxContext.isVirtualized()) {
			return undefined;
		}

		const index = listBoxContext
			.listState()
			.collection()
			.getItem(mergedProps.item.key)?.index;

		return index != null ? index + 1 : undefined;
	};

	const ariaSetSize = () => {
		if (!listBoxContext.isVirtualized()) {
			return undefined;
		}

		return getItemCount(listBoxContext.listState().collection());
	};

	/**
	 * We focus items on `pointerMove` to achieve the following:
	 *
	 * - Mouse over an item (it focuses)
	 * - Leave mouse where it is and use keyboard to focus a different item
	 * - Wiggle mouse without it leaving previously focused item
	 * - Previously focused item should re-focus
	 *
	 * If we used `mouseOver`/`mouseEnter` it would not re-focus when the mouse
	 * wiggles. This is to match native select implementation.
	 */
	const onPointerMove: JSX.EventHandlerUnion<HTMLElement, PointerEvent> = (e) => {
		callHandler(e, mergedProps.onPointerMove);

		if (e.pointerType !== "mouse") {
			return;
		}

		if (!selectableItem.isDisabled() && listBoxContext.shouldFocusOnHover()) {
			focusWithoutScrolling(e.currentTarget);
			selectionManager().setFocused(true);
			selectionManager().setFocusedKey(mergedProps.item.key);
		}
	};

	const dataset: Accessor<ListboxItemDataSet> = createMemo(() => ({
		"data-disabled": selectableItem.isDisabled() ? "" : undefined,
		"data-selected": selectableItem.isSelected() ? "" : undefined,
		"data-highlighted": isHighlighted() ? "" : undefined,
	}));

	const context: ListboxItemContextValue = {
		isSelected: selectableItem.isSelected,
		dataset,
		generateId: createGenerateId(() => others.id!),
		registerLabelId: createRegisterId(setLabelId),
		registerDescriptionId: createRegisterId(setDescriptionId),
	};

	return (
		<ListboxItemContext value={context}>
			<Polymorphic<ListboxItemRenderProps>
				as="li"
				ref={mergeRefs((el) => (ref = el), mergedProps.ref)}
				role="option"
				tabindex={selectableItem.tabIndex()}
				aria-disabled={selectableItem.isDisabled()}
				aria-selected={ariaSelected()}
				aria-label={ariaLabel()}
				aria-labelledby={ariaLabelledBy()}
				aria-describedby={ariaDescribedBy()}
				aria-posinset={ariaPosInSet()}
				aria-setsize={ariaSetSize()}
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
				onKeyDown={composeEventHandlers([
					mergedProps.onKeyDown,
					selectableItem.onKeyDown,
				])}
				onMouseDown={composeEventHandlers([
					mergedProps.onMouseDown,
					selectableItem.onMouseDown,
				])}
				onFocus={composeEventHandlers([mergedProps.onFocus, selectableItem.onFocus])}
				onPointerMove={onPointerMove}
				{...dataset()}
				{...others}
			/>
		</ListboxItemContext>
	);
}
