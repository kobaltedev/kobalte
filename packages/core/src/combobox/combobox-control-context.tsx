import { createContext, useContext } from "solid-js";

import type { RovingCollection } from "../primitives/create-roving-collection";

export interface ComboboxControlContextValue {
	/** The roving-tabindex state tracking which selected chip currently has focus. */
	rovingListState: RovingCollection["listState"];

	/** Moves roving focus to the chip registered under `key`. */
	focusItemAt: (key: string) => void;
}

export const ComboboxControlContext =
	createContext<ComboboxControlContextValue>();

export function useComboboxControlContext() {
	const context = useContext(ComboboxControlContext);

	if (context === undefined) {
		throw new Error(
			"[kobalte]: `useComboboxControlContext` must be used within a `Combobox.Control` component",
		);
	}

	return context;
}
