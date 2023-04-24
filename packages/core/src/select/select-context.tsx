import { Accessor, createContext, JSX, Setter, useContext } from "solid-js";

import { ListState } from "../list";
import { CollectionNode, CreatePresenceResult } from "../primitives";
import { FocusStrategy, KeyboardDelegate } from "../selection";

export interface SelectDataSet {
  "data-expanded": string | undefined;
  "data-closed": string | undefined;
}

export interface SelectContextValue {
  dataset: Accessor<SelectDataSet>;
  isOpen: Accessor<boolean>;
  isDisabled: Accessor<boolean>;
  isMultiple: Accessor<boolean>;
  isVirtualized: Accessor<boolean>;
  isModal: Accessor<boolean>;
  disallowTypeAhead: Accessor<boolean>;
  shouldFocusWrap: Accessor<boolean>;
  selectedOptions: Accessor<any[]>;
  contentPresence: CreatePresenceResult;
  autoFocus: Accessor<FocusStrategy | boolean>;
  triggerRef: Accessor<HTMLButtonElement | undefined>;
  triggerId: Accessor<string | undefined>;
  valueId: Accessor<string | undefined>;
  listboxId: Accessor<string | undefined>;
  listboxAriaLabelledBy: Accessor<string | undefined>;
  listState: Accessor<ListState>;
  keyboardDelegate: Accessor<KeyboardDelegate>;
  setListboxAriaLabelledBy: Setter<string | undefined>;
  setTriggerRef: (el: HTMLButtonElement) => void;
  setContentRef: (el: HTMLDivElement) => void;
  setListboxRef: (el: HTMLUListElement) => void;
  open: (focusStrategy: FocusStrategy | boolean) => void;
  close: () => void;
  toggle: (focusStrategy: FocusStrategy | boolean) => void;
  placeholder: Accessor<JSX.Element>;
  renderItem: (item: CollectionNode) => JSX.Element;
  renderSection: (section: CollectionNode) => JSX.Element;
  removeOptionFromSelection: (option: any) => void;
  generateId: (part: string) => string;
  registerTriggerId: (id: string) => () => void;
  registerValueId: (id: string) => () => void;
  registerListboxId: (id: string) => () => void;
}

export const SelectContext = createContext<SelectContextValue>();

export function useSelectContext() {
  const context = useContext(SelectContext);

  if (context === undefined) {
    throw new Error("[kobalte]: `useSelectContext` must be used within a `Select` component");
  }

  return context;
}
