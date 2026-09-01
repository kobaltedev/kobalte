import { type Accessor, createContext, useContext } from "solid-js";

import type { CalendarState } from "./create-calendar-state.ts";

export interface CalendarDataSet {
	"data-disabled": string | undefined;
	"data-readonly": string | undefined;
}

export interface CalendarContextValue extends CalendarState {
	dataset: Accessor<CalendarDataSet>;
}

export const CalendarContext = createContext<CalendarContextValue>();

export function useCalendarContext() {
	const context = useContext(CalendarContext);

	if (context === undefined) {
		throw new Error(
			"[kobalte]: `useCalendarContext` must be used within a `Calendar` component",
		);
	}

	return context;
}
