/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/22cb32d329e66c60f55d4fc4025d1d44bb015d71/packages/@react-aria/listbox/src/useOption.ts
 */

import {
	OverrideComponentProps,
	callHandler,
	composeEventHandlers,
	createGenerateId,
	focusWithoutScrolling,
	isMac,
	isWebKit,
	mergeDefaultProps,
	mergeRefs,
} from "@kobalte/utils";
import {
	Accessor,
	JSX,
	createMemo,
	createSignal,
	createUniqueId,
	splitProps,
} from "solid-js";

import { AsChildProp, Polymorphic } from "../polymorphic";
import { CollectionNode, createRegisterId, getItemCount } from "../primitives";
import { createSelectableItem } from "../selection";
import { useListboxContext } from "./listbox-context";
import {
	ListboxItemContext,
	ListboxItemContextValue,
	ListboxItemDataSet,
} from "./listbox-item-context";

export interface ListboxItemOptions extends AsChildProp {
	/** The collection node to render. */
	item: CollectionNode;
}

export interface ListboxItemProps
	extends OverrideComponentProps<"li", ListboxItemOptions> {}

/**
 * An item of the listbox.
 */
export function ListboxItem(props: ListboxItemProps) {
	let ref: HTMLElement | undefined;

	const listBoxContext = useListboxContext();

	const defaultId = `${listBoxContext.generateId("item")}-${createUniqueId()}`;

	const mergedProps = mergeDefaultProps({ id: defaultId }, props);

	const [local, others] = splitProps(mergedProps, [
		"ref",
		"item",
		"aria-label",
		"aria-labelledby",
		"aria-describedby",
		"onPointerMove",
		"onPointerDown",
		"onPointerUp",
		"onClick",
		"onKeyDown",
		"onMouseDown",
		"onFocus",
	]);

	const [labelId, setLabelId] = createSignal<string>();
	const [descriptionId, setDescriptionId] = createSignal<string>();

	const selectionManager = () => listBoxContext.listState().selectionManager();

	const isHighlighted = () =>
		selectionManager().focusedKey() === local.item.key;

	const selectableItem = createSelectableItem(
		{
			key: () => local.item.key,
			selectionManager: selectionManager,
			shouldSelectOnPressUp: listBoxContext.shouldSelectOnPressUp,
			allowsDifferentPressOrigin: () => {
				return (
					listBoxContext.shouldSelectOnPressUp() &&
					listBoxContext.shouldFocusOnHover()
				);
			},
			shouldUseVirtualFocus: listBoxContext.shouldUseVirtualFocus,
			disabled: () => local.item.disabled,
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
		isNotSafariMacOS() ? local["aria-label"] : undefined;
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
			.getItem(local.item.key)?.index;

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
	const onPointerMove: JSX.EventHandlerUnion<any, PointerEvent> = (e) => {
		callHandler(e, local.onPointerMove);

		if (e.pointerType !== "mouse") {
			return;
		}

		if (!selectableItem.isDisabled() && listBoxContext.shouldFocusOnHover()) {
			focusWithoutScrolling(e.currentTarget);
			selectionManager().setFocused(true);
			selectionManager().setFocusedKey(local.item.key);
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
		<ListboxItemContext.Provider value={context}>
			<Polymorphic
				as="li"
				ref={mergeRefs((el) => (ref = el), local.ref)}
				role="option"
				tabIndex={selectableItem.tabIndex()}
				aria-disabled={selectableItem.isDisabled()}
				aria-selected={ariaSelected()}
				aria-label={ariaLabel()}
				aria-labelledby={ariaLabelledBy()}
				aria-describedby={ariaDescribedBy()}
				aria-posinset={ariaPosInSet()}
				aria-setsize={ariaSetSize()}
				data-key={selectableItem.dataKey()}
				onPointerDown={composeEventHandlers([
					local.onPointerDown,
					selectableItem.onPointerDown,
				])}
				onPointerUp={composeEventHandlers([
					local.onPointerUp,
					selectableItem.onPointerUp,
				])}
				onClick={composeEventHandlers([local.onClick, selectableItem.onClick])}
				onKeyDown={composeEventHandlers([
					local.onKeyDown,
					selectableItem.onKeyDown,
				])}
				onMouseDown={composeEventHandlers([
					local.onMouseDown,
					selectableItem.onMouseDown,
				])}
				onFocus={composeEventHandlers([local.onFocus, selectableItem.onFocus])}
				onPointerMove={onPointerMove}
				{...dataset()}
				{...others}
			/>
		</ListboxItemContext.Provider>
	);
}
