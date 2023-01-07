/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/15e101b74966bd5eb719c6529ce71ce57eaed430/packages/@react-stately/calendar/src/utils.ts
 * https://github.com/adobe/react-spectrum/blob/15e101b74966bd5eb719c6529ce71ce57eaed430/packages/@react-aria/calendar/src/utils.ts
 */

import {
  CalendarDate,
  DateDuration,
  DateFormatter,
  maxDate,
  minDate,
  startOfMonth,
  startOfWeek,
  startOfYear,
  toCalendarDate,
} from "@internationalized/date";
import { LocalizedStringFormatter } from "@internationalized/string";

import { DateValue } from "./types";

export function isInvalid(date: DateValue, minValue?: DateValue, maxValue?: DateValue) {
  return (
    (minValue != null && date.compare(minValue) < 0) ||
    (maxValue != null && date.compare(maxValue) > 0)
  );
}

export function alignCenter(
  date: CalendarDate,
  duration: DateDuration,
  locale: string,
  minValue?: DateValue,
  maxValue?: DateValue
) {
  const halfDuration: DateDuration = {};

  for (const key in duration) {
    //@ts-ignore
    halfDuration[key] = Math.floor(duration[key] / 2);

    //@ts-ignore
    if (halfDuration[key] > 0 && duration[key] % 2 === 0) {
      //@ts-ignore
      halfDuration[key]--;
    }
  }

  const aligned = alignStart(date, duration, locale).subtract(halfDuration);
  return constrainStart(date, aligned, duration, locale, minValue, maxValue);
}

export function alignStart(
  date: CalendarDate,
  duration: DateDuration,
  locale: string,
  minValue?: DateValue,
  maxValue?: DateValue
) {
  // align to the start of the largest unit
  let aligned = date;

  if (duration.years) {
    aligned = startOfYear(date);
  } else if (duration.months) {
    aligned = startOfMonth(date);
  } else if (duration.weeks) {
    aligned = startOfWeek(date, locale);
  }

  return constrainStart(date, aligned, duration, locale, minValue, maxValue);
}

export function alignEnd(
  date: CalendarDate,
  duration: DateDuration,
  locale: string,
  minValue?: DateValue,
  maxValue?: DateValue
) {
  const d = { ...duration };

  // subtract 1 from the smallest unit
  if (duration.days) {
    d.days!--;
  } else if (duration.weeks) {
    d.weeks!--;
  } else if (duration.months) {
    d.months!--;
  } else if (duration.years) {
    d.years!--;
  }

  const aligned = alignStart(date, duration, locale).subtract(d);

  return constrainStart(date, aligned, duration, locale, minValue, maxValue);
}

export function constrainStart(
  date: CalendarDate,
  aligned: CalendarDate,
  duration: DateDuration,
  locale: string,
  minValue?: DateValue,
  maxValue?: DateValue
) {
  if (minValue && date.compare(minValue) >= 0) {
    aligned = maxDate(aligned, alignStart(toCalendarDate(minValue), duration, locale));
  }

  if (maxValue && date.compare(maxValue) <= 0) {
    aligned = minDate(aligned, alignEnd(toCalendarDate(maxValue), duration, locale));
  }

  return aligned;
}

export function constrainValue(date: CalendarDate, minValue?: DateValue, maxValue?: DateValue) {
  if (minValue) {
    date = maxDate(date, toCalendarDate(minValue));
  }

  if (maxValue) {
    date = minDate(date, toCalendarDate(maxValue));
  }

  return date;
}

export function previousAvailableDate(
  date: CalendarDate,
  minValue: DateValue,
  isDateUnavailable?: (date: CalendarDate) => boolean
) {
  if (!isDateUnavailable) {
    return date;
  }

  while (date.compare(minValue) >= 0 && isDateUnavailable(date)) {
    date = date.subtract({ days: 1 });
  }

  if (date.compare(minValue) >= 0) {
    return date;
  }
}

export function getEraFormat(date: CalendarDate): "short" | undefined {
  return date?.calendar.identifier === "gregory" && date.era === "BC" ? "short" : undefined;
}

export function formatRange(
  dateFormatter: DateFormatter,
  stringFormatter: LocalizedStringFormatter,
  start: CalendarDate,
  end: CalendarDate,
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

  return stringFormatter.format("dateRange", { startDate: startValue, endDate: endValue });
}

export function unitDuration(duration: DateDuration) {
  const unit = { ...duration };

  for (const key in duration) {
    // @ts-ignore
    unit[key] = 1;
  }

  return unit;
}

/**
 * Create a unique key for the given date.
 */
export function getKeyForDate(date: CalendarDate) {
  return `${date.year}-${date.month}-${date.day}`;
}
