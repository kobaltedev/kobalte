import { Accessor, createContext, Setter, useContext } from "solid-js";

import { CreatePresenceResult } from "../primitives";

export interface DialogContextValue {
  isOpen: Accessor<boolean>;
  modal: Accessor<boolean>;
  contentId: Accessor<string | undefined>;
  titleId: Accessor<string | undefined>;
  descriptionId: Accessor<string | undefined>;
  triggerRef: Accessor<HTMLElement | undefined>;
  overlayPresence: CreatePresenceResult;
  contentPresence: CreatePresenceResult;
  close: () => void;
  toggle: () => void;
  setTriggerRef: Setter<HTMLElement>;
  generateId: (part: string) => string;
  registerContentId: (id: string) => () => void;
  registerTitleId: (id: string) => () => void;
  registerDescriptionId: (id: string) => () => void;
}

export const DialogContext = createContext<DialogContextValue>();

export function useDialogContext() {
  const context = useContext(DialogContext);

  if (context === undefined) {
    throw new Error("[kobalte]: `useDialogContext` must be used within a `Dialog` component");
  }

  return context;
}
