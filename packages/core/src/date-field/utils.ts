/*
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/950d45db36e63851f411ed0dc6a5aad0af57da68/packages/@react-stately/datepicker/src/utils.ts
 * https://github.com/adobe/react-spectrum/blob/99ca82e87ba2d7fdd54f5b49326fd242320b4b51/packages/@react-stately/datepicker/src/useDateFieldState.ts
 */

import type { Calendar } from "@internationalized/date";
import {
	getMinimumDayInMonth,
	getMinimumMonthInYear,
	now,
	toCalendar,
	toCalendarDate,
	toCalendarDateTime,
} from "@internationalized/date";
import type { DateFieldIntlTranslations } from "./date-field.intl.ts";
import type {
	DateFieldGranularity,
	DateFieldHourCycle,
	DateFieldMaxGranularity,
	DateFieldOptions,
	DateValue,
} from "./types.ts";

export interface FormatterOptions {
	timeZone?: string;
	hideTimeZone?: boolean;
	granularity?: DateFieldGranularity;
	maxGranularity?: DateFieldMaxGranularity;
	hourCycle?: DateFieldHourCycle;
	showEra?: boolean;
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

	opts.timeZone = options.timeZone || "UTC";

	const hasTime =
		granularity === "hour" ||
		granularity === "minute" ||
		granularity === "second";
	if (hasTime && options.timeZone && !options.hideTimeZone) {
		opts.timeZoneName = "short";
	}

	if (options.showEra && startIdx === 0) {
		opts.era = "short";
	}

	return opts;
}

export function convertValue(
	value: DateValue | null | undefined,
	calendar: Calendar,
): DateValue | null | undefined {
	if (value === null) {
		return null;
	}

	if (!value) {
		return undefined;
	}

	return toCalendar(value, calendar);
}

export function createPlaceholderDate(
	placeholderValue: DateValue | null | undefined,
	granularity: string,
	calendar: Calendar,
	timeZone: string,
) {
	if (placeholderValue) {
		return convertValue(placeholderValue, calendar);
	}

	const date = toCalendar(
		now(timeZone).set({ hour: 0, minute: 0, second: 0, millisecond: 0 }),
		calendar,
	);

	if (
		granularity === "year" ||
		granularity === "month" ||
		granularity === "day"
	) {
		return toCalendarDate(date);
	}

	if (!timeZone) {
		return toCalendarDateTime(date);
	}

	return date;
}

export function getSegmentLimits(
	date: DateValue,
	type: string,
	options: Intl.ResolvedDateTimeFormatOptions,
) {
	switch (type) {
		case "era": {
			const eras = date.calendar.getEras();
			return {
				value: eras.indexOf(date.era),
				minValue: 0,
				maxValue: eras.length - 1,
			};
		}
		case "year":
			return {
				value: date.year,
				minValue: 1,
				maxValue: date.calendar.getYearsInEra(date),
			};
		case "month":
			return {
				value: date.month,
				minValue: getMinimumMonthInYear(date),
				maxValue: date.calendar.getMonthsInYear(date),
			};
		case "day":
			return {
				value: date.day,
				minValue: getMinimumDayInMonth(date),
				maxValue: date.calendar.getDaysInMonth(date),
			};
	}

	if ("hour" in date) {
		switch (type) {
			case "dayPeriod":
				return {
					value: date.hour >= 12 ? 12 : 0,
					minValue: 0,
					maxValue: 12,
				};
			case "hour":
				if (options.hour12) {
					const isPM = date.hour >= 12;
					return {
						value: date.hour,
						minValue: isPM ? 12 : 0,
						maxValue: isPM ? 23 : 11,
					};
				}

				return {
					value: date.hour,
					minValue: 0,
					maxValue: 23,
				};
			case "minute":
				return {
					value: date.minute,
					minValue: 0,
					maxValue: 59,
				};
			case "second":
				return {
					value: date.second,
					minValue: 0,
					maxValue: 59,
				};
		}
	}

	return {};
}

export function addSegment(
	value: DateValue,
	part: string,
	amount: number,
	options: Intl.ResolvedDateTimeFormatOptions,
) {
	switch (part) {
		case "era":
		case "year":
		case "month":
		case "day":
			return value.cycle(part, amount, { round: part === "year" });
	}

	if ("hour" in value) {
		switch (part) {
			case "dayPeriod": {
				const hours = value.hour;
				const isPM = hours >= 12;
				return value.set({ hour: isPM ? hours - 12 : hours + 12 });
			}
			case "hour":
			case "minute":
			case "second":
				return value.cycle(part, amount, {
					round: part !== "hour",
					hourCycle: options.hour12 ? 12 : 24,
				});
		}
	}
}

export function setSegmentBase(
	value: DateValue,
	part: string,
	segmentValue: number,
	options: Intl.ResolvedDateTimeFormatOptions,
) {
	switch (part) {
		case "day":
		case "month":
		case "year":
		case "era":
			return value.set({ [part]: segmentValue });
	}

	if ("hour" in value) {
		switch (part) {
			case "dayPeriod": {
				const hours = value.hour;
				const wasPM = hours >= 12;
				const isPM = segmentValue >= 12;
				if (isPM === wasPM) {
					return value;
				}
				return value.set({ hour: wasPM ? hours - 12 : hours + 12 });
			}

			case "hour": {
				// In 12 hour time, ensure that AM/PM does not change
				let resolvedSegmentValue = segmentValue;
				if (options.hour12) {
					const hours = value.hour;
					const wasPM = hours >= 12;
					if (!wasPM && resolvedSegmentValue === 12) {
						resolvedSegmentValue = 0;
					}
					if (wasPM && resolvedSegmentValue < 12) {
						resolvedSegmentValue += 12;
					}
				}
				return value.set({ hour: resolvedSegmentValue });
			}
			case "minute":
			case "second":
				return value.set({ [part]: segmentValue });
		}
	}
}

export function getPlaceholder(
	translations: DateFieldIntlTranslations,
	field: string,
	value: string,
) {
	// Use the actual placeholder value for the era and day period fields.
	if (field === "era" || field === "dayPeriod") {
		return value;
	}

	if (field === "year" || field === "month" || field === "day") {
		return translations.placeholder[field as "year" | "month" | "day"];
	}

	// For time fields (e.g. hour, minute, etc.), use two dashes as the placeholder.
	return "––";
}
