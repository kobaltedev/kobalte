import { CalendarDate } from "@internationalized/date";
import { Accessor, createContext, useContext } from "solid-js";

export interface CalendarCellContextValue {
  isSelectable: Accessor<boolean>;
  isDisabled: Accessor<boolean>;
  isUnavailable: Accessor<boolean>;
  isSelected: Accessor<boolean>;
  isInvalid: Accessor<boolean>;
  date: Accessor<CalendarDate>;
  label: Accessor<string>;
  nativeDate: Accessor<Date>;
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
