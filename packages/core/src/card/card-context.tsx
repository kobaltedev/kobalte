import { createContext, useContext } from "solid-js";

export interface CardContextValue {
	generateId: (part: string) => string;
	registerTitleId: (id: string) => () => void;
	registerDescriptionId: (id: string) => () => void;
}

export const CardContext = createContext<CardContextValue>();

export function useCardContext() {
	const context = useContext(CardContext);

	if (context === undefined) {
		throw new Error(
			"[kobalte]: `useCardContext` must be used within a `Card` component",
		);
	}

	return context;
}
