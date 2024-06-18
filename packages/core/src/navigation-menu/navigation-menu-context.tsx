import {
	type Accessor,
	type Setter,
	createContext,
	useContext,
} from "solid-js";
import type { Placement } from "../popper/utils";

export interface NavigationMenuDataSet {
	"data-expanded": string | undefined;
	"data-closed": string | undefined;
}

export interface NavigationMenuContextValue {
	dataset: Accessor<NavigationMenuDataSet>;
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
	viewportPresent: Accessor<boolean>;
	currentPlacement: Accessor<Placement>;
	previousMenu: Accessor<string | undefined>;
	setPreviousMenu: Setter<string | undefined>;
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
