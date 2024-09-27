import type {
	CalendarDate,
	CalendarDateTime,
	Time,
	ZonedDateTime,
} from "@internationalized/date";

export type DateValue = CalendarDate | CalendarDateTime | ZonedDateTime;
export type TimeValue = Time | CalendarDateTime | ZonedDateTime;

export type DateAlignment = "start" | "center" | "end";

export type CalendarSelectionMode = "single" | "multiple" | "range";
