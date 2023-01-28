/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/15e101b74966bd5eb719c6529ce71ce57eaed430/packages/@react-stately/calendar/src/useCalendarState.ts
 */

import {
  Calendar,
  CalendarDate,
  createCalendar,
  DateDuration,
  DateFormatter,
  endOfMonth,
  getDayOfWeek,
  GregorianCalendar,
  isSameDay,
  startOfMonth,
  startOfWeek,
  toCalendar,
  toCalendarDate,
  today,
} from "@internationalized/date";
import {
  access,
  focusWithoutScrolling,
  getScrollParent,
  MaybeAccessor,
  mergeDefaultProps,
  scrollIntoView,
  ValidationState,
} from "@kobalte/utils";
import { Accessor, createEffect, createMemo, createSignal, on } from "solid-js";

import { useLocale } from "../i18n";
import { createControllableSignal } from "../primitives";
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

export interface CreateCalendarStateProps {
  /** The controlled selected date of the calendar. */
  value?: MaybeAccessor<DateValue | undefined>;

  /**
   * The selected date of the calendar when initially rendered.
   * Useful when you do not need to control the selected date.
   */
  defaultValue?: MaybeAccessor<DateValue | undefined>;

  /** Event handler called when the selected date changes. */
  onValueChange?: (selectedDate: MappedDateValue<DateValue>) => void;

  /** The locale to display and edit the value according to. */
  locale?: MaybeAccessor<string | undefined>;

  /**
   * A function that creates a [Calendar](https://react-spectrum.adobe.com/internationalized/date/Calendar.html)
   * object for a given calendar identifier. Such a function may be imported from the
   * `@internationalized/date` package, or manually implemented to include support for
   * only certain calendars.
   */
  createCalendar?: (name: string) => Calendar;

  /**
   * The number of months that will be displayed at once.
   * This affects how pagination works.
   */
  visibleMonths?: MaybeAccessor<number | undefined>;

  /** Determines how to align the initial selection relative to the visible date range. */
  selectionAlignment?: MaybeAccessor<"start" | "center" | "end" | undefined>;

  /** The minimum allowed date that a user may select. */
  minValue?: MaybeAccessor<DateValue | undefined>;

  /** The maximum allowed date that a user may select. */
  maxValue?: MaybeAccessor<DateValue | undefined>;

  /** Callback that is called for each date of the calendar. If it returns true, then the date is unavailable. */
  isDateUnavailable?: (date: DateValue) => boolean;

  /** Whether the calendar is disabled. */
  isDisabled?: MaybeAccessor<boolean | undefined>;

  /** Whether the calendar value is immutable. */
  isReadOnly?: MaybeAccessor<boolean | undefined>;

  /** Whether to automatically focus the calendar when it mounts. */
  autoFocus?: MaybeAccessor<boolean | undefined>;

  /** Controls the currently focused date within the calendar. */
  focusedValue?: MaybeAccessor<DateValue | undefined>;

  /** The date that is focused when the calendar first mounts (uncountrolled). */
  defaultFocusedValue?: MaybeAccessor<DateValue | undefined>;

  /** Handler that is called when the focused date changes. */
  onFocusChange?: (date: CalendarDate) => void;

  /** Whether the current selection is valid or invalid according to application logic. */
  validationState?: MaybeAccessor<ValidationState | undefined>;
}

/**
 * Provides state management for a calendar component.
 * A calendar displays one or more date grids and allows users to select a single date.
 */
export function createCalendarState(props: CreateCalendarStateProps): CalendarState {
  const { locale: defaultLocale } = useLocale();

  props = mergeDefaultProps(
    {
      locale: () => defaultLocale(),
      visibleMonths: 1,
      createCalendar,
    },
    props
  );

  const [selectedDate, setSelectedDate] = createControllableSignal<DateValue>({
    value: () => access(props.value),
    defaultValue: () => access(props.defaultValue),
    onChange: value => props.onValueChange?.(value),
  });

  const [calendarRef, setCalendarRef] = createSignal<HTMLDivElement>();

  const visibleDuration: Accessor<DateDuration> = createMemo(() => {
    return { months: access(props.visibleMonths) };
  });

  const defaultFormatter = createMemo(() => new DateFormatter(access(props.locale)!));

  const resolvedOptions = createMemo(() => defaultFormatter().resolvedOptions());

  const calendar = createMemo(() => props.createCalendar!(resolvedOptions().calendar));

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
    const focusedValue = access(props.focusedValue);

    if (focusedValue == null) {
      return undefined;
    }

    const date = toCalendar(toCalendarDate(focusedValue), calendar());

    return constrainValue(date, access(props.minValue), access(props.maxValue));
  });

  const defaultFocusedCalendarDate = createMemo(() => {
    const defaultFocusedValue = access(props.defaultFocusedValue);
    let date: CalendarDate;

    if (defaultFocusedValue) {
      date = toCalendar(toCalendarDate(defaultFocusedValue), calendar());
    } else {
      date = calendarDateValue() || toCalendar(today(timeZone()), calendar());
    }

    return constrainValue(date, access(props.minValue), access(props.maxValue));
  });

  const [focusedDate, setFocusedDate] = createControllableSignal<CalendarDate>({
    value: focusedCalendarDate,
    defaultValue: defaultFocusedCalendarDate,
    onChange: value => props.onFocusChange?.(value),
  });

  const getInitialStartDate = () => {
    // Can't be undefined because of the `defaultFocusedCalendarDate` value.
    const date = focusedDate()!;

    // Can't be undefined because of the default props.
    const locale = access(props.locale)!;

    const minValue = access(props.minValue);
    const maxValue = access(props.maxValue);

    switch (access(props.selectionAlignment)) {
      case "start":
        return alignStart(date, visibleDuration(), locale, minValue, maxValue);
      case "end":
        return alignEnd(date, visibleDuration(), locale, minValue, maxValue);
      case "center":
      default:
        return alignCenter(date, visibleDuration(), locale, minValue, maxValue);
    }
  };

  const [startDate, setStartDate] = createSignal(getInitialStartDate());

  const [isFocused, setFocused] = createSignal(access(props.autoFocus) || false);

  const endDate = createMemo(() => {
    return startDate().add({ ...visibleDuration(), days: -1 });
  });

  const isUnavailable = createMemo(() => {
    const value = calendarDateValue();

    if (!value) {
      return false;
    }

    if (props.isDateUnavailable && props.isDateUnavailable(value)) {
      return true;
    }

    return isInvalid(value, access(props.minValue), access(props.maxValue));
  });

  const validationState = () => {
    return access(props.validationState) || (isUnavailable() ? "invalid" : undefined);
  };

  // Sets focus to a specific cell date
  const focusCell = (date: CalendarDate) => {
    date = constrainValue(date, access(props.minValue), access(props.maxValue));
    setFocusedDate(date);

    // Focus the first tabbable cell button with the focused date in the calendar root DOM subtree.
    const cellButton = calendarRef()?.querySelector(
      `[data-date='${date}'][tabindex='0']`
    ) as HTMLElement | null;

    if (cellButton) {
      focusWithoutScrolling(cellButton);

      // Scroll into view if navigating with a keyboard, otherwise
      // try not to shift the view under the user's mouse/finger.
      // Only scroll the direct scroll parent, not the whole page, so
      // we don't scroll to the bottom when opening date picker popover.

      // TODO: fix later
      /*
      if (getInteractionModality() !== "pointer") {
        scrollIntoView(getScrollParent(cellButton) as HTMLElement, cellButton);
      }
      */
    }
  };

  const setValue = (date: CalendarDate) => {
    if (access(props.isDisabled) || access(props.isReadOnly)) {
      return;
    }

    const minValue = access(props.minValue);
    const maxValue = access(props.maxValue);

    let newValue: CalendarDate | undefined = constrainValue(date, minValue, maxValue);

    newValue = previousAvailableDate(newValue, startDate(), props.isDateUnavailable);

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
  };

  // Reset focused date and visible range when calendar changes.
  createEffect(
    on(
      () => calendar().identifier,
      () => {
        const locale = access(props.locale)!;
        const minValue = access(props.minValue);
        const maxValue = access(props.maxValue);

        const newFocusedDate = toCalendar(focusedDate()!, calendar());

        setStartDate(alignCenter(newFocusedDate, visibleDuration(), locale, minValue, maxValue));

        setFocusedDate(newFocusedDate);
      }
    )
  );

  createEffect(() => {
    let date = focusedDate()!;

    const locale = access(props.locale)!;
    const minValue = access(props.minValue);
    const maxValue = access(props.maxValue);

    if (isInvalid(date, minValue, maxValue)) {
      // If the focused date was moved to an invalid value, it can't be focused, so constrain it.
      date = constrainValue(date, minValue, maxValue);
      setFocusedDate(date);
    }

    if (date.compare(startDate()) < 0) {
      setStartDate(alignEnd(date, visibleDuration(), locale, minValue, maxValue));
    } else if (date.compare(endDate()) > 0) {
      setStartDate(alignStart(date, visibleDuration(), locale, minValue, maxValue));
    }
  });

  return {
    setCalendarRef,
    isDisabled: () => access(props.isDisabled) ?? false,
    isReadOnly: () => access(props.isReadOnly) ?? false,
    value: () => calendarDateValue(),
    setValue,
    visibleRange: () => ({
      start: startDate(),
      end: endDate(),
    }),
    minValue: () => access(props.minValue),
    maxValue: () => access(props.maxValue),
    focusedDate: () => focusedDate()!,
    locale: () => access(props.locale)!,
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
      focusCell(focusedDate()!.add({ weeks: 1 }));
    },
    focusPreviousRow() {
      focusCell(focusedDate()!.subtract({ weeks: 1 }));
    },
    focusNextPage() {
      const locale = access(props.locale)!;
      const minValue = access(props.minValue);
      const maxValue = access(props.maxValue);

      const start = startDate().add(visibleDuration());

      const newFocusedDate = constrainValue(
        focusedDate()!.add(visibleDuration()),
        minValue,
        maxValue
      );

      setFocusedDate(newFocusedDate);

      setStartDate(
        alignStart(
          constrainStart(newFocusedDate, start, visibleDuration(), locale, minValue, maxValue),
          visibleDuration(),
          locale
        )
      );
    },
    focusPreviousPage() {
      const locale = access(props.locale)!;
      const minValue = access(props.minValue);
      const maxValue = access(props.maxValue);

      const start = startDate().subtract(visibleDuration());

      const newFocusedDate = constrainValue(
        focusedDate()!.subtract(visibleDuration()),
        minValue,
        maxValue
      );

      setFocusedDate(newFocusedDate);

      setStartDate(
        alignStart(
          constrainStart(newFocusedDate, start, visibleDuration(), locale, minValue, maxValue),
          visibleDuration(),
          locale
        )
      );
    },
    focusSectionStart() {
      focusCell(startOfMonth(focusedDate()!));
    },
    focusSectionEnd() {
      focusCell(endOfMonth(focusedDate()!));
    },
    focusNextSection(larger) {
      if (!larger) {
        focusCell(focusedDate()!.add(unitDuration(visibleDuration())));
        return;
      }

      focusCell(focusedDate()!.add({ years: 1 }));
    },
    focusPreviousSection(larger) {
      if (!larger) {
        focusCell(focusedDate()!.subtract(unitDuration(visibleDuration())));
        return;
      }

      focusCell(focusedDate()!.subtract({ years: 1 }));
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
      return isInvalid(date, access(props.minValue), access(props.maxValue));
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
      const resolvedFocusedDate = focusedDate();
      return isFocused() && resolvedFocusedDate != null && isSameDay(date, resolvedFocusedDate);
    },
    isCellDisabled(date) {
      return (
        access(props.isDisabled) ||
        date.compare(startDate()) < 0 ||
        date.compare(endDate()) > 0 ||
        this.isInvalid(date)
      );
    },
    isCellUnavailable(date) {
      return props.isDateUnavailable?.(date) ?? false;
    },
    isPreviousVisibleRangeInvalid() {
      const prev = startDate().subtract({ days: 1 });
      return isSameDay(prev, startDate()) || this.isInvalid(prev);
    },
    isNextVisibleRangeInvalid() {
      // Adding may return the same date if we reached the end of time
      // according to the calendar system (e.g. 9999-12-31).
      const next = endDate().add({ days: 1 });
      return isSameDay(next, endDate()) || this.isInvalid(next);
    },
    getDatesInWeek(weekIndex, from) {
      const locale = access(props.locale)!;

      const start = from ?? startDate();

      let date = start.add({ weeks: weekIndex });
      const dates = [];

      date = startOfWeek(date, locale);

      // startOfWeek will clamp dates within the calendar system's valid range, which may
      // start in the middle of a week. In this case, add null placeholders.
      const dayOfWeek = getDayOfWeek(date, locale);
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
}
