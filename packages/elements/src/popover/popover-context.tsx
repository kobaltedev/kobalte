import { Accessor, createContext, useContext } from "solid-js";

import { Placement } from "./utils";

export interface PopoverContextValue {
  currentPlacement: Accessor<Placement>;
  positionerRef: Accessor<HTMLElement | undefined>;
  panelRef: Accessor<HTMLElement | undefined>;
  setAnchorRef: (el: HTMLElement) => void;
  setTriggerRef: (el: HTMLElement) => void;
  setPositionerRef: (el: HTMLElement) => void;
  setPanelRef: (el: HTMLElement) => void;
  setArrowRef: (el: HTMLElement) => void;
}

export const PopoverContext = createContext<PopoverContextValue>();

export function usePopoverContext() {
  const context = useContext(PopoverContext);

  if (context === undefined) {
    throw new Error("[kobalte]: `usePopoverContext` must be used within a `Popover` component");
  }

  return context;
}
