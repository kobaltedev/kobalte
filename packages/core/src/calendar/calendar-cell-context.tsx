import { Accessor, createContext, useContext } from "solid-js";

export interface CalendarCellDataSet {
  "data-unavailable": string | undefined;
  "data-outside-visible-range": string | undefined;
  "data-disabled": string | undefined;
  "data-selected": string | undefined;
  "data-invalid": string | undefined;
  "data-hover": string | undefined;
  "data-focus": string | undefined;
  "data-focus-visible": string | undefined;
  "data-active": string | undefined;
}

export interface CalendarCellContextValue {
  dataset: Accessor<CalendarCellDataSet>;
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
