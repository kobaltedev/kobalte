import { type Accessor, createContext, useContext } from "solid-js";

export interface DismissableLayerContextValue {
	registerNestedLayer: (element: Element) => () => void;
	nestedLayers: Accessor<Element[]>;
}

export const DismissableLayerContext =
	createContext<DismissableLayerContextValue | null>(null);

export function useOptionalDismissableLayerContext():
	| DismissableLayerContextValue
	| undefined {
	return useContext(DismissableLayerContext) ?? undefined;
}
