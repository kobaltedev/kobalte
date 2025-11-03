export type TimeFieldGranularity =
	| "hour"
	| "minute"
	| "second"
	| {
			hour: boolean;
			minute: boolean;
			second: boolean;
	  };

export type TimeFieldHourCycle = 12 | 24;

export type SegmentType = "hour" | "minute" | "second" | "dayPeriod";

export interface Time {
	hour?: number;
	minute?: number;
	second?: number;
}
