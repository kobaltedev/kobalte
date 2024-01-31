import { createContext, useContext } from "solid-js";

export interface DismissableLayerContextValue {
	registerNestedLayer: (element: Element) => () => void;
}

export const DismissableLayerContext =
	createContext<DismissableLayerContextValue>();

export function useOptionalDismissableLayerContext() {
	return useContext(DismissableLayerContext);
}
