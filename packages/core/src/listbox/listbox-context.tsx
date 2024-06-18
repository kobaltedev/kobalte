import { type Accessor, createContext, useContext } from "solid-js";

import type { ListState } from "../list";

export interface ListboxContextValue {
	listState: Accessor<ListState>;
	generateId: (part: string) => string;
	shouldUseVirtualFocus: Accessor<boolean | undefined>;
	shouldSelectOnPressUp: Accessor<boolean | undefined>;
	shouldFocusOnHover: Accessor<boolean | undefined>;
	isVirtualized: Accessor<boolean | undefined>;
}

export const ListboxContext = createContext<ListboxContextValue>();

export function useListboxContext() {
	const context = useContext(ListboxContext);

	if (context === undefined) {
		throw new Error(
			"[kobalte]: `useListboxContext` must be used within a `Listbox` component",
		);
	}

	return context;
}
