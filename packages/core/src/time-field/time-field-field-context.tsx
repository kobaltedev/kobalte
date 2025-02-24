import type { ResolvedDateTimeFormatOptions } from "@internationalized/date";
import { type Accessor, createContext, useContext } from "solid-js";
import type { SegmentType, TimeSegment } from "./types";

export interface TimeFieldFieldContextValue {
	dateValue: Accessor<Date | undefined>;
	dateFormatterResolvedOptions: Accessor<ResolvedDateTimeFormatOptions>;
	segments: Accessor<TimeSegment[]>;
	ariaLabel: Accessor<string | undefined>;
	ariaLabelledBy: Accessor<string | undefined>;
	ariaDescribedBy: Accessor<string | undefined>;
	increment(type: SegmentType): void;
	decrement(type: SegmentType): void;
	incrementPage(type: SegmentType): void;
	decrementPage(type: SegmentType): void;
	setSegment(type: SegmentType, value: number): void;
	clearSegment(type: SegmentType): void;
	generateId: (part: string) => string;
}

export const TimeFieldFieldContext =
	createContext<TimeFieldFieldContextValue>();

export function useTimeFieldFieldContext() {
	const context = useContext(TimeFieldFieldContext);

	if (context === undefined) {
		throw new Error(
			"[kobalte]: `useTimeFieldFieldContext` must be used within a `TimeField.Field` component",
		);
	}

	return context;
}
