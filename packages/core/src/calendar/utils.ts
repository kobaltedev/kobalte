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
 */

import {
  CalendarDate,
  DateDuration,
  DateFormatter,
  endOfMonth,
  endOfWeek,
  isSameDay,
  maxDate,
  minDate,
  startOfMonth,
  startOfWeek,
  startOfYear,
  toCalendarDate,
} from "@internationalized/date";
import { RangeValue } from "@kobalte/utils";

import { createDateFormatter, LocalizedMessageFormatter } from "../i18n";
import { CalendarSelectionMode, DateAlignment, DateValue } from "./types";

/* -----------------------------------------------------------------------------
 * Constrain a date to a range
 * -----------------------------------------------------------------------------*/

export function constrainStart(
  date: DateValue,
  aligned: DateValue,
  duration: DateDuration,
  locale: string,
  min?: DateValue,
  max?: DateValue
): DateValue {
  if (min && date.compare(min) >= 0) {
    aligned = maxDate(aligned, alignStart(toCalendarDate(min), duration, locale));
  }

  if (max && date.compare(max) <= 0) {
    aligned = minDate(aligned, alignEnd(toCalendarDate(max), duration, locale));
  }

  return aligned;
}

export function constrainValue(date: DateValue, min?: DateValue, max?: DateValue): DateValue {
  if (min) {
    date = maxDate(date, toCalendarDate(min));
  }

  if (max) {
    date = minDate(date, toCalendarDate(max));
  }

  return date;
}

/* -----------------------------------------------------------------------------
 * Align date to start, center, or end of a duration
 * -----------------------------------------------------------------------------*/

export function alignStart(
  date: DateValue,
  duration: DateDuration,
  locale: string,
  min?: DateValue,
  max?: DateValue
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
  max?: DateValue
): DateValue {
  const halfDuration: DateDuration = {};

  for (const key in duration) {
    // @ts-ignore
    halfDuration[key] = Math.floor(duration[key] / 2);

    // @ts-ignore
    if (halfDuration[key] > 0 && duration[key] % 2 === 0) {
      // @ts-ignore
      halfDuration[key]--;
    }
  }

  const aligned = alignStart(date, duration, locale).subtract(halfDuration);
  return constrainStart(date, aligned, duration, locale, min, max);
}

export function alignEnd(
  date: DateValue,
  duration: DateDuration,
  locale: string,
  min?: DateValue,
  max?: DateValue
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

  const aligned = alignStart(date, duration, locale).subtract(d);
  return constrainStart(date, aligned, duration, locale, min, max);
}

export function alignDate(
  date: DateValue,
  alignment: DateAlignment,
  duration: DateDuration,
  locale: string,
  min?: DateValue | undefined,
  max?: DateValue | undefined
) {
  switch (alignment) {
    case "start":
      return alignStart(date, duration, locale, min, max);
    case "end":
      return alignEnd(date, duration, locale, min, max);
    case "center":
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
  max?: DateValue | undefined
) {
  if (date.compare(startDate) < 0) {
    return alignEnd(date, duration, locale, min, max);
  }
  if (date.compare(endDate) > 0) {
    return alignStart(date, duration, locale, min, max);
  }
  return startDate;
}

/* -----------------------------------------------------------------------------
 * Assertions
 * -----------------------------------------------------------------------------*/

export function isDateInvalid(
  date: DateValue,
  minValue?: DateValue | null,
  maxValue?: DateValue | null
) {
  return (
    (minValue != null && date.compare(minValue) < 0) ||
    (maxValue != null && date.compare(maxValue) > 0)
  );
}

export function isPreviousVisibleRangeInvalid(
  startDate: DateValue,
  min?: DateValue | null,
  max?: DateValue | null
) {
  const prevDate = startDate.subtract({ days: 1 });

  return isSameDay(prevDate, startDate) || isDateInvalid(prevDate, min, max);
}

export function isNextVisibleRangeInvalid(
  endDate: DateValue,
  min?: DateValue | null,
  max?: DateValue | null
) {
  // Adding may return the same date if we reached the end of time
  // according to the calendar system (e.g. 9999-12-31).
  const nextDate = endDate.add({ days: 1 });

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

  return startDate.add(d);
}

export function getAdjustedDateFn(
  visibleDuration: DateDuration,
  locale: string,
  min?: DateValue,
  max?: DateValue
) {
  return function getDate(options: { startDate: DateValue; focusedDate: DateValue }) {
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

    if (focusedDate.compare(startDate) < 0) {
      return {
        startDate: alignEnd(focusedDate, visibleDuration, locale, min, max),
        endDate,
        focusedDate: constrainValue(focusedDate, min, max),
      };
    }

    if (focusedDate.compare(endDate) > 0) {
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
    // @ts-ignore
    unit[key] = 1;
  }

  return unit;
}

export function getNextUnavailableDate(
  anchorDate: DateValue,
  start: DateValue,
  end: DateValue,
  isDateUnavailableFn: (date: DateValue) => boolean,
  dir: number
): DateValue | undefined {
  let nextDate = anchorDate.add({ days: dir });
  while (
    (dir < 0 ? nextDate.compare(start) >= 0 : nextDate.compare(end) <= 0) &&
    !isDateUnavailableFn(nextDate)
  ) {
    nextDate = nextDate.add({ days: dir });
  }

  if (isDateUnavailableFn(nextDate)) {
    return nextDate.add({ days: -dir });
  }

  return undefined;
}

export function getPreviousAvailableDate(
  date: DateValue,
  min: DateValue,
  isDateUnavailable?: (date: DateValue) => boolean
) {
  if (!isDateUnavailable) {
    return date;
  }

  while (date.compare(min) >= 0 && isDateUnavailable(date)) {
    date = date.subtract({ days: 1 });
  }

  if (date.compare(min) >= 0) {
    return date;
  }
}

export function getEraFormat(date: DateValue): "short" | undefined {
  return date?.calendar.identifier === "gregory" && date.era === "BC" ? "short" : undefined;
}

/** Return the first value of the selection depending on the selection mode. */
export function getFirstValueOfSelection(
  selectionMode: CalendarSelectionMode,
  value: DateValue | DateValue[] | RangeValue<DateValue> | undefined
) {
  let firstValue: DateValue | undefined;

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
  value: DateValue | DateValue[] | RangeValue<DateValue> | undefined
) {
  let values: Array<DateValue | undefined> = [];

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
  dateFormatter: DateFormatter,
  messageFormatter: LocalizedMessageFormatter,
  start: DateValue,
  end: DateValue,
  timeZone: string
) {
  const parts = dateFormatter.formatRangeToParts(start.toDate(timeZone), end.toDate(timeZone));

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

  return messageFormatter.format("dateRange", { startDate: startValue, endDate: endValue });
}

/* -----------------------------------------------------------------------------
 * Descriptions
 * -----------------------------------------------------------------------------*/

export function getSelectedDateDescription(
  messageFormatter: LocalizedMessageFormatter,
  value: DateValue,
  timeZone: string
) {
  const dateFormatter = createDateFormatter(() => ({
    weekday: "long",
    month: "long",
    year: "numeric",
    day: "numeric",
    era: getEraFormat(value),
    timeZone: timeZone,
  }));

  return messageFormatter.format("selectedDateDescription", {
    date: dateFormatter().format(value.toDate(timeZone)),
  });
}

export function getSelectedDateRangeDescription(
  messageFormatter: LocalizedMessageFormatter,
  highlightedRange: { start?: DateValue; end?: DateValue },
  anchorDate: DateValue | undefined,
  timeZone: string
) {
  const start = highlightedRange.start;
  const end = highlightedRange.end;

  if (!anchorDate && start && end) {
    const dateFormatter = createDateFormatter(() => ({
      weekday: "long",
      month: "long",
      year: "numeric",
      day: "numeric",
      era: getEraFormat(start) || getEraFormat(end),
      timeZone: timeZone,
    }));

    // Use a single date message if the start and end dates are the same day,
    // otherwise include both dates.
    if (isSameDay(start, end)) {
      const date = dateFormatter().format(start.toDate(timeZone));
      return messageFormatter.format("selectedDateDescription", { date });
    } else {
      const dateRange = formatRange(dateFormatter(), messageFormatter, start, end, timeZone);
      return messageFormatter.format("selectedRangeDescription", { dateRange });
    }
  }

  // No message if currently selecting a range, or there is nothing highlighted.
  return "";
}

export function getVisibleRangeDescription(
  messageFormatter: LocalizedMessageFormatter,
  startDate: DateValue,
  endDate: DateValue,
  timeZone: string,
  isAria: boolean
) {
  const era = getEraFormat(startDate) || getEraFormat(endDate);

  const monthFormatter = createDateFormatter(() => ({
    month: "long",
    year: "numeric",
    era,
    calendar: startDate.calendar.identifier,
    timeZone,
  }));

  const dateFormatter = createDateFormatter(() => ({
    month: "long",
    year: "numeric",
    day: "numeric",
    era,
    calendar: startDate.calendar.identifier,
    timeZone,
  }));

  // Special case for month granularity. Format as a single month if only a
  // single month is visible, otherwise format as a range of months.
  if (isSameDay(startDate, startOfMonth(startDate))) {
    if (isSameDay(endDate, endOfMonth(startDate))) {
      return monthFormatter().format(startDate.toDate(timeZone));
    } else if (isSameDay(endDate, endOfMonth(endDate))) {
      if (isAria) {
        return formatRange(monthFormatter(), messageFormatter, startDate, endDate, timeZone);
      }

      return monthFormatter().formatRange(startDate.toDate(timeZone), endDate.toDate(timeZone));
    }
  }

  if (isAria) {
    return formatRange(dateFormatter(), messageFormatter, startDate, endDate, timeZone);
  }

  return dateFormatter().formatRange(startDate.toDate(timeZone), endDate.toDate(timeZone));
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
  max?: DateValue
) {
  const adjust = getAdjustedDateFn(visibleDuration, locale, min, max);
  const start = startDate.add(visibleDuration);

  return adjust({
    focusedDate: focusedDate.add(visibleDuration),
    startDate: alignStart(
      constrainStart(focusedDate, start, visibleDuration, locale, min, max),
      visibleDuration,
      locale
    ),
  });
}

export function getPreviousPage(
  focusedDate: DateValue,
  startDate: DateValue,
  visibleDuration: DateDuration,
  locale: string,
  min?: DateValue,
  max?: DateValue
) {
  const adjust = getAdjustedDateFn(visibleDuration, locale, min, max);
  const start = startDate.subtract(visibleDuration);

  return adjust({
    focusedDate: focusedDate.subtract(visibleDuration),
    startDate: alignStart(
      constrainStart(focusedDate, start, visibleDuration, locale, min, max),
      visibleDuration,
      locale
    ),
  });
}

export function getNextRow(
  focusedDate: DateValue,
  startDate: DateValue,
  visibleDuration: DateDuration,
  locale: string,
  min?: DateValue,
  max?: DateValue
) {
  const adjust = getAdjustedDateFn(visibleDuration, locale, min, max);

  if (visibleDuration.days) {
    return getNextPage(focusedDate, startDate, visibleDuration, locale, min, max);
  }

  if (visibleDuration.weeks || visibleDuration.months || visibleDuration.years) {
    return adjust({
      focusedDate: focusedDate.add({ weeks: 1 }),
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
  max?: DateValue
) {
  const adjust = getAdjustedDateFn(visibleDuration, locale, min, max);

  if (visibleDuration.days) {
    return getPreviousPage(focusedDate, startDate, visibleDuration, locale, min, max);
  }

  if (visibleDuration.weeks || visibleDuration.months || visibleDuration.years) {
    return adjust({
      focusedDate: focusedDate.subtract({ weeks: 1 }),
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
  max?: DateValue
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
  max?: DateValue
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
      //@ts-expect-error - endOfWeek is loosely typed
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
  max?: DateValue
) {
  const adjust = getAdjustedDateFn(visibleDuration, locale, min, max);

  if (!larger && !visibleDuration.days) {
    return adjust({
      focusedDate: focusedDate.add(getUnitDuration(visibleDuration)),
      startDate,
    });
  }

  if (visibleDuration.days) {
    return getNextPage(focusedDate, startDate, visibleDuration, locale, min, max);
  }

  if (visibleDuration.weeks) {
    return adjust({
      focusedDate: focusedDate.add({ months: 1 }),
      startDate,
    });
  }

  if (visibleDuration.months || visibleDuration.years) {
    return adjust({
      focusedDate: focusedDate.add({ years: 1 }),
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
  max?: DateValue
) {
  const adjust = getAdjustedDateFn(visibleDuration, locale, min, max);

  if (!larger && !visibleDuration.days) {
    return adjust({
      focusedDate: focusedDate.subtract(getUnitDuration(visibleDuration)),
      startDate,
    });
  }

  if (visibleDuration.days) {
    return getPreviousPage(focusedDate, startDate, visibleDuration, locale, min, max);
  }

  if (visibleDuration.weeks) {
    return adjust({
      focusedDate: focusedDate.subtract({ months: 1 }),
      startDate,
    });
  }

  if (visibleDuration.months || visibleDuration.years) {
    return adjust({
      focusedDate: focusedDate.subtract({ years: 1 }),
      startDate,
    });
  }
}

/* -----------------------------------------------------------------------------
 *  Type narrowing
 * -----------------------------------------------------------------------------*/

/** Narrow the type of `value` to `DateValue`. */
export function asSingleValue(value: DateValue | DateValue[] | RangeValue<DateValue> | undefined) {
  return value as DateValue | undefined;
}

/** Narrow the type of `value` to `DateValue[]`. */
export function asArrayValue(value: DateValue | DateValue[] | RangeValue<DateValue> | undefined) {
  return value as DateValue[] | undefined;
}

/** Narrow the type of `value` to `RangeValue<DateValue>`. */
export function asRangeValue(value: DateValue | DateValue[] | RangeValue<DateValue> | undefined) {
  return value as RangeValue<DateValue> | undefined;
}

/* -----------------------------------------------------------------------------
 *  Misc.
 * -----------------------------------------------------------------------------*/

export function sortDates(values: DateValue[]) {
  return values.sort((a, b) => a.compare(b));
}

export function makeCalendarDateRange(
  start?: DateValue,
  end?: DateValue
): RangeValue<CalendarDate> | undefined {
  if (!start || !end) {
    return undefined;
  }

  if (end.compare(start) < 0) {
    [start, end] = [end, start];
  }

  return { start: toCalendarDate(start), end: toCalendarDate(end) };
}
