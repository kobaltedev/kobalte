import { Accessor, createContext, useContext } from "solid-js";

export interface PopoverContextValue {
  isOpen: Accessor<boolean>;
  isModal: Accessor<boolean>;
  shouldMount: Accessor<boolean>;
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
