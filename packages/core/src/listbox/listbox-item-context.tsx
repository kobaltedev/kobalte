import { type Accessor, createContext, useContext } from "solid-js";

export interface ListboxItemDataSet {
	"data-disabled": string | undefined;
	"data-selected": string | undefined;
	"data-highlighted": string | undefined;
}

export interface ListboxItemContextValue {
	isSelected: Accessor<boolean>;
	dataset: Accessor<ListboxItemDataSet>;
	generateId: (part: string) => string;
	registerLabelId: (id: string) => () => void;
	registerDescriptionId: (id: string) => () => void;
}

export const ListboxItemContext = createContext<ListboxItemContextValue>();

export function useListboxItemContext() {
	const context = useContext(ListboxItemContext);

	if (context === undefined) {
		throw new Error(
			"[kobalte]: `useListboxItemContext` must be used within a `Listbox.Item` component",
		);
	}

	return context;
}
