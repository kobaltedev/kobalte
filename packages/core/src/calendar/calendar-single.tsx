/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/15e101b74966bd5eb719c6529ce71ce57eaed430/packages/@react-aria/calendar/src/useCalendar.ts
 * https://github.com/adobe/react-spectrum/blob/15e101b74966bd5eb719c6529ce71ce57eaed430/packages/@react-stately/calendar/src/useCalendarState.ts
 */

import {
  Calendar,
  CalendarDate,
  createCalendar,
  DateDuration,
  DateFormatter,
  endOfMonth,
  endOfWeek,
  getDayOfWeek,
  GregorianCalendar,
  isSameDay,
  startOfMonth,
  startOfWeek,
  toCalendar,
  toCalendarDate,
  today,
} from "@internationalized/date";
import { createPolymorphicComponent, mergeDefaultProps } from "@kobalte/utils";
import { createEffect, createMemo, createSignal, splitProps } from "solid-js";

import { createDateFormatter, useLocale } from "../i18n";
import { createControllableSignal } from "../primitives";
import { CalendarRoot, CalendarRootOptions } from "./calendar-root";
import { CalendarState, DateValue, MappedDateValue } from "./types";
import {
  alignCenter,
  alignEnd,
  alignStart,
  constrainStart,
  constrainValue,
  isInvalid,
  previousAvailableDate,
  unitDuration,
} from "./utils";

export interface CalendarSingleOptions extends Omit<CalendarRootOptions, "state"> {
  /** The controlled selected date of the calendar. */
  selectedDate?: DateValue;

  /**
   * The selected date of the calendar when initially rendered.
   * Useful when you do not need to control the selected date.
   */
  defaultSelectedDate?: DateValue;

  /** Event handler called when the selected date changes. */
  onSelectedDateChange?: (selectedDate: MappedDateValue<DateValue>) => void;

  /**
   * A function that creates a [Calendar](https://react-spectrum.adobe.com/internationalized/date/Calendar.html)
   * object for a given calendar identifier. Such a function may be imported from the
   * `@internationalized/date` package, or manually implemented to include support for
   * only certain calendars.
   */
  createCalendar?: (name: string) => Calendar;

  /**
   * The amount of days that will be displayed at once.
   * This affects how pagination works.
   */
  visibleDuration?: DateDuration;

  /** Determines how to align the initial selection relative to the visible date range. */
  selectionAlignment?: "start" | "center" | "end";
}

// TODO: extract state logic for reuse in range calendar
export const CalendarSingle = createPolymorphicComponent<"div", CalendarSingleOptions>(props => {
  props = mergeDefaultProps(
    {
      visibleDuration: { months: 1 },
      createCalendar,
    },
    props
  );

  const [local, others] = splitProps(props, [
    "selectedDate",
    "defaultSelectedDate",
    "onSelectedDateChange",
    "createCalendar",
    "visibleDuration",
    "selectionAlignment",
  ]);

  const [selectedDate, setSelectedDate] = createControllableSignal<DateValue>({
    value: () => local.selectedDate,
    defaultValue: () => local.defaultSelectedDate,
    onChange: value => local.onSelectedDateChange?.(value),
  });

  const { locale } = useLocale();

  const defaultFormatter = createMemo(() => new DateFormatter(locale()));

  const resolvedOptions = createMemo(() => defaultFormatter().resolvedOptions());

  const calendar = createMemo(() => local.createCalendar!(resolvedOptions().calendar));

  const calendarDateValue = createMemo(() => {
    const value = selectedDate();

    if (value != null) {
      return toCalendar(toCalendarDate(value), calendar());
    }

    return undefined;
  });

  const timeZone = createMemo(() => {
    const value = selectedDate();

    if (value != null && "timeZone" in value) {
      return value.timeZone;
    }

    return resolvedOptions().timeZone;
  });

  const focusedCalendarDate = createMemo(() => {
    if (props.focusedValue == null) {
      return undefined;
    }

    const date = toCalendar(toCalendarDate(props.focusedValue), calendar());

    return constrainValue(date, others.minValue, others.maxValue);
  });

  const defaultFocusedCalendarDate = createMemo(() => {
    let date: CalendarDate;

    if (props.defaultFocusedValue) {
      date = toCalendar(toCalendarDate(props.defaultFocusedValue), calendar());
    } else {
      date = calendarDateValue() || toCalendar(today(timeZone()), calendar());
    }

    return constrainValue(date, props.minValue, props.maxValue);
  });

  const [focusedDate, setFocusedDate] = createControllableSignal<CalendarDate>({
    value: focusedCalendarDate,
    defaultValue: defaultFocusedCalendarDate,
    onChange: value => others.onFocusChange?.(value),
  });

  const getInitialStartDate = () => {
    // Can't be undefined because of the `defaultFocusedCalendarDate` value.
    const date = focusedDate()!;

    // Can't be undefined because of the default props.
    const visibleDuration = local.visibleDuration!;

    switch (local.selectionAlignment) {
      case "start":
        return alignStart(date, visibleDuration, locale(), others.minValue, others.maxValue);
      case "end":
        return alignEnd(date, visibleDuration, locale(), others.minValue, others.maxValue);
      case "center":
      default:
        return alignCenter(date, visibleDuration, locale(), others.minValue, others.maxValue);
    }
  };

  const [startDate, setStartDate] = createSignal(getInitialStartDate());

  const [isFocused, setFocused] = createSignal(others.autoFocus || false);

  const endDate = createMemo(() => {
    const duration = { ...local.visibleDuration };

    if (duration.days) {
      duration.days--;
    } else {
      duration.days = -1;
    }

    return startDate().add(duration);
  });

  let lastCalendarIdentifier = calendar().identifier;

  // Reset focused date and visible range when calendar changes.
  createEffect(() => {
    if (calendar().identifier !== lastCalendarIdentifier) {
      const newFocusedDate = toCalendar(focusedDate()!, calendar());

      setStartDate(
        alignCenter(
          newFocusedDate,
          local.visibleDuration!,
          locale(),
          others.minValue,
          others.maxValue
        )
      );

      setFocusedDate(newFocusedDate);

      lastCalendarIdentifier = calendar().identifier;
    }
  });

  createEffect(() => {
    const date = focusedDate()!;

    if (isInvalid(date, others.minValue, others.maxValue)) {
      // If the focused date was moved to an invalid value, it can't be focused, so constrain it.
      setFocusedDate(constrainValue(date, others.minValue, others.maxValue));
    } else if (date.compare(startDate()) < 0) {
      setStartDate(
        alignEnd(date, local.visibleDuration!, locale(), others.minValue, others.maxValue)
      );
    } else if (date.compare(endDate()) > 0) {
      setStartDate(
        alignStart(date, local.visibleDuration!, locale(), others.minValue, others.maxValue)
      );
    }
  });

  // Sets focus to a specific cell date
  const focusCell = (date: CalendarDate) => {
    date = constrainValue(date, others.minValue, others.maxValue);
    setFocusedDate(date);
  };

  const setValue = (date: CalendarDate) => {
    if (!others.isDisabled && !others.isReadOnly) {
      let newValue: CalendarDate | undefined = constrainValue(
        date,
        others.minValue,
        others.maxValue
      );

      newValue = previousAvailableDate(newValue, startDate(), others.isDateUnavailable);

      if (!newValue) {
        return;
      }

      const value = selectedDate();

      // The display calendar should not have any effect on the emitted value.
      // Emit dates in the same calendar as the original value, if any, otherwise gregorian.
      newValue = toCalendar(newValue, value?.calendar || new GregorianCalendar());

      // Preserve time if the input value had one.
      if (value && "hour" in value) {
        setSelectedDate(value.set(newValue));
      } else {
        setSelectedDate(newValue);
      }
    }
  };

  const isUnavailable = createMemo(() => {
    const value = calendarDateValue();

    if (!value) {
      return false;
    }

    if (others.isDateUnavailable && others.isDateUnavailable(value)) {
      return true;
    }

    return isInvalid(value, others.minValue, others.maxValue);
  });

  const validationState = () => others.validationState || (isUnavailable() ? "invalid" : undefined);

  const state: CalendarState = {
    isDisabled: () => others.isDisabled ?? false,
    isReadOnly: () => others.isReadOnly ?? false,
    value: () => calendarDateValue(),
    setValue,
    visibleRange: () => ({
      start: startDate(),
      end: endDate(),
    }),
    minValue: () => others.minValue,
    maxValue: () => others.maxValue,
    focusedDate: () => focusedDate()!,
    timeZone,
    validationState,
    setFocusedDate(date) {
      focusCell(date);
      setFocused(true);
    },
    focusNextDay() {
      focusCell(focusedDate()!.add({ days: 1 }));
    },
    focusPreviousDay() {
      focusCell(focusedDate()!.subtract({ days: 1 }));
    },
    focusNextRow() {
      if (local.visibleDuration?.days) {
        this.focusNextPage();
      } else if (
        local.visibleDuration?.weeks ||
        local.visibleDuration?.months ||
        local.visibleDuration?.years
      ) {
        focusCell(focusedDate()!.add({ weeks: 1 }));
      }
    },
    focusPreviousRow() {
      if (local.visibleDuration?.days) {
        this.focusPreviousPage();
      } else if (
        local.visibleDuration?.weeks ||
        local.visibleDuration?.months ||
        local.visibleDuration?.years
      ) {
        focusCell(focusedDate()!.subtract({ weeks: 1 }));
      }
    },
    focusNextPage() {
      const start = startDate().add(local.visibleDuration!);

      setFocusedDate(
        constrainValue(focusedDate()!.add(local.visibleDuration!), others.minValue, others.maxValue)
      );

      setStartDate(
        alignStart(
          constrainStart(
            focusedDate()!,
            start,
            local.visibleDuration!,
            locale(),
            others.minValue,
            others.maxValue
          ),
          local.visibleDuration!,
          locale()
        )
      );
    },
    focusPreviousPage() {
      const start = startDate().subtract(local.visibleDuration!);

      setFocusedDate(
        constrainValue(
          focusedDate()!.subtract(local.visibleDuration!),
          others.minValue,
          others.maxValue
        )
      );

      setStartDate(
        alignStart(
          constrainStart(
            focusedDate()!,
            start,
            local.visibleDuration!,
            locale(),
            others.minValue,
            others.maxValue
          ),
          local.visibleDuration!,
          locale()
        )
      );
    },
    focusSectionStart() {
      if (local.visibleDuration?.days) {
        focusCell(startDate());
      } else if (local.visibleDuration?.weeks) {
        focusCell(startOfWeek(focusedDate()!, locale()));
      } else if (local.visibleDuration?.months || local.visibleDuration?.years) {
        focusCell(startOfMonth(focusedDate()!));
      }
    },
    focusSectionEnd() {
      if (local.visibleDuration?.days) {
        focusCell(endDate());
      } else if (local.visibleDuration?.weeks) {
        focusCell(endOfWeek(focusedDate()!, locale()));
      } else if (local.visibleDuration?.months || local.visibleDuration?.years) {
        focusCell(endOfMonth(focusedDate()!));
      }
    },
    focusNextSection(larger) {
      if (!larger && !local.visibleDuration?.days) {
        focusCell(focusedDate()!.add(unitDuration(local.visibleDuration!)));
        return;
      }

      if (local.visibleDuration?.days) {
        this.focusNextPage();
      } else if (local.visibleDuration?.weeks) {
        focusCell(focusedDate()!.add({ months: 1 }));
      } else if (local.visibleDuration?.months || local.visibleDuration?.years) {
        focusCell(focusedDate()!.add({ years: 1 }));
      }
    },
    focusPreviousSection(larger) {
      if (!larger && !local.visibleDuration?.days) {
        focusCell(focusedDate()!.subtract(unitDuration(local.visibleDuration!)));
        return;
      }

      if (local.visibleDuration?.days) {
        this.focusPreviousPage();
      } else if (local.visibleDuration?.weeks) {
        focusCell(focusedDate()!.subtract({ months: 1 }));
      } else if (local.visibleDuration?.months || local.visibleDuration?.years) {
        focusCell(focusedDate()!.subtract({ years: 1 }));
      }
    },
    selectFocusedDate() {
      setValue(focusedDate()!);
    },
    selectDate(date) {
      setValue(date);
    },
    isFocused,
    setFocused,
    isInvalid(date) {
      return isInvalid(date, others.minValue, others.maxValue);
    },
    isSelected(date) {
      const value = calendarDateValue();

      return (
        value != null &&
        isSameDay(date, value) &&
        !this.isCellDisabled(date) &&
        !this.isCellUnavailable(date)
      );
    },
    isCellFocused(date) {
      return isFocused() && isSameDay(date, focusedDate()!);
    },
    isCellDisabled(date) {
      return (
        props.isDisabled ||
        date.compare(startDate()) < 0 ||
        date.compare(endDate()) > 0 ||
        isInvalid(date, others.minValue, others.maxValue)
      );
    },
    isCellUnavailable(date) {
      return props.isDateUnavailable?.(date) ?? false;
    },
    isPreviousVisibleRangeInvalid() {
      const prev = startDate().subtract({ days: 1 });
      return isSameDay(prev, startDate()) || isInvalid(prev, others.minValue, others.maxValue);
    },
    isNextVisibleRangeInvalid() {
      // Adding may return the same date if we reached the end of time
      // according to the calendar system (e.g. 9999-12-31).
      const next = endDate().add({ days: 1 });
      return isSameDay(next, endDate()) || isInvalid(next, others.minValue, others.maxValue);
    },
    getDatesInWeek(weekIndex, from) {
      const start = from ?? startDate();

      let date = start.add({ weeks: weekIndex });
      const dates = [];

      date = startOfWeek(date, locale());

      // startOfWeek will clamp dates within the calendar system's valid range, which may
      // start in the middle of a week. In this case, add null placeholders.
      const dayOfWeek = getDayOfWeek(date, locale());
      for (let i = 0; i < dayOfWeek; i++) {
        dates.push(null);
      }

      while (dates.length < 7) {
        dates.push(date);

        const nextDate = date.add({ days: 1 });

        if (isSameDay(date, nextDate)) {
          // If the next day is the same, we have hit the end of the calendar system.
          break;
        }

        date = nextDate;
      }

      // Add null placeholders if at the end of the calendar system.
      while (dates.length < 7) {
        dates.push(null);
      }

      return dates;
    },
  };

  return <CalendarRoot state={state} {...others} />;
});
