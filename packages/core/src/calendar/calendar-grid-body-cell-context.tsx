import { type Accessor, createContext, useContext } from "solid-js";

import type { DateValue } from "./types";

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

export const CalendarGridBodyCellContext =
	createContext<CalendarGridBodyCellContextValue>();

export function useCalendarGriBodyCellContext(): CalendarGridBodyCellContextValue {
	return useContext(CalendarGridBodyCellContext)!;
}
