import type { Orientation } from "@kobalte/utils";
import {
	type Accessor,
	type Setter,
	createContext,
	useContext,
} from "solid-js";

export interface MenubarDataSet {
	"data-expanded": string | undefined;
	"data-closed": string | undefined;
}

export interface MenubarContextValue {
	dataset: Accessor<MenubarDataSet>;
	value: Accessor<string | undefined | null>;
	setValue: (
		next:
			| string
			| ((prev: string | undefined | null) => string | undefined)
			| undefined
			| null,
	) => void;
	menus: Accessor<Set<string>>;
	menuRefs: Accessor<Array<HTMLElement>>;
	menuRefMap: Accessor<Map<string, Array<HTMLElement>>>;
	lastValue: Accessor<string | undefined>;
	setLastValue: (
		next:
			| string
			| ((prev: string | undefined) => string | undefined)
			| undefined,
	) => void;
	registerMenu: (value: string, refs: Array<HTMLElement>) => void;
	unregisterMenu: (value: string) => void;
	nextMenu: () => void;
	previousMenu: () => void;
	closeMenu: () => void;
	setAutoFocusMenu: Setter<boolean>;
	autoFocusMenu: Accessor<boolean>;
	generateId: (part: string) => string;
	orientation: Accessor<Orientation>;
}

export const MenubarContext = createContext<MenubarContextValue>();

export function useOptionalMenubarContext() {
	return useContext(MenubarContext);
}

export function useMenubarContext() {
	const context = useOptionalMenubarContext();

	if (context === undefined) {
		throw new Error(
			"[kobalte]: `useMenubarContext` must be used within a `Menubar` component",
		);
	}

	return context;
}
