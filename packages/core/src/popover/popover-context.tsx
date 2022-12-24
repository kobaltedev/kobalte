import { Accessor, createContext, useContext } from "solid-js";

import { Placement } from "./utils";

export interface PopoverContextValue {
  isOpen: Accessor<boolean>;
  shouldMount: Accessor<boolean>;
  currentPlacement: Accessor<Placement>;
  contentRef: Accessor<HTMLElement | undefined>;
  contentId: Accessor<string | undefined>;
  titleId: Accessor<string | undefined>;
  descriptionId: Accessor<string | undefined>;
  isModal: Accessor<boolean>;
  closeOnEsc: Accessor<boolean>;
  closeOnInteractOutside: Accessor<boolean>;
  shouldCloseOnInteractOutside: (element: Element) => boolean;
  setDefaultAnchorRef: (el: HTMLElement) => void;
  setTriggerRef: (el: HTMLElement) => void;
  setPositionerRef: (el: HTMLElement) => void;
  setContentRef: (el: HTMLElement) => void;
  setArrowRef: (el: HTMLElement) => void;
  close: () => void;
  toggle: () => void;
  generateId: (part: string) => string;
  registerContentId: (id: string) => () => void;
  registerTitleId: (id: string) => () => void;
  registerDescriptionId: (id: string) => () => void;
}

export const PopoverContext = createContext<PopoverContextValue>();

export function usePopoverContext() {
  const context = useContext(PopoverContext);

  if (context === undefined) {
    throw new Error("[kobalte]: `usePopoverContext` must be used within a `Popover` component");
  }

  return context;
}
