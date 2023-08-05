import { Accessor, createContext, useContext } from "solid-js";

import { DateValue } from "./types";

export interface CalendarGridContextValue {
  startDate: Accessor<DateValue>;
  weekDays: Accessor<string[]>;
}

export const CalendarGridContext = createContext<CalendarGridContextValue>();

export function useCalendarGridContext() {
  const context = useContext(CalendarGridContext);

  if (context === undefined) {
    throw new Error(
      "[kobalte]: `useCalendarGridContext` must be used within a `Calendar.Grid` component"
    );
  }

  return context;
}
