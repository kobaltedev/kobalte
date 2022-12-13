import { Accessor, createContext, useContext } from "solid-js";

import { CreateFocusTrapRegionProps, CreateOverlayProps } from "../primitives";
import { Placement } from "./utils";

export interface PopoverContextValue {
  isOpen: Accessor<boolean>;
  shouldMount: Accessor<boolean>;
  currentPlacement: Accessor<Placement>;
  panelRef: Accessor<HTMLElement | undefined>;
  panelId: Accessor<string | undefined>;
  titleId: Accessor<string | undefined>;
  descriptionId: Accessor<string | undefined>;
  createOverlayProps: CreateOverlayProps;
  createFocusTrapRegionProps: CreateFocusTrapRegionProps;
  setDefaultAnchorRef: (el: HTMLElement) => void;
  setTriggerRef: (el: HTMLElement) => void;
  setPositionerRef: (el: HTMLElement) => void;
  setPanelRef: (el: HTMLElement) => void;
  setArrowRef: (el: HTMLElement) => void;
  close: () => void;
  toggle: () => void;
  generateId: (part: string) => string;
  registerPanel: (id: string) => () => void;
  registerTitle: (id: string) => () => void;
  registerDescription: (id: string) => () => void;
}

export const PopoverContext = createContext<PopoverContextValue>();

export function usePopoverContext() {
  const context = useContext(PopoverContext);

  if (context === undefined) {
    throw new Error("[kobalte]: `usePopoverContext` must be used within a `Popover` component");
  }

  return context;
}
