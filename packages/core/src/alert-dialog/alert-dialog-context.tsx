import { Accessor, createContext, Setter, useContext } from "solid-js";

import { CreatePresenceResult } from "../primitives";

export interface AlertDialogContextValue {
  isOpen: Accessor<boolean>;
  isModal: Accessor<boolean>;
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

export const AlertDialogContext = createContext<AlertDialogContextValue>();

export function useAlertDialogContext() {
  const context = useContext(AlertDialogContext);

  if (context === undefined) {
    throw new Error(
      "[kobalte]: `useAlertDialogContext` must be used within an `AlertDialog` component"
    );
  }

  return context;
}
