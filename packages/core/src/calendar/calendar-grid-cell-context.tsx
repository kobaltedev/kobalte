import { CalendarDate } from "@internationalized/date";
import { Accessor, createContext, useContext } from "solid-js";

export interface CalendarGridCellContextValue {
  isSelectable: Accessor<boolean>;
  isDisabled: Accessor<boolean>;
  isUnavailable: Accessor<boolean>;
  isSelected: Accessor<boolean>;
  isInvalid: Accessor<boolean>;
  date: Accessor<CalendarDate>;
  label: Accessor<string>;
}

export const CalendarGridCellContext = createContext<CalendarGridCellContextValue>();

export function useCalendarGridCellContext() {
  const context = useContext(CalendarGridCellContext);

  if (context === undefined) {
    throw new Error(
      "[kobalte]: `useCalendarGridCellContext` must be used within a `Calendar.GridCell` component"
    );
  }

  return context;
}
