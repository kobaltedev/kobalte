import { DateDuration } from "@internationalized/date";
import { Accessor, createContext, useContext } from "solid-js";

import { LocalizedMessageFormatter } from "../i18n";
import { DateValue } from "./types";

export interface CalendarDataSet {}

export interface CalendarContextValue {
  dataset: Accessor<CalendarDataSet>;
  startDate: Accessor<DateValue>;
  endDate: Accessor<DateValue>;
  focusedDate: Accessor<DateValue>;
  visibleDuration: Accessor<DateDuration>;
  locale: Accessor<string>;
  min: Accessor<DateValue | undefined>;
  max: Accessor<DateValue | undefined>;
  messageFormatter: Accessor<LocalizedMessageFormatter>;
  isDisabled: Accessor<boolean>;
  setStartDate: (date: DateValue) => void;
  setFocusedDate: (date: DateValue) => void;
  setIsFocused: (value: boolean) => void;
}

export const CalendarContext = createContext<CalendarContextValue>();

export function useCalendarContext() {
  const context = useContext(CalendarContext);

  if (context === undefined) {
    throw new Error("[kobalte]: `useCalendarContext` must be used within a `Calendar` component");
  }

  return context;
}
