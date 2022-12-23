import { createContext, useContext } from "solid-js";

export interface DismissableLayerContextValue {
  registerNestedDismissableLayer: (element: Element) => () => void;
}

export const DismissableLayerContext = createContext<DismissableLayerContextValue>();

export function useOptionalDismissableLayerContext() {
  return useContext(DismissableLayerContext);
}

export function useDismissableLayerContext() {
  const context = useOptionalDismissableLayerContext();

  if (context === undefined) {
    throw new Error(
      "[kobalte]: `useDismissableLayerContext` must be used within a `DismissableLayerContext.Provider` component"
    );
  }

  return context;
}
