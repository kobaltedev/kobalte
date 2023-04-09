import { Accessor, createContext, useContext } from "solid-js";

import { DateValue } from "./types";

export interface CalendarCellContextValue {
  date: Accessor<DateValue>;
  isSelected: Accessor<boolean>;
  isFocused: Accessor<boolean>;
  isDisabled: Accessor<boolean>;
  isUnavailable: Accessor<boolean>;
  isSelectable: Accessor<boolean>;
  isInvalid: Accessor<boolean>;
  isDateToday: Accessor<boolean>;
}

export const CalendarCellContext = createContext<CalendarCellContextValue>();

export function useCalendarCellContext() {
  const context = useContext(CalendarCellContext);

  if (context === undefined) {
    throw new Error(
      "[kobalte]: `useCalendarCellContext` must be used within a `Calendar.Cell` component"
    );
  }

  return context;
}
