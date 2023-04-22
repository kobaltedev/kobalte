import { Accessor, createContext, JSX, useContext } from "solid-js";

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
  isVirtualized: Accessor<boolean>;
  isModal: Accessor<boolean>;
  isInputFocused: Accessor<boolean>;
  allowsEmptyCollection: Accessor<boolean>;
  shouldFocusWrap: Accessor<boolean>;
  removeOnBackspace: Accessor<boolean>;
  selectedOptions: Accessor<any[]>;
  contentPresence: CreatePresenceResult;
  autoFocus: Accessor<FocusStrategy | boolean>;
  activeDescendant: Accessor<string | undefined>;
  inputValue: Accessor<string | undefined>;
  triggerMode: Accessor<ComboboxTriggerMode>;
  controlRef: Accessor<HTMLDivElement | undefined>;
  inputRef: Accessor<HTMLInputElement | undefined>;
  triggerRef: Accessor<HTMLButtonElement | undefined>;
  contentRef: Accessor<HTMLDivElement | undefined>;
  listboxId: Accessor<string | undefined>;
  triggerAriaLabel: Accessor<string | undefined>;
  listboxAriaLabel: Accessor<string | undefined>;
  listState: Accessor<ListState>;
  keyboardDelegate: Accessor<KeyboardDelegate>;
  resetInputValue: () => void;
  setIsInputFocused: (isFocused: boolean) => void;
  setInputValue: (value: string) => void;
  setControlRef: (el: HTMLDivElement) => void;
  setInputRef: (el: HTMLInputElement) => void;
  setTriggerRef: (el: HTMLButtonElement) => void;
  setContentRef: (el: HTMLDivElement) => void;
  setListboxRef: (el: HTMLUListElement) => void;
  open: (focusStrategy: FocusStrategy | boolean, triggerMode?: ComboboxTriggerMode) => void;
  close: () => void;
  toggle: (focusStrategy: FocusStrategy | boolean, triggerMode?: ComboboxTriggerMode) => void;
  placeholder: Accessor<JSX.Element>;
  renderItem: (item: CollectionNode) => JSX.Element;
  renderSection: (section: CollectionNode) => JSX.Element;
  removeOptionFromSelection: (option: any) => void;
  onInputKeyDown: JSX.EventHandlerUnion<HTMLInputElement, KeyboardEvent>;
  generateId: (part: string) => string;
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
