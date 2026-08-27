import type { Calendar, DateDuration } from "@internationalized/date";
import type { RangeValue, ValidationState } from "@kobalte/utils";
import { type Accessor, createContext, useContext } from "solid-js";

import type { CalendarSelectionMode, DateValue } from "../calendar/types.ts";
import type { DatePickerIntlTranslations } from "./date-picker.intl.ts";

export interface DatePickerDataSet {
	"data-expanded": string | undefined;
	"data-closed": string | undefined;
}

export interface DatePickerContextValue {
	dataset: Accessor<DatePickerDataSet>;
	isDisabled: Accessor<boolean>;
	translations: Accessor<DatePickerIntlTranslations>;
	selectionMode: Accessor<CalendarSelectionMode>;
	visibleDuration: Accessor<DateDuration>;
	allowsNonContiguousRanges: Accessor<boolean>;
	closeOnSelect: Accessor<boolean>;
	minValue: Accessor<DateValue | undefined>;
	maxValue: Accessor<DateValue | undefined>;
	placeholderValue: Accessor<DateValue | undefined>;
	locale: Accessor<string>;
	ariaDescribedBy: Accessor<string | undefined>;
	validationState: Accessor<ValidationState | undefined>;
	value: Accessor<
		DateValue | DateValue[] | RangeValue<DateValue> | null | undefined
	>;
	formattedValue: Accessor<string>;
	createCalendar: (name: string) => Calendar;
	isDateUnavailable: (date: DateValue) => boolean;
	setDateValue: (
		newValue: DateValue | DateValue[] | RangeValue<DateValue> | undefined,
	) => void;
	generateId: (part: string) => string;
}

export const DatePickerContext = createContext<DatePickerContextValue>();

export function useDatePickerContext() {
	const context = useContext(DatePickerContext);

	if (context === undefined) {
		throw new Error(
			"[kobalte]: `useDatePickerContext` must be used within a `DatePicker` component",
		);
	}

	return context;
}
