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
  isVirtualized: Accessor<boolean | undefined>;
  isModal: Accessor<boolean>;
  isInputFocused: Accessor<boolean>;
  isValidInputValue: Accessor<boolean>;
  allowsEmptyCollection: Accessor<boolean>;
  shouldFocusWrap: Accessor<boolean>;
  contentPresence: CreatePresenceResult;
  autoFocus: Accessor<FocusStrategy | boolean>;
  activeDescendant: Accessor<string | undefined>;
  inputValue: Accessor<string | undefined>;
  triggerMode: Accessor<ComboboxTriggerMode>;
  triggerRef: Accessor<HTMLDivElement | undefined>;
  inputRef: Accessor<HTMLInputElement | undefined>;
  buttonRef: Accessor<HTMLButtonElement | undefined>;
  contentRef: Accessor<HTMLDivElement | undefined>;
  inputId: Accessor<string | undefined>;
  valueId: Accessor<string | undefined>;
  listboxId: Accessor<string | undefined>;
  buttonAriaLabel: Accessor<string | undefined>;
  listboxAriaLabel: Accessor<string | undefined>;
  listState: Accessor<ListState>;
  keyboardDelegate: Accessor<KeyboardDelegate>;
  resetInputAfterClose: () => void;
  resetInputValue: () => void;
  setIsInputFocused: (isFocused: boolean) => void;
  setInputValue: (value: string) => void;
  setTriggerRef: (el: HTMLDivElement) => void;
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
  onInputKeyDown: JSX.EventHandlerUnion<HTMLInputElement, KeyboardEvent>;
  generateId: (part: string) => string;
  registerInputId: (id: string) => () => void;
  registerValueId: (id: string) => () => void;
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
