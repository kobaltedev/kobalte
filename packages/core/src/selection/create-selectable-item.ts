/*
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/8f2f2acb3d5850382ebe631f055f88c704aa7d17/packages/@react-aria/selection/src/useSelectableItem.ts
 */

import {
	type MaybeAccessor,
	access,
	focusWithoutScrolling,
} from "@kobalte/utils";
import {
	type Accessor,
	type JSX,
	createEffect,
	createMemo,
	on,
} from "solid-js";

import type { MultipleSelectionManager } from "./types";
import { isCtrlKeyPressed, isNonContiguousSelectionModifier } from "./utils";

export interface CreateSelectableItemProps {
	/** An interface for reading and updating multiple selection state. */
	selectionManager: MaybeAccessor<MultipleSelectionManager>;

	/** A unique key for the item. */
	key: MaybeAccessor<string>;

	/**
	 * By default, selection occurs on pointer down. This can be strange if selecting an
	 * item causes the UI to disappear immediately (e.g. menus).
	 */
	shouldSelectOnPressUp?: MaybeAccessor<boolean | undefined>;

	/** Whether the option should use virtual focus instead of being focused directly. */
	shouldUseVirtualFocus?: MaybeAccessor<boolean | undefined>;

	/**
	 * Whether selection requires the pointer/mouse down and up events to occur on the same target or triggers selection on
	 * the target of the pointer/mouse up event.
	 */
	allowsDifferentPressOrigin?: MaybeAccessor<boolean | undefined>;

	/** Whether the option is contained in a virtual scroller. */
	virtualized?: MaybeAccessor<boolean | undefined>;

	/** Whether the item is disabled. */
	disabled?: MaybeAccessor<boolean | undefined>;

	/** Function to focus the item. */
	focus?: () => void;
}

/**
 * Handles interactions with an item in a selectable collection.
 * @param props Props for the item.
 * @param ref Ref to the item.
 */
export function createSelectableItem<T extends HTMLElement>(
	props: CreateSelectableItemProps,
	ref: Accessor<T | undefined>,
) {
	const manager = () => access(props.selectionManager);
	const key = () => access(props.key);
	const shouldUseVirtualFocus = () => access(props.shouldUseVirtualFocus);

	const onSelect = (e: MouseEvent | PointerEvent | KeyboardEvent) => {
		if (manager().selectionMode() === "none") {
			return;
		}

		if (manager().selectionMode() === "single") {
			if (manager().isSelected(key()) && !manager().disallowEmptySelection()) {
				manager().toggleSelection(key());
			} else {
				manager().replaceSelection(key());
			}
		} else if (e?.shiftKey) {
			manager().extendSelection(key());
		} else if (
			manager().selectionBehavior() === "toggle" ||
			isCtrlKeyPressed(e) ||
			("pointerType" in e && e.pointerType === "touch")
		) {
			// if touch then we just want to toggle, otherwise it's impossible to multi select because they don't have modifier keys
			manager().toggleSelection(key());
		} else {
			manager().replaceSelection(key());
		}
	};

	const isSelected = () => manager().isSelected(key());

	// With checkbox selection, onAction (i.e. navigation) becomes primary, and occurs on a single click of the row.
	// Clicking the checkbox enters selection mode, after which clicking anywhere on any row toggles selection for that row.
	// With highlight selection, onAction is secondary, and occurs on double click. Single click selects the row.
	// With touch, onAction occurs on single tap, and long press enters selection mode.
	const isDisabled = () =>
		access(props.disabled) || manager().isDisabled(key());

	const allowsSelection = () => !isDisabled() && manager().canSelectItem(key());

	let pointerDownType: PointerEvent["pointerType"] | null = null;

	const onPointerDown: JSX.EventHandlerUnion<any, PointerEvent> = (e) => {
		if (!allowsSelection()) {
			return;
		}

		pointerDownType = e.pointerType;

		// Selection occurs on mouse down (main button).
		if (
			e.pointerType === "mouse" &&
			e.button === 0 &&
			!access(props.shouldSelectOnPressUp)
		) {
			onSelect(e);
		}
	};

	// By default, selection occurs on pointer down. This can be strange if selecting an
	// item causes the UI to disappear immediately (e.g. menus).
	// If shouldSelectOnPressUp is true, we use onPointerUp instead of onPointerDown.
	const onPointerUp: JSX.EventHandlerUnion<any, PointerEvent> = (e) => {
		if (!allowsSelection()) {
			return;
		}

		// If allowsDifferentPressOrigin, make selection happen on mouse up (main button).
		// Otherwise, have selection happen on click.
		if (
			e.pointerType === "mouse" &&
			e.button === 0 &&
			access(props.shouldSelectOnPressUp) &&
			access(props.allowsDifferentPressOrigin)
		) {
			onSelect(e);
		}
	};

	const onClick: JSX.EventHandlerUnion<any, MouseEvent> = (e) => {
		if (!allowsSelection()) {
			return;
		}

		// If not allowsDifferentPressOrigin or pointerType is touch/pen, make selection happen on click.
		if (
			(access(props.shouldSelectOnPressUp) &&
				!access(props.allowsDifferentPressOrigin)) ||
			pointerDownType !== "mouse"
		) {
			onSelect(e);
		}
	};

	// For keyboard events, selection occurs on key down (Enter or Space bar).
	const onKeyDown: JSX.EventHandlerUnion<any, KeyboardEvent> = (e) => {
		if (!allowsSelection() || !["Enter", " "].includes(e.key)) {
			return;
		}

		if (isNonContiguousSelectionModifier(e)) {
			manager().toggleSelection(key());
		} else {
			onSelect(e);
		}
	};

	const onMouseDown = (e: MouseEvent) => {
		if (isDisabled()) {
			// Prevent focus going to the body when clicking on a disabled item.
			e.preventDefault();
		}
	};

	const onFocus = (e: FocusEvent) => {
		const refEl = ref();

		if (shouldUseVirtualFocus() || isDisabled() || !refEl) {
			return;
		}

		if (e.target === refEl) {
			manager().setFocusedKey(key());
		}
	};

	// Set tabIndex to 0 if the element is focused,
	// or -1 otherwise so that only the last focused item is tabbable.
	// If using virtual focus, don't set a tabIndex at all so that VoiceOver
	// on iOS 14 doesn't try to move real DOM focus to the item anyway.
	const tabIndex = createMemo(() => {
		if (shouldUseVirtualFocus() || isDisabled()) {
			return undefined;
		}

		return key() === manager().focusedKey() ? 0 : -1;
	});

	// data-attribute used in selection manager and keyboard delegate
	const dataKey = createMemo(() => {
		return access(props.virtualized) ? undefined : key();
	});

	// Focus the associated DOM node when this item becomes the focusedKey.
	createEffect(
		on(
			[
				ref,
				key,
				shouldUseVirtualFocus,
				() => manager().focusedKey(),
				() => manager().isFocused(),
			],
			([refEl, key, shouldUseVirtualFocus, focusedKey, isFocused]) => {
				if (
					refEl &&
					key === focusedKey &&
					isFocused &&
					!shouldUseVirtualFocus &&
					document.activeElement !== refEl
				) {
					if (props.focus) {
						props.focus();
					} else {
						focusWithoutScrolling(refEl);
					}
				}
			},
		),
	);

	return {
		isSelected,
		isDisabled,
		allowsSelection,
		tabIndex,
		dataKey,
		onPointerDown,
		onPointerUp,
		onClick,
		onKeyDown,
		onMouseDown,
		onFocus,
	};
}
