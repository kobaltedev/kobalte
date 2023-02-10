import { Accessor, createContext, useContext } from "solid-js";

import { CreatePresenceResult } from "../primitives";

export interface PopoverDataSet {
  "data-expanded": string | undefined;
  "data-closed": string | undefined;
}

export interface PopoverContextValue {
  dataset: Accessor<PopoverDataSet>;
  isOpen: Accessor<boolean>;
  isModal: Accessor<boolean>;
  contentPresence: CreatePresenceResult;
  triggerRef: Accessor<HTMLElement | undefined>;
  contentId: Accessor<string | undefined>;
  titleId: Accessor<string | undefined>;
  descriptionId: Accessor<string | undefined>;
  setDefaultAnchorRef: (el: HTMLElement) => void;
  setTriggerRef: (el: HTMLElement) => void;
  setContentRef: (el: HTMLElement) => void;
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
