import type { Orientation } from "@kobalte/utils";
import {
	type Accessor,
	type Setter,
	createContext,
	useContext,
} from "solid-js";

export interface SegmentedControlContextValue {
	value: Accessor<string | undefined>;
	defaultValue: Accessor<string | undefined>;
	orientation: Accessor<Orientation | undefined>;
	root: Accessor<HTMLElement | undefined>;
	selectedItem: Accessor<HTMLElement | undefined>;
	setSelectedItem: Setter<HTMLElement | undefined>;
}

export const SegmentedControlContext =
	createContext<SegmentedControlContextValue>();

export function useSegmentedControlContext() {
	const context = useContext(SegmentedControlContext);

	if (context === undefined) {
		throw new Error(
			"[kobalte]: `useSegmentedControlContext` must be used within a `SegmentedControl` component",
		);
	}

	return context;
}
