import { CalendarDate } from "@internationalized/date";
import { Accessor, createContext, useContext } from "solid-js";

export interface CalendarMonthContextValue {
  startDate: Accessor<CalendarDate>;
  endDate: Accessor<CalendarDate>;
}

export const CalendarMonthContext = createContext<CalendarMonthContextValue>();

export function useCalendarMonthContext() {
  const context = useContext(CalendarMonthContext);

  if (context === undefined) {
    throw new Error(
      "[kobalte]: `useCalendarMonthContext` must be used within a `Calendar.Month` component"
    );
  }

  return context;
}
