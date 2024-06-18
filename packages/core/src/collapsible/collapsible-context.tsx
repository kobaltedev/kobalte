import { type Accessor, createContext, useContext } from "solid-js";

export interface CollapsibleDataSet {
	"data-expanded": string | undefined;
	"data-closed": string | undefined;
	"data-disabled": string | undefined;
}

export interface CollapsibleContextValue {
	dataset: Accessor<CollapsibleDataSet>;
	isOpen: Accessor<boolean>;
	disabled: Accessor<boolean>;
	shouldMount: Accessor<boolean>;
	contentId: Accessor<string | undefined>;
	toggle: () => void;
	generateId: (part: string) => string;
	registerContentId: (id: string) => () => void;
}

export const CollapsibleContext = createContext<CollapsibleContextValue>();

export function useCollapsibleContext() {
	const context = useContext(CollapsibleContext);

	if (context === undefined) {
		throw new Error(
			"[kobalte]: `useCollapsibleContext` must be used within a `Collapsible.Root` component",
		);
	}

	return context;
}
