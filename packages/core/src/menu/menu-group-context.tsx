import { createContext, useContext } from "solid-js";

export interface MenuGroupContextValue {
	generateId: (part: string) => string;
	registerLabelId: (id: string) => () => void;
}

export const MenuGroupContext = createContext<MenuGroupContextValue>();

export function useMenuGroupContext() {
	const context = useContext(MenuGroupContext);

	if (context === undefined) {
		throw new Error(
			"[kobalte]: `useMenuGroupContext` must be used within a `Menu.Group` component",
		);
	}

	return context;
}
