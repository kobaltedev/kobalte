/*
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/8f2f2acb3d5850382ebe631f055f88c704aa7d17/packages/@react-aria/selection/src/useTypeSelect.ts
 */

import { type MaybeAccessor, access } from "@kobalte/utils";
import { createSignal } from "solid-js";

import type { KeyboardDelegate, MultipleSelectionManager } from "./types";

interface CreateTypeSelectProps {
	/** Whether the type to select should be disabled. */
	isDisabled?: MaybeAccessor<boolean | undefined>;

	/** A delegate that returns collection item keys with respect to visual layout. */
	keyboardDelegate: MaybeAccessor<KeyboardDelegate>;

	/** An interface for reading and updating multiple selection state. */
	selectionManager: MaybeAccessor<MultipleSelectionManager>;

	/** Called when an item is focused by typing. */
	onTypeSelect?: (key: string) => void;
}

/**
 * Handles typeahead interactions with collections.
 */
export function createTypeSelect(props: CreateTypeSelectProps) {
	const [search, setSearch] = createSignal("");
	const [timeoutId, setTimeoutId] = createSignal(-1);

	const onKeyDown = (e: KeyboardEvent) => {
		if (access(props.isDisabled)) {
			return;
		}

		const delegate = access(props.keyboardDelegate);
		const manager = access(props.selectionManager);

		if (!delegate.getKeyForSearch) {
			return;
		}

		const character = getStringForKey(e.key);
		if (!character || e.ctrlKey || e.metaKey) {
			return;
		}

		// Do not propagate the Space bar event if it's meant to be part of the search.
		// When we time out, the search term becomes empty, hence the check on length.
		// Trimming is to account for the case of pressing the Space bar more than once,
		// which should cycle through the selection/deselection of the focused item.
		if (character === " " && search().trim().length > 0) {
			e.preventDefault();
			e.stopPropagation();
		}

		let newSearch = setSearch((prev) => prev + character);

		// Use the delegate to find a key to focus.
		// Prioritize items after the currently focused item, falling back to searching the whole list.
		let key =
			delegate.getKeyForSearch(newSearch, manager.focusedKey()) ??
			delegate.getKeyForSearch(newSearch);

		// If not key found, and the search is multiple iterations of the same letter (e.g "aaa"),
		// then cycle through first-letter matches
		if (key == null && isAllSameLetter(newSearch)) {
			newSearch = newSearch[0];

			key =
				delegate.getKeyForSearch(newSearch, manager.focusedKey()) ??
				delegate.getKeyForSearch(newSearch);
		}

		if (key != null) {
			manager.setFocusedKey(key);
			props.onTypeSelect?.(key);
		}

		clearTimeout(timeoutId());

		setTimeoutId(window.setTimeout(() => setSearch(""), 500));
	};

	return {
		typeSelectHandlers: {
			onKeyDown,
		},
	};
}

function getStringForKey(key: string): string {
	// If the key is of length 1, it is an ASCII value.
	// Otherwise, if there are no ASCII characters in the key name,
	// it is a Unicode character.
	// See https://www.w3.org/TR/uievents-key/
	if (key.length === 1 || !/^[A-Z]/i.test(key)) {
		return key;
	}

	return "";
}

function isAllSameLetter(search: string): boolean {
	return search.split("").every((letter) => letter === search[0]);
}
