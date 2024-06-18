import {
	type Accessor,
	type JSX,
	type Setter,
	createContext,
	useContext,
} from "solid-js";

export interface PaginationContextValue {
	count: Accessor<number>;
	siblingCount: Accessor<number>;
	showFirst: Accessor<boolean>;
	showLast: Accessor<boolean>;
	fixedItems: Accessor<boolean | "no-ellipsis">;
	isDisabled: Accessor<boolean>;
	renderItem: (page: number) => JSX.Element;
	renderEllipsis: () => JSX.Element;
	page: Accessor<number>;
	setPage: Setter<number>;
}

export const PaginationContext = createContext<PaginationContextValue>();

export function usePaginationContext() {
	const context = useContext(PaginationContext);

	if (context === undefined) {
		throw new Error(
			"[kobalte]: `usePaginationContext` must be used within a `Pagination` component",
		);
	}

	return context;
}
