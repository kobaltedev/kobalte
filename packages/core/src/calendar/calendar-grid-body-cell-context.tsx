import { Accessor, createContext, useContext } from "solid-js";

import { DateValue } from "./types";

export interface CalendarGridBodyCellContextValue {
  date: Accessor<DateValue>;
  isSelected: Accessor<boolean>;
  isFocused: Accessor<boolean>;
  isDisabled: Accessor<boolean>;
  isUnavailable: Accessor<boolean>;
  isSelectable: Accessor<boolean>;
  isInvalid: Accessor<boolean>;
  isDateToday: Accessor<boolean>;
}

export const CalendarGridBodyCellContext = createContext<CalendarGridBodyCellContextValue>();

export function useCalendarGriBodyCellContext() {
  const context = useContext(CalendarGridBodyCellContext);

  if (context === undefined) {
    throw new Error(
      "[kobalte]: `useCalendarGriBodyCellContext` must be used within a `Calendar.GridBodyCell` component"
    );
  }

  return context;
}
