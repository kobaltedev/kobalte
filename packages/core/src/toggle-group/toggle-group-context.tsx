import type { Orientation } from "@kobalte/utils";
import { type Accessor, createContext, useContext } from "solid-js";
import type { ListState } from "../list";

export interface ToggleGroupContextValue {
	isMultiple: Accessor<boolean>;
	isDisabled: Accessor<boolean>;
	listState: Accessor<ListState>;
	generateId: (part: string) => string;
	orientation: Accessor<Orientation>;
}

export const ToggleGroupContext = createContext<ToggleGroupContextValue>();

export function useToggleGroupContext() {
	const context = useContext(ToggleGroupContext);

	if (context === undefined) {
		throw new Error(
			"[kobalte]: `useToggleGroupContext` must be used within a `ToggleGroup` component",
		);
	}

	return context;
}
