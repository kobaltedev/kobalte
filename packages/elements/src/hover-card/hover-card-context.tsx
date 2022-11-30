import { createContext, useContext } from "solid-js";

export interface HoverCardContextValue {}

export const HoverCardContext = createContext<HoverCardContextValue>();

export function useHoverCardContext() {
  const context = useContext(HoverCardContext);

  if (context === undefined) {
    throw new Error("[kobalte]: `useHoverCardContext` must be used within a `HoverCard` component");
  }

  return context;
}
