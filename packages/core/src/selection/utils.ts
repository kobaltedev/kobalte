/*
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/8f2f2acb3d5850382ebe631f055f88c704aa7d17/packages/@react-aria/selection/src/utils.ts
 */

import { isAppleDevice, isMac } from "@kobalte/utils";

import { Selection } from "./types";

interface Event {
	altKey: boolean;
	ctrlKey: boolean;
	metaKey: boolean;
}

export function isNonContiguousSelectionModifier(e: Event) {
	// Ctrl + Arrow Up/Arrow Down has a system-wide meaning on macOS, so use Alt instead.
	// On Windows and Ubuntu, Alt + Space has a system-wide meaning.
	return isAppleDevice() ? e.altKey : e.ctrlKey;
}

export function isCtrlKeyPressed(e: Event) {
	if (isMac()) {
		return e.metaKey;
	}

	return e.ctrlKey;
}

export function convertSelection(selection: Iterable<string>): Selection {
	return new Selection(selection);
}

export function isSameSelection(setA: Set<string>, setB: Set<string>): boolean {
	if (setA.size !== setB.size) {
		return false;
	}

	for (const item of setA) {
		if (!setB.has(item)) {
			return false;
		}
	}

	return true;
}

/** Whether the element accepts text input (the user can type into it). */
export function isTextEntryTarget(element: Element | null): boolean {
	return (
		element instanceof HTMLInputElement ||
		element instanceof HTMLTextAreaElement ||
		(element instanceof HTMLElement && element.isContentEditable)
	);
}

/** Whether an editable (e.g. a search input) inside the menu containing `element` holds DOM focus — hover must not steal it. */
export function hasFocusedTextEntryInMenu(element: HTMLElement): boolean {
	const active = document.activeElement;

	if (!isTextEntryTarget(active)) {
		return false;
	}

	return element.closest('[role="menu"]')?.contains(active) ?? false;
}
