import { type Accessor, createContext, useContext } from "solid-js";

import type { DateValue } from "./types";

export interface CalendarGridContextValue {
	startDate: Accessor<DateValue>;
	weekDays: Accessor<string[]>;
}

export const CalendarGridContext = createContext<CalendarGridContextValue>();

export function useCalendarGridContext(): CalendarGridContextValue {
	return useContext(CalendarGridContext)!;
}
