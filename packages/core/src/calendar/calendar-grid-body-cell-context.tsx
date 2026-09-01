import { type Accessor, createContext, useContext } from "solid-js";

import type { DateValue } from "./types.ts";

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

export function useCalendarGridBodyCellContext() {
	const context = useContext(CalendarGridBodyCellContext);

	if (context === undefined) {
		throw new Error(
			"[kobalte]: `useCalendarGridBodyCellContext` must be used within a `Calendar.GridBodyCell` component",
		);
	}

	return context;
}
