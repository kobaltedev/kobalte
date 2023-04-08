/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/0a1d0cd4e1b2f77eed7c0ea08fce8a04f8de6921/packages/@react-stately/calendar/src/utils.ts
 */

import {
  DateDuration,
  DateFormatter,
  endOfMonth,
  isSameDay,
  maxDate,
  minDate,
  startOfMonth,
  startOfWeek,
  startOfYear,
  toCalendarDate,
} from "@internationalized/date";

import { createDateFormatter, LocalizedMessageFormatter } from "../i18n";
import { DateAlignment, DateValue } from "./types";

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

export function getUnitDuration(duration: DateDuration) {
  const unit = { ...duration };

  for (const key in unit) {
    // @ts-ignore
    unit[key] = 1;
  }

  return unit;
}

export function getEraFormat(date: DateValue): "short" | undefined {
  return date?.calendar.identifier === "gregory" && date.era === "BC" ? "short" : undefined;
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

  const date = dateFormatter().format(value.toDate(timeZone));

  return messageFormatter.format("selectedDateDescription", { date });
}

export function getSelectedDateRangeDescription(
  messageFormatter: LocalizedMessageFormatter,
  highlightedRange: { start?: DateValue; end?: DateValue },
  anchorDate: DateValue | undefined,
  timeZone: string
) {
  const start = highlightedRange.start;
  const end = highlightedRange.end;

  // No message if currently selecting a range, or there is nothing highlighted.
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
