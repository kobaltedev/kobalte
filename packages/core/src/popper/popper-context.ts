import { Accessor, createContext, useContext } from "solid-js";

import { Placement } from "./utils";

export interface PopperContextValue {
  currentPlacement: Accessor<Placement>;
  contentRef: Accessor<HTMLElement | undefined>;
  setPositionerRef: (el: HTMLElement) => void;
  setArrowRef: (el: HTMLElement) => void;
}

export const PopperContext = createContext<PopperContextValue>();

export function usePopperContext() {
  const context = useContext(PopperContext);

  if (context === undefined) {
    throw new Error("[kobalte]: `usePopperContext` must be used within a `Popper` component");
  }

  return context;
}
