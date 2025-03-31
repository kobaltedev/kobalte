import type {
	CalendarDateTime,
	Time,
	ZonedDateTime,
} from "@internationalized/date";

export type TimeFieldGranularity = "hour" | "minute" | "second";

export type TimeFieldHourCycle = 12 | 24;

export type TimeValue = Time | CalendarDateTime | ZonedDateTime;

export type MappedTimeValue<T> = T extends ZonedDateTime
	? ZonedDateTime
	: T extends CalendarDateTime
		? CalendarDateTime
		: T extends Time
			? Time
			: never;

export type SegmentType =
	| "hour"
	| "minute"
	| "second"
	| "dayPeriod"
	| "literal"
	| "timeZoneName";

export interface TimeSegment {
	/** The type of segment. */
	type: SegmentType;

	/** The formatted text for the segment. */
	text: string;

	/** The numeric value for the segment, if applicable. */
	value?: number;

	/** The minimum numeric value for the segment, if applicable. */
	minValue?: number;

	/** The maximum numeric value for the segment, if applicable. */
	maxValue?: number;

	/** Whether the value is a placeholder. */
	isPlaceholder: boolean;

	/** A placeholder string for the segment. */
	placeholder: string;

	/** Whether the segment is editable. */
	isEditable: boolean;
}

export interface FormatterOptions {
	timeZone?: string;
	hideTimeZone?: boolean;
	granularity?: TimeFieldGranularity;
	hourCycle?: TimeFieldHourCycle;
	shouldForceLeadingZeros?: boolean;
}
