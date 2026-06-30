import { createContext, type Setter, useContext } from "solid-js";

export interface ContextMenuContextValue {
	setAnchorRect: Setter<{ x: number; y: number }>;
}

export const ContextMenuContext = createContext<ContextMenuContextValue | null>(
	null,
);

export function useOptionalContextMenuContext():
	| ContextMenuContextValue
	| undefined {
	return useContext(ContextMenuContext) ?? undefined;
}

export function useContextMenuContext() {
	const context = useOptionalContextMenuContext();

	if (context === undefined) {
		throw new Error(
			"[kobalte]: `useContextMenuContext` must be used within a `ContextMenu` component",
		);
	}

	return context;
}
