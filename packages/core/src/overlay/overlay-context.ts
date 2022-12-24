import { createContext, useContext } from "solid-js";

export interface OverlayContextValue {
  registerNestedOverlay: (element: Element) => () => void;
}

export const OverlayContext = createContext<OverlayContextValue>();

export function useOptionalOverlayContext() {
  return useContext(OverlayContext);
}

export function useOverlayContext() {
  const context = useOptionalOverlayContext();

  if (context === undefined) {
    throw new Error("[kobalte]: `useOverlayContext` must be used within a `Overlay` component");
  }

  return context;
}
