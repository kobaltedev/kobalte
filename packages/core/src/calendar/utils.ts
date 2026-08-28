/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/0a1d0cd4e1b2f77eed7c0ea08fce8a04f8de6921/packages/@react-stately/calendar/src/utils.ts
 *
 * Portions of this file are based on code from zag, based on code from react-spectrum.
 * MIT Licensed, Copyright (c) 2021 Chakra UI.
 *
 * Credits to the Chakra UI team:
 * https://github.com/chakra-ui/zag/blob/main/packages/utilities/date-utils/src/pagination.ts
 *
 * Reworked for native `Date` values — no calendar-system conversion (`toCalendar`) or
 * explicit time-zone concept, so date math delegates to `./date-math.ts` and formatting
 * delegates to native `Intl.DateTimeFormat` instead of `@internationalized/date`.
 */

import type { RangeValue } from "@kobalte/utils";

import type { CalendarIntlTranslations } from "./calendar.intl.ts";
import {
	addDuration,
	compareDates,
	type DateDuration,
	endOfMonth,
	endOfWeek,
	isSameDay,
	maxDate,
	minDate,
	startOfMonth,
	startOfWeek,
	startOfYear,
	subtractDuration,
} from "./date-math.ts";
import type {
	CalendarSelectionMode,
	DateAlignment,
	DateValue,
} from "./types.ts";

/* -----------------------------------------------------------------------------
 * Constrain a date to a range
 * -----------------------------------------------------------------------------*/

export function constrainStart(
	date: DateValue,
	aligned: DateValue,
	duration: DateDuration,
	locale: string,
	min?: DateValue,
	max?: DateValue,
): DateValue {
	let computedDate = aligned;

	if (min && compareDates(date, min) >= 0) {
		computedDate =
			maxDate(computedDate, alignStart(min, duration, locale)) ?? computedDate;
	}

	if (max && compareDates(date, max) <= 0) {
		computedDate =
			minDate(computedDate, alignEnd(max, duration, locale)) ?? computedDate;
	}

	return computedDate;
}

export function constrainValue(
	date: DateValue,
	min?: DateValue,
	max?: DateValue,
): DateValue {
	let computedDate = date;

	if (min) {
		computedDate = maxDate(computedDate, min) ?? computedDate;
	}

	if (max) {
		computedDate = minDate(computedDate, max) ?? computedDate;
	}

	return computedDate;
}

/* -----------------------------------------------------------------------------
 * Align date to start, center, or end of a duration
 * -----------------------------------------------------------------------------*/

export function alignStart(
	date: DateValue,
	duration: DateDuration,
	locale: string,
	min?: DateValue,
	max?: DateValue,
): DateValue {
	// align to the start of the largest unit
	let aligned = date;
	if (duration.years) {
		aligned = startOfYear(date);
	} else if (duration.months) {
		aligned = startOfMonth(date);
	} else if (duration.weeks) {
		aligned = startOfWeek(date, locale);
	}

	return constrainStart(date, aligned, duration, locale, min, max);
}

export function alignCenter(
	date: DateValue,
	duration: DateDuration,
	locale: string,
	min?: DateValue,
	max?: DateValue,
): DateValue {
	const halfDuration: DateDuration = {};

	for (const key in duration) {
		// @ts-expect-error
		halfDuration[key] = Math.floor(duration[key] / 2);

		// @ts-expect-error
		if (halfDuration[key] > 0 && duration[key] % 2 === 0) {
			// @ts-expect-error
			halfDuration[key]--;
		}
	}

	const aligned = subtractDuration(
		alignStart(date, duration, locale),
		halfDuration,
	);
	return constrainStart(date, aligned, duration, locale, min, max);
}

export function alignEnd(
	date: DateValue,
	duration: DateDuration,
	locale: string,
	min?: DateValue,
	max?: DateValue,
): DateValue {
	const d: DateDuration = { ...duration };

	// subtract 1 from the smallest unit
	if (d.days) {
		d.days--;
	} else if (d.weeks) {
		d.weeks--;
	} else if (d.months) {
		d.months--;
	} else if (d.years) {
		d.years--;
	}

	const aligned = subtractDuration(alignStart(date, duration, locale), d);
	return constrainStart(date, aligned, duration, locale, min, max);
}

export function alignDate(
	date: DateValue,
	alignment: DateAlignment,
	duration: DateDuration,
	locale: string,
	min?: DateValue | undefined,
	max?: DateValue | undefined,
) {
	switch (alignment) {
		case "start":
			return alignStart(date, duration, locale, min, max);
		case "end":
			return alignEnd(date, duration, locale, min, max);
		default:
			return alignCenter(date, duration, locale, min, max);
	}
}

export function alignStartDate(
	date: DateValue,
	startDate: DateValue,
	endDate: DateValue,
	duration: DateDuration,
	locale: string,
	min?: DateValue | undefined,
	max?: DateValue | undefined,
) {
	if (compareDates(date, startDate) < 0) {
		return alignEnd(date, duration, locale, min, max);
	}
	if (compareDates(date, endDate) > 0) {
		return alignStart(date, duration, locale, min, max);
	}
	return startDate;
}

/* -----------------------------------------------------------------------------
 * Assertions
 * -----------------------------------------------------------------------------*/

export function isDateInvalid(
	date?: DateValue | null,
	minValue?: DateValue | null,
	maxValue?: DateValue | null,
) {
	return (
		date != null &&
		((minValue != null && compareDates(date, minValue) < 0) ||
			(maxValue != null && compareDates(date, maxValue) > 0))
	);
}

export function isPreviousVisibleRangeInvalid(
	startDate: DateValue,
	min?: DateValue | null,
	max?: DateValue | null,
) {
	const prevDate = subtractDuration(startDate, { days: 1 });

	return isSameDay(prevDate, startDate) || isDateInvalid(prevDate, min, max);
}

export function isNextVisibleRangeInvalid(
	endDate: DateValue,
	min?: DateValue | null,
	max?: DateValue | null,
) {
	const nextDate = addDuration(endDate, { days: 1 });

	return isSameDay(nextDate, endDate) || isDateInvalid(nextDate, min, max);
}

/* -----------------------------------------------------------------------------
 * Getters
 * -----------------------------------------------------------------------------*/

export function getEndDate(startDate: DateValue, duration: DateDuration) {
	const d = { ...duration };

	if (d.days) {
		d.days--;
	} else {
		d.days = -1;
	}

	return addDuration(startDate, d);
}

export function getAdjustedDateFn(
	visibleDuration: DateDuration,
	locale: string,
	min?: DateValue,
	max?: DateValue,
) {
	return function getDate(options: {
		startDate: DateValue;
		focusedDate: DateValue;
	}) {
		const { startDate, focusedDate } = options;
		const endDate = getEndDate(startDate, visibleDuration);

		// If the focused date was moved to an invalid value, it can't be focused, so constrain it.
		if (isDateInvalid(focusedDate, min, max)) {
			return {
				startDate,
				endDate,
				focusedDate: constrainValue(focusedDate, min, max),
			};
		}

		if (compareDates(focusedDate, startDate) < 0) {
			return {
				startDate: alignEnd(focusedDate, visibleDuration, locale, min, max),
				endDate,
				focusedDate: constrainValue(focusedDate, min, max),
			};
		}

		if (compareDates(focusedDate, endDate) > 0) {
			return {
				startDate: alignStart(focusedDate, visibleDuration, locale, min, max),
				endDate,
				focusedDate: constrainValue(focusedDate, min, max),
			};
		}

		return {
			startDate,
			endDate,
			focusedDate: constrainValue(focusedDate, min, max),
		};
	};
}

export function getUnitDuration(duration: DateDuration) {
	const unit = { ...duration };

	for (const key in unit) {
		// @ts-expect-error
		unit[key] = 1;
	}

	return unit;
}

export function getNextUnavailableDate(
	anchorDate: DateValue,
	start: DateValue,
	end: DateValue,
	isDateUnavailableFn: (date: DateValue) => boolean,
	dir: number,
): DateValue | undefined {
	let nextDate = addDuration(anchorDate, { days: dir });
	while (
		(dir < 0
			? compareDates(nextDate, start) >= 0
			: compareDates(nextDate, end) <= 0) &&
		!isDateUnavailableFn(nextDate)
	) {
		nextDate = addDuration(nextDate, { days: dir });
	}

	if (isDateUnavailableFn(nextDate)) {
		return addDuration(nextDate, { days: -dir });
	}

	return undefined;
}

export function getPreviousAvailableDate(
	date: DateValue,
	min: DateValue,
	isDateUnavailable?: (date: DateValue) => boolean,
) {
	if (!isDateUnavailable) {
		return date;
	}

	while (compareDates(date, min) >= 0 && isDateUnavailable(date)) {
		date = subtractDuration(date, { days: 1 });
	}

	if (compareDates(date, min) >= 0) {
		return date;
	}
}

/** Return the first value of the selection depending on the selection mode. */
export function getFirstValueOfSelection(
	selectionMode: CalendarSelectionMode,
	value: DateValue | DateValue[] | RangeValue<DateValue> | null | undefined,
) {
	let firstValue: DateValue | null | undefined;

	if (selectionMode === "single") {
		firstValue = asSingleValue(value);
	} else if (selectionMode === "multiple") {
		firstValue = asArrayValue(value)?.[0];
	} else if (selectionMode === "range") {
		const { start } = asRangeValue(value) ?? {};
		firstValue = start;
	}

	return firstValue;
}

/** Return an array of values for the selection depending on the selection mode. */
export function getArrayValueOfSelection(
	selectionMode: CalendarSelectionMode,
	value: DateValue | DateValue[] | RangeValue<DateValue> | null | undefined,
) {
	let values: Array<DateValue | null | undefined> = [];

	if (selectionMode === "single") {
		values = [asSingleValue(value)];
	} else if (selectionMode === "multiple") {
		values = asArrayValue(value) ?? [];
	} else if (selectionMode === "range") {
		const { start, end } = asRangeValue(value) ?? {};
		values = [start, end];
	}

	return values.filter(Boolean) as DateValue[];
}

/* -----------------------------------------------------------------------------
 * Formatters
 * -----------------------------------------------------------------------------*/

function formatRange(
	dateFormatter: Intl.DateTimeFormat,
	translations: CalendarIntlTranslations,
	start: DateValue,
	end: DateValue,
) {
	const parts = dateFormatter.formatRangeToParts(start, end);

	// Find the separator between the start and end date. This is determined
	// by finding the last shared literal before the end range.
	let separatorIndex = -1;

	for (let i = 0; i < parts.length; i++) {
		const part = parts[i];

		if (part.source === "shared" && part.type === "literal") {
			separatorIndex = i;
		} else if (part.source === "endRange") {
			break;
		}
	}

	// Now we can combine the parts into start and end strings.
	let startValue = "";
	let endValue = "";

	for (let i = 0; i < parts.length; i++) {
		if (i < separatorIndex) {
			startValue += parts[i].value;
		} else if (i > separatorIndex) {
			endValue += parts[i].value;
		}
	}

	return translations.dateRange(startValue, endValue);
}

/* -----------------------------------------------------------------------------
 * Descriptions
 * -----------------------------------------------------------------------------*/

export function getSelectedDateDescription(
	locale: string,
	translations: CalendarIntlTranslations,
	value: DateValue,
) {
	const dateFormatter = new Intl.DateTimeFormat(locale, {
		weekday: "long",
		month: "long",
		year: "numeric",
		day: "numeric",
	});

	return translations.selectedDateDescription(dateFormatter.format(value));
}

export function getSelectedDateRangeDescription(
	locale: string,
	translations: CalendarIntlTranslations,
	highlightedRange: { start?: DateValue; end?: DateValue },
	anchorDate: DateValue | undefined,
) {
	const start = highlightedRange.start;
	const end = highlightedRange.end;

	if (!anchorDate && start && end) {
		const dateFormatter = new Intl.DateTimeFormat(locale, {
			weekday: "long",
			month: "long",
			year: "numeric",
			day: "numeric",
		});

		// Use a single date message if the start and end dates are the same day,
		// otherwise include both dates.
		if (isSameDay(start, end)) {
			const date = dateFormatter.format(start);
			return translations.selectedDateDescription(date);
		}
		const dateRange = formatRange(dateFormatter, translations, start, end);
		return translations.selectedRangeDescription(dateRange);
	}

	// No message if currently selecting a range, or there is nothing highlighted.
	return "";
}

export function getVisibleRangeDescription(
	locale: string,
	translations: CalendarIntlTranslations,
	startDate: DateValue,
	endDate: DateValue,
	isAria: boolean,
) {
	const monthFormatter = new Intl.DateTimeFormat(locale, {
		month: "long",
		year: "numeric",
	});

	const dateFormatter = new Intl.DateTimeFormat(locale, {
		month: "long",
		year: "numeric",
		day: "numeric",
	});

	// Special case for month granularity. Format as a single month if only a
	// single month is visible, otherwise format as a range of months.
	if (isSameDay(startDate, startOfMonth(startDate))) {
		if (isSameDay(endDate, endOfMonth(startDate))) {
			return monthFormatter.format(startDate);
		}
		if (isSameDay(endDate, endOfMonth(endDate))) {
			if (isAria) {
				return formatRange(monthFormatter, translations, startDate, endDate);
			}

			return monthFormatter.formatRange(startDate, endDate);
		}
	}

	if (isAria) {
		return formatRange(dateFormatter, translations, startDate, endDate);
	}

	return dateFormatter.formatRange(startDate, endDate);
}

/* -----------------------------------------------------------------------------
 *  Pagination
 * -----------------------------------------------------------------------------*/

export function getNextPage(
	focusedDate: DateValue,
	startDate: DateValue,
	visibleDuration: DateDuration,
	locale: string,
	min?: DateValue,
	max?: DateValue,
) {
	const adjust = getAdjustedDateFn(visibleDuration, locale, min, max);
	const start = addDuration(startDate, visibleDuration);

	return adjust({
		focusedDate: addDuration(focusedDate, visibleDuration),
		startDate: alignStart(
			constrainStart(focusedDate, start, visibleDuration, locale, min, max),
			visibleDuration,
			locale,
		),
	});
}

export function getPreviousPage(
	focusedDate: DateValue,
	startDate: DateValue,
	visibleDuration: DateDuration,
	locale: string,
	min?: DateValue,
	max?: DateValue,
) {
	const adjust = getAdjustedDateFn(visibleDuration, locale, min, max);
	const start = subtractDuration(startDate, visibleDuration);

	return adjust({
		focusedDate: subtractDuration(focusedDate, visibleDuration),
		startDate: alignStart(
			constrainStart(focusedDate, start, visibleDuration, locale, min, max),
			visibleDuration,
			locale,
		),
	});
}

export function getNextRow(
	focusedDate: DateValue,
	startDate: DateValue,
	visibleDuration: DateDuration,
	locale: string,
	min?: DateValue,
	max?: DateValue,
) {
	const adjust = getAdjustedDateFn(visibleDuration, locale, min, max);

	if (visibleDuration.days) {
		return getNextPage(
			focusedDate,
			startDate,
			visibleDuration,
			locale,
			min,
			max,
		);
	}

	if (
		visibleDuration.weeks ||
		visibleDuration.months ||
		visibleDuration.years
	) {
		return adjust({
			focusedDate: addDuration(focusedDate, { weeks: 1 }),
			startDate,
		});
	}
}

export function getPreviousRow(
	focusedDate: DateValue,
	startDate: DateValue,
	visibleDuration: DateDuration,
	locale: string,
	min?: DateValue,
	max?: DateValue,
) {
	const adjust = getAdjustedDateFn(visibleDuration, locale, min, max);

	if (visibleDuration.days) {
		return getPreviousPage(
			focusedDate,
			startDate,
			visibleDuration,
			locale,
			min,
			max,
		);
	}

	if (
		visibleDuration.weeks ||
		visibleDuration.months ||
		visibleDuration.years
	) {
		return adjust({
			focusedDate: subtractDuration(focusedDate, { weeks: 1 }),
			startDate,
		});
	}
}

export function getSectionStart(
	focusedDate: DateValue,
	startDate: DateValue,
	visibleDuration: DateDuration,
	locale: string,
	min?: DateValue,
	max?: DateValue,
) {
	const adjust = getAdjustedDateFn(visibleDuration, locale, min, max);

	if (visibleDuration.days) {
		return adjust({
			focusedDate: startDate,
			startDate,
		});
	}

	if (visibleDuration.weeks) {
		return adjust({
			focusedDate: startOfWeek(focusedDate, locale),
			startDate,
		});
	}

	if (visibleDuration.months || visibleDuration.years) {
		return adjust({
			focusedDate: startOfMonth(focusedDate),
			startDate,
		});
	}
}

export function getSectionEnd(
	focusedDate: DateValue,
	startDate: DateValue,
	visibleDuration: DateDuration,
	locale: string,
	min?: DateValue,
	max?: DateValue,
) {
	const adjust = getAdjustedDateFn(visibleDuration, locale, min, max);
	const endDate = getEndDate(startDate, visibleDuration);

	if (visibleDuration.days) {
		return adjust({
			focusedDate: endDate,
			startDate,
		});
	}

	if (visibleDuration.weeks) {
		return adjust({
			focusedDate: endOfWeek(focusedDate, locale),
			startDate,
		});
	}

	if (visibleDuration.months || visibleDuration.years) {
		return adjust({
			focusedDate: endOfMonth(focusedDate),
			startDate,
		});
	}
}

export function getNextSection(
	focusedDate: DateValue,
	startDate: DateValue,
	larger: boolean,
	visibleDuration: DateDuration,
	locale: string,
	min?: DateValue,
	max?: DateValue,
) {
	const adjust = getAdjustedDateFn(visibleDuration, locale, min, max);

	if (!larger && !visibleDuration.days) {
		return adjust({
			focusedDate: addDuration(focusedDate, getUnitDuration(visibleDuration)),
			startDate,
		});
	}

	if (visibleDuration.days) {
		return getNextPage(
			focusedDate,
			startDate,
			visibleDuration,
			locale,
			min,
			max,
		);
	}

	if (visibleDuration.weeks) {
		return adjust({
			focusedDate: addDuration(focusedDate, { months: 1 }),
			startDate,
		});
	}

	if (visibleDuration.months || visibleDuration.years) {
		return adjust({
			focusedDate: addDuration(focusedDate, { years: 1 }),
			startDate,
		});
	}
}

export function getPreviousSection(
	focusedDate: DateValue,
	startDate: DateValue,
	larger: boolean,
	visibleDuration: DateDuration,
	locale: string,
	min?: DateValue,
	max?: DateValue,
) {
	const adjust = getAdjustedDateFn(visibleDuration, locale, min, max);

	if (!larger && !visibleDuration.days) {
		return adjust({
			focusedDate: subtractDuration(
				focusedDate,
				getUnitDuration(visibleDuration),
			),
			startDate,
		});
	}

	if (visibleDuration.days) {
		return getPreviousPage(
			focusedDate,
			startDate,
			visibleDuration,
			locale,
			min,
			max,
		);
	}

	if (visibleDuration.weeks) {
		return adjust({
			focusedDate: subtractDuration(focusedDate, { months: 1 }),
			startDate,
		});
	}

	if (visibleDuration.months || visibleDuration.years) {
		return adjust({
			focusedDate: subtractDuration(focusedDate, { years: 1 }),
			startDate,
		});
	}
}

/* -----------------------------------------------------------------------------
 *  Type narrowing
 * -----------------------------------------------------------------------------*/

/** Narrow the type of `value` to `DateValue`. */
export function asSingleValue(
	value: DateValue | DateValue[] | RangeValue<DateValue> | null | undefined,
) {
	return value as DateValue | null | undefined;
}

/** Narrow the type of `value` to `DateValue[]`. */
export function asArrayValue(
	value: DateValue | DateValue[] | RangeValue<DateValue> | null | undefined,
) {
	return value as DateValue[] | null | undefined;
}

/** Narrow the type of `value` to `RangeValue<DateValue>`. */
export function asRangeValue(
	value: DateValue | DateValue[] | RangeValue<DateValue> | null | undefined,
) {
	return value as RangeValue<DateValue> | null | undefined;
}

/* -----------------------------------------------------------------------------
 *  Misc.
 * -----------------------------------------------------------------------------*/

export function sortDates(values: DateValue[]) {
	return values.sort((a, b) => compareDates(a, b));
}

export function makeCalendarDateRange(
	start?: DateValue,
	end?: DateValue,
): RangeValue<DateValue> | undefined {
	if (!start || !end) {
		return undefined;
	}

	if (compareDates(end, start) < 0) {
		[start, end] = [end, start];
	}

	return { start, end };
}

/** Preserves the time-of-day of `oldValue` (if any) onto `newValue`'s date. */
export function convertValue(
	newValue: DateValue,
	oldValue?: DateValue | null,
): DateValue {
	if (!oldValue) {
		return newValue;
	}

	const result = new Date(newValue);
	result.setHours(
		oldValue.getHours(),
		oldValue.getMinutes(),
		oldValue.getSeconds(),
		oldValue.getMilliseconds(),
	);
	return result;
}
