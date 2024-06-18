import { type Accessor, createContext, useContext } from "solid-js";

export interface AccordionItemContextValue {
	value: Accessor<string>;
	triggerId: Accessor<string | undefined>;
	contentId: Accessor<string | undefined>;
	generateId: (part: string) => string;
	registerTriggerId: (id: string) => () => void;
	registerContentId: (id: string) => () => void;
}

export const AccordionItemContext = createContext<AccordionItemContextValue>();

export function useAccordionItemContext() {
	const context = useContext(AccordionItemContext);

	if (context === undefined) {
		throw new Error(
			"[kobalte]: `useAccordionItemContext` must be used within a `Accordion.Item` component",
		);
	}

	return context;
}
