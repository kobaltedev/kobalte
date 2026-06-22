import { createContext, useContext } from "solid-js";

import type { DomCollectionItem } from "./types";

export interface DomCollectionContextValue<
	T extends DomCollectionItem = DomCollectionItem,
> {
	registerItem: (item: T) => () => void;
}

export const DomCollectionContext = createContext<DomCollectionContextValue | null>(null);

export function useOptionalDomCollectionContext(): DomCollectionContextValue | undefined {
	return useContext(DomCollectionContext) ?? undefined;
}

export function useDomCollectionContext<
	T extends DomCollectionItem = DomCollectionItem,
>() {
	const context = useOptionalDomCollectionContext();

	if (context === undefined) {
		throw new Error(
			"[kobalte]: `useDomCollectionContext` must be used within a `DomCollectionProvider` component",
		);
	}

	return context as DomCollectionContextValue<T>;
}
