import { Accessor, createContext, useContext } from "solid-js";

import { CreateDisclosureResult } from "../primitives";

export interface DialogDataSet {
  "data-open": string | undefined;
}

export interface DialogContextValue extends CreateDisclosureResult {
  dataset: Accessor<DialogDataSet>;
  ariaControls: Accessor<string | undefined>;
  ariaLabel: Accessor<string | undefined>;
  ariaLabelledBy: Accessor<string | undefined>;
  ariaDescribedBy: Accessor<string | undefined>;
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

export const DialogContext = createContext<DialogContextValue>();

export function useDialogContext() {
  const context = useContext(DialogContext);

  if (context === undefined) {
    throw new Error("[kobalte]: `useDialogContext` must be used within a `Dialog` component");
  }

  return context;
}

export interface DialogPortalContextValue {
  forceMount: Accessor<boolean | undefined>;
}

export const DialogPortalContext = createContext<DialogPortalContextValue>();

export function useDialogPortalContext() {
  return useContext(DialogPortalContext);
}
