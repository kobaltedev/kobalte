import { createContext, useContext } from "solid-js";

export interface DismissableLayerContextValue {
  isElementInDismissableLayerTree: (element: Node) => boolean;
  registerNestedDismissableLayer: (element: HTMLElement) => () => void;
}

export const DismissableLayerContext = createContext<DismissableLayerContextValue>();

export function useOptionalDismissableLayerContext() {
  return useContext(DismissableLayerContext);
}

export function useDismissableLayerContext() {
  const context = useOptionalDismissableLayerContext();

  if (context === undefined) {
    throw new Error(
      "[kobalte]: `useDismissableLayerContext` must be used within a `DismissableLayerProvider` component"
    );
  }

  return context;
}
