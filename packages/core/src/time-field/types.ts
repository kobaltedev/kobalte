export type TimeFieldGranularity = "hour" | "minute" | "second" | {
	hour: boolean,
	minute: boolean,
	second: boolean,
};

export type TimeFieldHourCycle = 12 | 24;

export type SegmentType =
	| "hour"
	| "minute"
	| "second"
	| "dayPeriod";

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
}


export interface Time {
	hour: number | undefined,
	minute: number | undefined,
	second: number | undefined,
}
