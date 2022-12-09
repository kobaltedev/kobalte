import { Accessor, createContext, useContext } from "solid-js";

import { CreateDisclosureResult } from "../primitives";
import { DialogFocusTrapRegionProps, DialogOverlayProps } from "./dialog";

export interface DialogDataSet {
  "data-expanded": string | undefined;
}

export interface DialogContextValue extends CreateDisclosureResult {
  dataset: Accessor<DialogDataSet>;
  panelId: Accessor<string | undefined>;
  titleId: Accessor<string | undefined>;
  descriptionId: Accessor<string | undefined>;
  overlayProps: Accessor<DialogOverlayProps>;
  focusTrapRegionProps: Accessor<DialogFocusTrapRegionProps>;
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

export interface DialogPortalContextValue {
  forceMount: Accessor<boolean | undefined>;
}

export const DialogPortalContext = createContext<DialogPortalContextValue>();

export function useDialogPortalContext() {
  return useContext(DialogPortalContext);
}
