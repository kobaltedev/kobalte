import { Accessor, createContext, useContext } from "solid-js";

import { CreateFocusTrapRegionProps, CreateOverlayProps } from "../primitives";

export interface DialogContextValue {
  isOpen: Accessor<boolean>;
  shouldMount: Accessor<boolean>;
  panelId: Accessor<string | undefined>;
  titleId: Accessor<string | undefined>;
  descriptionId: Accessor<string | undefined>;
  createOverlayProps: CreateOverlayProps;
  createFocusTrapRegionProps: CreateFocusTrapRegionProps;
  close: () => void;
  toggle: () => void;
  generateId: (part: string) => string;
  registerPanel: (id: string) => () => void;
  registerTitle: (id: string) => () => void;
  registerDescription: (id: string) => () => void;
}

export const DialogContext = createContext<DialogContextValue>();

export function useDialogContext() {
  const context = useContext(DialogContext);

  if (context === undefined) {
    throw new Error("[kobalte]: `useDialogContext` must be used within a `Dialog` component");
  }

  return context;
}
