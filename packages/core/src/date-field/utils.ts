/*
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/950d45db36e63851f411ed0dc6a5aad0af57da68/packages/@react-stately/datepicker/src/utils.ts
 * https://github.com/adobe/react-spectrum/blob/99ca82e87ba2d7fdd54f5b49326fd242320b4b51/packages/@react-stately/datepicker/src/useDateFieldState.ts
 *
 * Segment-limit/cycling logic reworked for native `Date` (no calendar-system or explicit
 * time-zone concept) — see `../calendar/date-math.ts` for the shared bounds table this
 * delegates to, so segment limits and cycling can never drift from each other.
 */

import {
	type CycleField,
	cycleField,
	getFieldBounds,
	setDay,
	setHours,
	setMinutes,
	setMonth,
	setSeconds,
	setYear,
	todayDate,
} from "../calendar/date-math.ts";
import type { DateFieldIntlTranslations } from "./date-field.intl.ts";
import type {
	DateFieldGranularity,
	DateFieldHourCycle,
	DateFieldMaxGranularity,
	DateFieldOptions,
	DateValue,
} from "./types.ts";

export interface FormatterOptions {
	granularity?: DateFieldGranularity;
	maxGranularity?: DateFieldMaxGranularity;
	hourCycle?: DateFieldHourCycle;
	shouldForceLeadingZeros?: boolean;
}

const DEFAULT_FIELD_OPTIONS: DateFieldOptions = {
	year: "numeric",
	month: "numeric",
	day: "numeric",
	hour: "numeric",
	minute: "2-digit",
	second: "2-digit",
};

const TWO_DIGIT_FIELD_OPTIONS: DateFieldOptions = {
	year: "numeric",
	month: "2-digit",
	day: "2-digit",
	hour: "2-digit",
	minute: "2-digit",
	second: "2-digit",
};

export function getDateFieldFormatOptions(
	fieldOptions: DateFieldOptions,
	options: FormatterOptions,
): Intl.DateTimeFormatOptions {
	const defaultFieldOptions = options.shouldForceLeadingZeros
		? TWO_DIGIT_FIELD_OPTIONS
		: DEFAULT_FIELD_OPTIONS;
	const finalFieldOptions = { ...defaultFieldOptions, ...fieldOptions };
	const granularity = options.granularity || "minute";
	const keys = Object.keys(finalFieldOptions);

	let startIdx = keys.indexOf(options.maxGranularity ?? "year");
	if (startIdx < 0) {
		startIdx = 0;
	}

	let endIdx = keys.indexOf(granularity);
	if (endIdx < 0) {
		endIdx = 2;
	}

	if (startIdx > endIdx) {
		throw new Error("maxGranularity must be greater than granularity");
	}

	const opts: Intl.DateTimeFormatOptions = keys
		.slice(startIdx, endIdx + 1)
		.reduce((opts, key) => {
			// @ts-expect-error
			opts[key] = finalFieldOptions[key];
			return opts;
		}, {} as Intl.DateTimeFormatOptions);

	if (options.hourCycle != null) {
		opts.hour12 = options.hourCycle === 12;
	}

	return opts;
}

/** A placeholder date used before any segment has been entered — local midnight today, or the given `placeholderValue`. */
export function createPlaceholderDate(
	placeholderValue: DateValue | null | undefined,
): DateValue {
	return placeholderValue ?? todayDate();
}

const EDITABLE_CYCLE_FIELDS = new Set<string>([
	"year",
	"month",
	"day",
	"hour",
	"minute",
	"second",
]);

function isCycleField(type: string): type is CycleField {
	return EDITABLE_CYCLE_FIELDS.has(type);
}

export function getSegmentLimits(
	date: DateValue,
	type: string,
	options: Intl.ResolvedDateTimeFormatOptions,
) {
	if (isCycleField(type) || type === "dayPeriod") {
		return getFieldBounds(date, type, options.hour12 ?? false);
	}

	return {};
}

export function addSegment(
	value: DateValue,
	part: string,
	amount: number,
	options: Intl.ResolvedDateTimeFormatOptions,
): DateValue | undefined {
	if (isCycleField(part)) {
		return cycleField(value, part, amount, { hour12: options.hour12 });
	}

	if (part === "dayPeriod") {
		const hours = value.getHours();
		const isPM = hours >= 12;
		return setHours(value, isPM ? hours - 12 : hours + 12);
	}

	return undefined;
}

export function setSegmentBase(
	value: DateValue,
	part: string,
	segmentValue: number,
	options: Intl.ResolvedDateTimeFormatOptions,
): DateValue | undefined {
	switch (part) {
		case "day":
			return setDay(value, segmentValue);
		case "month":
			return setMonth(value, segmentValue - 1);
		case "year":
			return setYear(value, segmentValue);
		case "dayPeriod": {
			const hours = value.getHours();
			const wasPM = hours >= 12;
			const isPM = segmentValue >= 12;
			if (isPM === wasPM) {
				return value;
			}
			return setHours(value, wasPM ? hours - 12 : hours + 12);
		}
		case "hour": {
			// In 12 hour time, ensure that AM/PM does not change
			let resolvedSegmentValue = segmentValue;
			if (options.hour12) {
				const hours = value.getHours();
				const wasPM = hours >= 12;
				if (!wasPM && resolvedSegmentValue === 12) {
					resolvedSegmentValue = 0;
				}
				if (wasPM && resolvedSegmentValue < 12) {
					resolvedSegmentValue += 12;
				}
			}
			return setHours(value, resolvedSegmentValue);
		}
		case "minute":
			return setMinutes(value, segmentValue);
		case "second":
			return setSeconds(value, segmentValue);
	}

	return undefined;
}

export function getPlaceholder(
	translations: DateFieldIntlTranslations,
	field: string,
	value: string,
) {
	// Use the actual placeholder value for the day period field.
	if (field === "dayPeriod") {
		return value;
	}

	if (field === "year" || field === "month" || field === "day") {
		return translations.placeholder[field as "year" | "month" | "day"];
	}

	// For time fields (e.g. hour, minute, etc.), use two dashes as the placeholder.
	return "––";
}
