/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/950d45db36e63851f411ed0dc6a5aad0af57da68/packages/@react-stately/datepicker/src/utils.ts
 */

import { Time } from "@internationalized/date";
import { Accessor, createEffect, createMemo } from "solid-js";

import { DateValue, TimeValue } from "../calendar/types";
import { DateFieldGranularity, DateTimeFormatOptions } from "./types";

interface FormatterOptions {
  timeZone?: string;
  hideTimeZone?: boolean;
  granularity?: DateFieldGranularity;
  maxGranularity?: "year" | "month" | DateFieldGranularity;
  hourCycle?: 12 | 24;
  showEra?: boolean;
}

const DEFAULT_FORMAT_OPTIONS: DateTimeFormatOptions = {
  year: "numeric",
  month: "numeric",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
  second: "2-digit",
};

export function getDateTimeFormatOptions(
  formatOptions: DateTimeFormatOptions,
  formatterOptions: FormatterOptions
): Intl.DateTimeFormatOptions {
  const dateTimeFormatOptions = { ...DEFAULT_FORMAT_OPTIONS, ...formatOptions };
  const granularity = formatterOptions.granularity || "minute";
  const keys = Object.keys(dateTimeFormatOptions);

  let startIdx = keys.indexOf(formatterOptions.maxGranularity ?? "year");
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

  const opts: Intl.DateTimeFormatOptions = keys.slice(startIdx, endIdx + 1).reduce((opts, key) => {
    // @ts-ignore
    opts[key] = dateTimeFormatOptions[key];
    return opts;
  }, {});

  if (formatterOptions.hourCycle != null) {
    opts.hour12 = formatterOptions.hourCycle === 12;
  }

  opts.timeZone = formatterOptions.timeZone || "UTC";

  const hasTime = granularity === "hour" || granularity === "minute" || granularity === "second";
  if (hasTime && formatterOptions.timeZone && !formatterOptions.hideTimeZone) {
    opts.timeZoneName = "short";
  }

  if (formatterOptions.showEra && startIdx === 0) {
    opts.era = "short";
  }

  return opts;
}

export function getPlaceholderTime(placeholderValue?: DateValue): TimeValue {
  if (placeholderValue && "hour" in placeholderValue) {
    return placeholderValue;
  }

  return new Time();
}

export function createDefaultProps(props: {
  value: Accessor<DateValue | undefined>;
  granularity: Accessor<DateFieldGranularity | undefined>;
}) {
  let lastValue: DateValue;

  // Compute default granularity and time zone from the value.
  // If the value becomes null, keep the last value.
  const value = createMemo(() => {
    const resolvedValue = props.value();

    if (resolvedValue) {
      lastValue = resolvedValue;
    }

    return lastValue;
  });

  const defaultTimeZone = createMemo(() => {
    const resolvedValue = value();

    if (resolvedValue && "timeZone" in resolvedValue) {
      return resolvedValue.timeZone;
    }

    return undefined;
  });

  const granularity = createMemo(() => {
    const resolvedValue = value();

    return props.granularity() || (resolvedValue && "minute" in resolvedValue ? "minute" : "day");
  });

  createEffect(() => {
    const resolvedValue = value();
    const resolvedGranularity = granularity();

    // granularity must actually exist in the value if one is provided.
    if (resolvedValue && !(resolvedGranularity in resolvedValue)) {
      throw new Error(
        "Invalid granularity " + resolvedGranularity + " for value " + resolvedValue.toString()
      );
    }
  });

  return { granularity, defaultTimeZone };
}
