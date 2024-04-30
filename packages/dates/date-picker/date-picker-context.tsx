import { Calendar, DateDuration } from "@internationalized/date";
import { FocusManager, RangeValue, ValidationState } from "@kobalte/utils";
import { Accessor, createContext, useContext } from "solid-js";

import { CalendarSelectionMode, DateValue, TimeValue } from "../calendar/types";
import { Direction } from "../i18n";
import { CreatePresenceResult } from "../primitives";
import { DatePickerIntlTranslations } from "./date-picker.intl";
import {
	DateFieldGranularity,
	DateFieldHourCycle,
	DateFieldMaxGranularity,
} from "./types";

export interface DatePickerDataSet {
	"data-expanded": string | undefined;
	"data-closed": string | undefined;
}

export interface DatePickerContextValue {
	dataset: Accessor<DatePickerDataSet>;
	isOpen: Accessor<boolean>;
	isDisabled: Accessor<boolean>;
	isModal: Accessor<boolean>;
	contentPresence: CreatePresenceResult;
	translations: Accessor<DatePickerIntlTranslations>;
	granularity: Accessor<DateFieldGranularity>;
	maxGranularity: Accessor<DateFieldMaxGranularity | undefined>;
	hourCycle: Accessor<DateFieldHourCycle | undefined>;
	hideTimeZone: Accessor<boolean>;
	defaultTimeZone: Accessor<string | undefined>;
	shouldForceLeadingZeros: Accessor<boolean>;
	visibleDuration: Accessor<DateDuration>;
	allowsNonContiguousRanges: Accessor<boolean>;
	selectionMode: Accessor<CalendarSelectionMode>;
	minValue: Accessor<DateValue | undefined>;
	maxValue: Accessor<DateValue | undefined>;
	placeholderValue: Accessor<DateValue | undefined>;
	focusManager: Accessor<FocusManager>;
	locale: Accessor<string>;
	direction: Accessor<Direction>;
	ariaDescribedBy: Accessor<string | undefined>;
	validationState: Accessor<ValidationState | undefined>;
	value: Accessor<
		DateValue | DateValue[] | RangeValue<DateValue> | null | undefined
	>;
	dateValue: Accessor<
		DateValue | DateValue[] | RangeValue<DateValue> | undefined
	>;
	timeValue: Accessor<TimeValue | RangeValue<TimeValue> | undefined>;
	triggerId: Accessor<string | undefined>;
	contentId: Accessor<string | undefined>;
	controlRef: Accessor<HTMLDivElement | undefined>;
	triggerRef: Accessor<HTMLButtonElement | undefined>;
	contentRef: Accessor<HTMLDivElement | undefined>;
	setControlRef: (el: HTMLDivElement) => void;
	setTriggerRef: (el: HTMLButtonElement) => void;
	setContentRef: (el: HTMLDivElement) => void;
	createCalendar: (name: string) => Calendar;
	isDateUnavailable: (date: DateValue) => boolean;
	setDateValue: (
		newValue: DateValue | DateValue[] | RangeValue<DateValue> | undefined,
	) => void;
	setTimeValue: (
		newValue: TimeValue | RangeValue<TimeValue> | undefined,
	) => void;
	open: () => void;
	close: () => void;
	toggle: () => void;
	generateId: (part: string) => string;
	registerTriggerId: (id: string) => () => void;
	registerContentId: (id: string) => () => void;
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
