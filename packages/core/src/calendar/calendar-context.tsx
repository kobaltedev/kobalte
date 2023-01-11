import { Accessor, createContext, useContext } from "solid-js";

import { CalendarState, RangeCalendarState } from "./types";

export interface CalendarContextValue {
  state: Accessor<CalendarState | RangeCalendarState>;
  selectedDateDescription: Accessor<string>;
  isPreviousDisabled: Accessor<boolean>;
  isNextDisabled: Accessor<boolean>;
  hideDatesOutsideMonth: Accessor<boolean>;
  ariaLabel: Accessor<string | undefined>;
  ariaLabelledBy: Accessor<string | undefined>;
  setPreviousFocused: (newValue: boolean) => void;
  setNextFocused: (newValue: boolean) => void;
}

export const CalendarContext = createContext<CalendarContextValue>();

export function useCalendarContext() {
  const context = useContext(CalendarContext);

  if (context === undefined) {
    throw new Error("[kobalte]: `useCalendarContext` must be used within a `Calendar` component");
  }

  return context;
}
