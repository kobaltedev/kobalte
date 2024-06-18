import { type Accessor, createContext, useContext } from "solid-js";

export interface HoverCardDataSet {
	"data-expanded": string | undefined;
	"data-closed": string | undefined;
}

export interface HoverCardContextValue {
	dataset: Accessor<HoverCardDataSet>;
	isOpen: Accessor<boolean>;
	contentPresent: Accessor<boolean>;
	openWithDelay: () => void;
	closeWithDelay: () => void;
	cancelOpening: () => void;
	cancelClosing: () => void;
	close: () => void;
	isTargetOnHoverCard: (target: Node | null) => boolean;
	setTriggerRef: (el: HTMLElement) => void;
	setContentRef: (el: HTMLElement) => void;
}

export const HoverCardContext = createContext<HoverCardContextValue>();

export function useHoverCardContext() {
	const context = useContext(HoverCardContext);

	if (context === undefined) {
		throw new Error(
			"[kobalte]: `useHoverCardContext` must be used within a `HoverCard` component",
		);
	}

	return context;
}
