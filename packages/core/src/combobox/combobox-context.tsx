import { Accessor, createContext, JSX, Setter, useContext } from "solid-js";

import { ListState } from "../list";
import { CollectionNode, CreatePresenceResult } from "../primitives";
import { FocusStrategy, KeyboardDelegate } from "../selection";
import { ComboboxTriggerMode } from "./types";

export interface ComboboxDataSet {
  "data-expanded": string | undefined;
  "data-closed": string | undefined;
}

export interface ComboboxContextValue {
  dataset: Accessor<ComboboxDataSet>;
  isOpen: Accessor<boolean>;
  isDisabled: Accessor<boolean>;
  isMultiple: Accessor<boolean>;
  isVirtualized: Accessor<boolean | undefined>;
  isModal: Accessor<boolean>;
  isFocused: Accessor<boolean>;
  shouldFocusWrap: Accessor<boolean>;
  contentPresence: CreatePresenceResult;
  autoFocus: Accessor<FocusStrategy | boolean>;
  inputValue: Accessor<string | undefined>;
  inputRef: Accessor<HTMLInputElement | undefined>;
  buttonRef: Accessor<HTMLButtonElement | undefined>;
  contentRef: Accessor<HTMLDivElement | undefined>;
  inputId: Accessor<string | undefined>;
  listboxId: Accessor<string | undefined>;
  listboxAriaLabelledBy: Accessor<string | undefined>;
  listState: Accessor<ListState>;
  keyboardDelegate: Accessor<KeyboardDelegate>;
  setListboxAriaLabelledBy: Setter<string | undefined>;
  setIsFocused: (isFocused: boolean) => void;
  setInputValue: (value: string) => void;
  setInputRef: (el: HTMLInputElement) => void;
  setButtonRef: (el: HTMLButtonElement) => void;
  setContentRef: (el: HTMLDivElement) => void;
  setListboxRef: (el: HTMLUListElement) => void;
  open: (focusStrategy: FocusStrategy | boolean, triggerMode?: ComboboxTriggerMode) => void;
  close: () => void;
  toggle: (focusStrategy: FocusStrategy | boolean, triggerMode?: ComboboxTriggerMode) => void;
  placeholder: Accessor<JSX.Element>;
  renderItem: (item: CollectionNode) => JSX.Element;
  renderSection: (section: CollectionNode) => JSX.Element;
  renderValue: () => JSX.Element;
  onInputKeyDown: JSX.EventHandlerUnion<HTMLInputElement, KeyboardEvent>;
  generateId: (part: string) => string;
  registerInputId: (id: string) => () => void;
  registerListboxId: (id: string) => () => void;
}

export const ComboboxContext = createContext<ComboboxContextValue>();

export function useComboboxContext() {
  const context = useContext(ComboboxContext);

  if (context === undefined) {
    throw new Error("[kobalte]: `useComboboxContext` must be used within a `Combobox` component");
  }

  return context;
}
