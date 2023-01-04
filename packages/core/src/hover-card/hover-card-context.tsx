import { Accessor, createContext, useContext } from "solid-js";

export interface HoverCardContextValue {
  isOpen: Accessor<boolean>;
  shouldMount: Accessor<boolean>;
  openWithDelay: () => void;
  closeWithDelay: () => void;
  cancelOpening: () => void;
  cancelClosing: () => void;
  close: () => void;
  isTargetOnHoverCard: (target: Node | null) => boolean;
  setTriggerRef: (el: HTMLElement) => void;
  setContentRef: (el: HTMLElement) => void;
}

export const HoverCardContext = createContext<HoverCardContextValue>();

export function useHoverCardContext() {
  const context = useContext(HoverCardContext);

  if (context === undefined) {
    throw new Error("[kobalte]: `useHoverCardContext` must be used within a `HoverCard` component");
  }

  return context;
}
