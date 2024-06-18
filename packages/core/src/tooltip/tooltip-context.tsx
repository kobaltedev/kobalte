import { type Accessor, createContext, useContext } from "solid-js";

export interface TooltipDataSet {
	"data-expanded": string | undefined;
	"data-closed": string | undefined;
}

export interface TooltipContextValue {
	dataset: Accessor<TooltipDataSet>;
	isOpen: Accessor<boolean>;
	isDisabled: Accessor<boolean>;
	triggerOnFocusOnly: Accessor<boolean>;
	contentId: Accessor<string | undefined>;
	contentPresent: Accessor<boolean>;
	openTooltip: (immediate?: boolean) => void;
	hideTooltip: (immediate?: boolean) => void;
	cancelOpening: () => void;
	generateId: (part: string) => string;
	registerContentId: (id: string) => () => void;
	isTargetOnTooltip: (target: Node | null) => boolean;
	setTriggerRef: (el: HTMLElement) => void;
	setContentRef: (el: HTMLElement) => void;
}

export const TooltipContext = createContext<TooltipContextValue>();

export function useTooltipContext() {
	const context = useContext(TooltipContext);

	if (context === undefined) {
		throw new Error(
			"[kobalte]: `useTooltipContext` must be used within a `Tooltip` component",
		);
	}

	return context;
}
