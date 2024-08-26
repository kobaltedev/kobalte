import { type Accessor, createContext, useContext } from "solid-js";

import type { ListState } from "../list";
import type { Placement } from "../popper/utils";
import type { CollectionItemWithRef } from "../primitives";
import type { FocusStrategy } from "../selection";
import type { GraceIntent, Side } from "./utils";

export interface MenuDataSet {
	"data-expanded": string | undefined;
	"data-closed": string | undefined;
}

export interface MenuContextValue {
	dataset: Accessor<MenuDataSet>;
	isOpen: Accessor<boolean>;
	contentPresent: Accessor<boolean>;
	currentPlacement: Accessor<Placement>;
	pointerGraceTimeoutId: Accessor<number>;
	autoFocus: Accessor<FocusStrategy | boolean | undefined>;
	listState: Accessor<ListState>;
	parentMenuContext: Accessor<MenuContextValue | undefined>;
	triggerRef: Accessor<HTMLElement | undefined>;
	contentRef: Accessor<HTMLElement | undefined>;
	triggerId: Accessor<string | undefined>;
	contentId: Accessor<string | undefined>;
	setTriggerRef: (el: HTMLElement) => void;
	setContentRef: (el: HTMLElement | undefined) => void;
	open: (focusStrategy: FocusStrategy | boolean) => void;
	close: (recursively?: boolean) => void;
	toggle: (focusStrategy: FocusStrategy | boolean) => void;
	focusContent: () => void;
	onItemEnter: (e: PointerEvent) => void;
	onItemLeave: (e: PointerEvent) => void;
	onTriggerLeave: (e: PointerEvent) => void;
	setPointerDir: (dir: Side) => void;
	setPointerGraceTimeoutId: (id: number) => void;
	setPointerGraceIntent: (intent: GraceIntent | null) => void;
	registerNestedMenu: (element: HTMLElement) => () => void;
	registerItemToParentDomCollection:
		| ((item: CollectionItemWithRef) => () => void)
		| undefined;
	registerTriggerId: (id: string) => () => void;
	registerContentId: (id: string) => () => void;
	nestedMenus: Accessor<Element[]>;
}

export const MenuContext = createContext<MenuContextValue>();

export function useOptionalMenuContext() {
	return useContext(MenuContext);
}

export function useMenuContext() {
	const context = useOptionalMenuContext();

	if (context === undefined) {
		throw new Error(
			"[kobalte]: `useMenuContext` must be used within a `Menu` component",
		);
	}

	return context;
}
