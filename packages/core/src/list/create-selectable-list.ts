/*
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/8f2f2acb3d5850382ebe631f055f88c704aa7d17/packages/@react-aria/selection/src/useSelectableList.ts
 */

import { type MaybeAccessor, type Orientation, access } from "@kobalte/utils";
import { type Accessor, createMemo } from "solid-js";

import { createCollator } from "../i18n";
import type { Collection, CollectionNode } from "../primitives";
import {
	type FocusStrategy,
	type KeyboardDelegate,
	type MultipleSelectionManager,
	createSelectableCollection,
} from "../selection";
import { ListKeyboardDelegate } from "./list-keyboard-delegate";

export interface CreateSelectableListProps {
	/** State of the collection. */
	collection: Accessor<Collection<CollectionNode>>;

	/** An interface for reading and updating multiple selection state. */
	selectionManager: MaybeAccessor<MultipleSelectionManager>;

	/** A delegate that returns collection item keys with respect to visual layout. */
	keyboardDelegate?: MaybeAccessor<KeyboardDelegate | undefined>;

	/** Whether the collection or one of its items should be automatically focused upon render. */
	autoFocus?: MaybeAccessor<boolean | FocusStrategy | undefined>;

	/** Whether the autofocus should run on next tick. */
	deferAutoFocus?: MaybeAccessor<boolean | undefined>;

	/** Whether focus should wrap around when the end/start is reached. */
	shouldFocusWrap?: MaybeAccessor<boolean | undefined>;

	/** Whether the collection allows empty selection. */
	disallowEmptySelection?: MaybeAccessor<boolean | undefined>;

	/** Whether selection should occur automatically on focus. */
	selectOnFocus?: MaybeAccessor<boolean | undefined>;

	/** Whether typeahead is disabled. */
	disallowTypeAhead?: MaybeAccessor<boolean | undefined>;

	/** Whether the collection items should use virtual focus instead of being focused directly. */
	shouldUseVirtualFocus?: MaybeAccessor<boolean | undefined>;

	/** Whether navigation through tab key is enabled. */
	allowsTabNavigation?: MaybeAccessor<boolean | undefined>;

	/** Whether the option is contained in a virtual scroller. */
	isVirtualized?: MaybeAccessor<boolean | undefined>;

	/** When virtualized, the Virtualizer function used to scroll to the item of the key provided. */
	scrollToKey?: MaybeAccessor<((key: string) => void) | undefined>;

	/** The orientation of the selectable list. */
	orientation?: MaybeAccessor<Orientation | undefined>;
}

/**
 * Handles interactions with a selectable list.
 * @param props Props for the list.
 * @param ref A ref to the list element.
 * @param scrollRef The ref attached to the scrollable body. Used to provide automatic scrolling on item focus for non-virtualized collections. If not provided, defaults to the collection ref.
 */
export function createSelectableList<
	T extends HTMLElement,
	U extends HTMLElement = T,
>(
	props: CreateSelectableListProps,
	ref: Accessor<T | undefined>,
	scrollRef?: Accessor<U | undefined>,
) {
	const collator = createCollator({ usage: "search", sensitivity: "base" });

	// By default, a KeyboardDelegate is provided which uses the DOM to query layout information (e.g. for page up/page down).
	const delegate = createMemo(() => {
		const keyboardDelegate = access(props.keyboardDelegate);

		if (keyboardDelegate) {
			return keyboardDelegate;
		}

		return new ListKeyboardDelegate(props.collection, ref, collator);
	});

	return createSelectableCollection(
		{
			selectionManager: () => access(props.selectionManager),
			keyboardDelegate: delegate,
			autoFocus: () => access(props.autoFocus),
			deferAutoFocus: () => access(props.deferAutoFocus),
			shouldFocusWrap: () => access(props.shouldFocusWrap),
			disallowEmptySelection: () => access(props.disallowEmptySelection),
			selectOnFocus: () => access(props.selectOnFocus),
			disallowTypeAhead: () => access(props.disallowTypeAhead),
			shouldUseVirtualFocus: () => access(props.shouldUseVirtualFocus),
			allowsTabNavigation: () => access(props.allowsTabNavigation),
			isVirtualized: () => access(props.isVirtualized),
			scrollToKey: (key) => access(props.scrollToKey)?.(key),
			orientation: () => access(props.orientation),
		},
		ref,
		scrollRef,
	);
}
