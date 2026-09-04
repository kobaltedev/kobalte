import type { Accessor } from "solid-js";
import { createContext, useContext } from "solid-js";

export interface StepsItemContextValue {
	/** The index of this step. */
	index: Accessor<number>;
}

export const StepsItemContext = createContext<StepsItemContextValue>();

export function useStepsItemContext() {
	const context = useContext(StepsItemContext);

	if (context === undefined) {
		throw new Error(
			"[kobalte]: `useStepsItemContext` must be used within a `Steps.Item` component",
		);
	}

	return context;
}
