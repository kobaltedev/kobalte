import { Calendar } from "@internationalized/date";
import { Accessor, createContext, JSX, useContext } from "solid-js";

import { DateValue } from "../calendar/types";
import { LocalizedMessageFormatter } from "../i18n";
import { CreatePresenceResult } from "../primitives";

export interface DatePickerDataSet {
  "data-expanded": string | undefined;
  "data-closed": string | undefined;
}

export interface DatePickerContextValue {
  dataset: Accessor<DatePickerDataSet>;
  isOpen: Accessor<boolean>;
  isDisabled: Accessor<boolean>;
  isModal: Accessor<boolean>;
  contentPresence: CreatePresenceResult;
  messageFormatter: Accessor<LocalizedMessageFormatter>;
  locale: Accessor<string>;
  contentId: Accessor<string | undefined>;
  controlRef: Accessor<HTMLDivElement | undefined>;
  inputRef: Accessor<HTMLDivElement | undefined>;
  triggerRef: Accessor<HTMLButtonElement | undefined>;
  contentRef: Accessor<HTMLDivElement | undefined>;
  setControlRef: (el: HTMLDivElement) => void;
  setInputRef: (el: HTMLDivElement) => void;
  setTriggerRef: (el: HTMLButtonElement) => void;
  setContentRef: (el: HTMLDivElement) => void;
  createCalendar: (name: string) => Calendar;
  close: () => void;
  toggle: () => void;
  generateId: (part: string) => string;
  registerContentId: (id: string) => () => void;
}

export const DatePickerContext = createContext<DatePickerContextValue>();

export function useDatePickerContext() {
  const context = useContext(DatePickerContext);

  if (context === undefined) {
    throw new Error(
      "[kobalte]: `useDatePickerContext` must be used within a `DatePicker` component"
    );
  }

  return context;
}
