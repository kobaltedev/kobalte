import { Accessor, createContext, Setter, useContext } from "solid-js";

export interface NavigationMenuContextValue {
	delayDuration: Accessor<number>;
	skipDelayDuration: Accessor<number>;
	autoFocusMenu: Accessor<boolean>;
	setAutoFocusMenu: Setter<boolean>;
	startLeaveTimer: () => void;
	cancelLeaveTimer: () => void;
}

export const NavigationMenuContext = createContext<NavigationMenuContextValue>();

export function useOptionalNavigationMenuContext() {
	return useContext(NavigationMenuContext);
}

export function useNavigationMenuContext() {
	const context = useOptionalNavigationMenuContext();

	if (context === undefined) {
		throw new Error(
			"[kobalte]: `useNavigationMenuContext` must be used within a `NavigationMenu` component",
		);
	}

	return context;
}
