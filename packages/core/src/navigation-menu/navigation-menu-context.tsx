import { Accessor, Setter, createContext, useContext } from "solid-js";
import { Placement } from "../popper/utils";

export interface NavigationMenuContextValue {
	delayDuration: Accessor<number>;
	skipDelayDuration: Accessor<number>;
	autoFocusMenu: Accessor<boolean>;
	setAutoFocusMenu: Setter<boolean>;
	startLeaveTimer: () => void;
	cancelLeaveTimer: () => void;
	rootRef: Accessor<HTMLElement | undefined>;
	setRootRef: Setter<HTMLElement>;
	viewportRef: Accessor<HTMLElement | undefined>;
	setViewportRef: Setter<HTMLElement>;
	currentPlacement: Accessor<Placement>;
	viewportWidth: Accessor<number | undefined>;
	setViewportWidth: Setter<number | undefined>;
	viewportHeight: Accessor<number | undefined>;
	setViewportHeight: Setter<number | undefined>;
}

export const NavigationMenuContext =
	createContext<NavigationMenuContextValue>();

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
