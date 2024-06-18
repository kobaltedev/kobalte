import { type JSX, createContext, useContext } from "solid-js";

export interface BreadcrumbsContextValue {
	separator: () => string | JSX.Element;
}

export const BreadcrumbsContext = createContext<BreadcrumbsContextValue>();

export function useBreadcrumbsContext() {
	const context = useContext(BreadcrumbsContext);

	if (context === undefined) {
		throw new Error(
			"[kobalte]: `useBreadcrumbsContext` must be used within a `Breadcrumbs.Root` component",
		);
	}

	return context;
}
