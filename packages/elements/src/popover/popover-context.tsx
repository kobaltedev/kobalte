import { Accessor, createContext, useContext } from "solid-js";

import { CreateDisclosureResult } from "../primitives";
import { Placement } from "./utils";

export interface PopoverDataSet {
  "data-open": string | undefined;
  "data-placement": string | undefined;
}

export interface PopoverContextValue extends CreateDisclosureResult {
  dataset: Accessor<PopoverDataSet>;
  ariaControls: Accessor<string | undefined>;
  ariaLabel: Accessor<string | undefined>;
  ariaLabelledBy: Accessor<string | undefined>;
  ariaDescribedBy: Accessor<string | undefined>;
  currentPlacement: Accessor<Placement>;
  positionerRef: Accessor<HTMLElement | undefined>;
  panelRef: Accessor<HTMLElement | undefined>;
  setAnchorRef: (el: HTMLElement) => void;
  setTriggerRef: (el: HTMLElement) => void;
  setPositionerRef: (el: HTMLElement) => void;
  setPanelRef: (el: HTMLElement) => void;
  setArrowRef: (el: HTMLElement) => void;
  generateId: (part: string) => string;
  registerPanel: (id: string) => () => void;
  registerTitle: (id: string) => () => void;
  registerDescription: (id: string) => () => void;

  // Overlay related
  isModal: Accessor<boolean | undefined>;
  preventScroll: Accessor<boolean | undefined>;
  closeOnInteractOutside: Accessor<boolean | undefined>;
  closeOnEsc: Accessor<boolean | undefined>;
  shouldCloseOnInteractOutside: (element: Element) => boolean;

  // FocusTrapRegion related
  trapFocus: Accessor<boolean | undefined>;
  autoFocus: Accessor<boolean | undefined>;
  restoreFocus: Accessor<boolean | undefined>;
  initialFocusSelector: Accessor<string | undefined>;
  restoreFocusSelector: Accessor<string | undefined>;
}

export const PopoverContext = createContext<PopoverContextValue>();

export function usePopoverContext() {
  const context = useContext(PopoverContext);

  if (context === undefined) {
    throw new Error("[kobalte]: `usePopoverContext` must be used within a `Popover` component");
  }

  return context;
}
