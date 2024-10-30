import { type Accessor, createContext, useContext } from "solid-js";

export interface SearchContextValue {
	/** No results found */
	noResult: Accessor<boolean>;

	/** Are we currently loading suggestions? */
	isLoadingSuggestions: Accessor<boolean>;
}

export const SearchContext = createContext<SearchContextValue>();

export function useSearchContext() {
	const context = useContext(SearchContext);

	if (context === undefined) {
		throw new Error(
			"[kobalte]: `useSearchContext` must be used within a `Search` component",
		);
	}

	return context;
}
