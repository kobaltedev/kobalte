import { type Accessor, createContext, useContext } from "solid-js";

export interface MenuItemDataSet {
	"data-indeterminate": string | undefined;
	"data-checked": string | undefined;
	"data-disabled": string | undefined;
	"data-highlighted": string | undefined;
}

export interface MenuItemContextValue {
	isChecked: Accessor<boolean | undefined>;
	dataset: Accessor<MenuItemDataSet>;
	setLabelRef: (el: HTMLElement) => void;
	generateId: (part: string) => string;
	registerLabel: (id: string) => () => void;
	registerDescription: (id: string) => () => void;
}

export const MenuItemContext = createContext<MenuItemContextValue>();

export function useMenuItemContext() {
	const context = useContext(MenuItemContext);

	if (context === undefined) {
		throw new Error(
			"[kobalte]: `useMenuItemContext` must be used within a `Menu.Item` component",
		);
	}

	return context;
}
