import { CalendarDate } from "@internationalized/date";
import { Accessor, createContext, useContext } from "solid-js";

export interface CalendarGridContextValue {
  startDate: Accessor<CalendarDate>;
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
