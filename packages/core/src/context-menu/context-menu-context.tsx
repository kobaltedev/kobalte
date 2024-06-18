import { type Setter, createContext, useContext } from "solid-js";

export interface ContextMenuContextValue {
	setAnchorRect: Setter<{ x: number; y: number }>;
}

export const ContextMenuContext = createContext<ContextMenuContextValue>();

export function useOptionalContextMenuContext() {
	return useContext(ContextMenuContext);
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
