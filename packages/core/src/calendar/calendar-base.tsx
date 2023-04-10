/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/0a1d0cd4e1b2f77eed7c0ea08fce8a04f8de6921/packages/@react-stately/calendar/src/useCalendarState.ts
 * https://github.com/adobe/react-spectrum/blob/0a1d0cd4e1b2f77eed7c0ea08fce8a04f8de6921/packages/@react-aria/calendar/src/useCalendarBase.ts
 */

import {
  Calendar,
  DateDuration,
  DateFormatter,
  getDayOfWeek,
  GregorianCalendar,
  isSameDay,
  startOfWeek,
  toCalendar,
  toCalendarDate,
  today,
} from "@internationalized/date";
import { mergeDefaultProps, OverrideComponentProps, ValidationState } from "@kobalte/utils";
import { Accessor, createEffect, createMemo, createSignal, on, splitProps } from "solid-js";

import { createMessageFormatter, getReadingDirection } from "../i18n";
import { announce } from "../live-announcer";
import { Polymorphic } from "../polymorphic";
import { createControllableArraySignal, createControllableSignal } from "../primitives";
import { CALENDAR_INTL_MESSAGES } from "./calendar.intl";
import { CalendarContext, CalendarContextValue, CalendarDataSet } from "./calendar-context";
import { CalendarSelectionMode, DateAlignment, DateValue } from "./types";
import {
  alignCenter,
  alignDate,
  constrainValue,
  getAdjustedDateFn,
  getEndDate,
  getNextPage,
  getNextRow,
  getNextSection,
  getPreviousAvailableDate,
  getPreviousPage,
  getPreviousRow,
  getPreviousSection,
  getSectionEnd,
  getSectionStart,
  getSelectedDateDescription,
  getVisibleRangeDescription,
  isDateInvalid,
} from "./utils";

export interface CalendarBaseOptions {
  /** The locale to display and edit the value according to. */
  locale: string;

  /**
   * A function that creates a [Calendar](https://react-spectrum.adobe.com/internationalized/date/Calendar.html)
   * object for a given calendar identifier. Such a function may be imported from the
   * `@internationalized/date` package, or manually implemented to include support for
   * only certain calendars.
   */
  createCalendar: (name: string) => Calendar;

  /** The amount of days that will be displayed at once. This affects how pagination works. */
  visibleDuration?: DateDuration;

  /** Determines how to align the initial selection relative to the visible date range. */
  selectionAlignment?: DateAlignment;

  /**
   * The selection mode of the calendar.
   * - `single` - only one date can be selected
   * - `multiple` - multiple dates can be selected
   * - `range` - a range of dates can be selected
   */
  selectionMode?: CalendarSelectionMode;

  /** The controlled selected dates of the calendar. */
  value?: Array<DateValue>;

  /**
   * The dates of the calendar that should be selected when initially rendered.
   * Useful when you do not need to control the state of the calendar.
   */
  defaultValue?: Array<DateValue>;

  /** Event handler called when the selected dates change. */
  onChange?: (value: Array<DateValue>) => void;

  /** The minimum allowed date that a user may select. */
  min?: DateValue;

  /** The maximum allowed date that a user may select. */
  max?: DateValue;

  /** Callback that is called for each date of the calendar. If it returns true, then the date is unavailable. */
  isDateUnavailable?: (date: DateValue) => boolean;

  /** Whether to automatically focus the calendar when it mounts. */
  autoFocus?: boolean;

  /** Controls the currently focused date within the calendar. */
  focusedValue?: DateValue;

  /** The date that is focused when the calendar first mounts. */
  defaultFocusedValue?: DateValue;

  /** Handler that is called when the focused date changes. */
  onFocusChange?: (date: DateValue) => void;

  /** Whether the current selection is valid or invalid according to application logic. */
  validationState?: ValidationState;

  /** Whether the calendar is disabled. */
  disabled?: boolean;

  /** Whether the calendar value is immutable. */
  readOnly?: boolean;
}

export type CalendarBaseProps = OverrideComponentProps<"div", CalendarBaseOptions>;

export function CalendarBase(props: CalendarBaseProps) {
  props = mergeDefaultProps(
    {
      visibleDuration: { months: 1 },
      selectionAlignment: "center",
      selectionMode: "single",
    },
    props
  );

  const [local, others] = splitProps(props, [
    "locale",
    "createCalendar",
    "visibleDuration",
    "selectionAlignment",
    "selectionMode",
    "value",
    "defaultValue",
    "onChange",
    "min",
    "max",
    "isDateUnavailable",
    "autoFocus",
    "focusedValue",
    "defaultFocusedValue",
    "onFocusChange",
    "validationState",
    "disabled",
    "readOnly",
    "aria-label",
  ]);

  const messageFormatter = createMessageFormatter(() => CALENDAR_INTL_MESSAGES);

  const resolvedOptions = createMemo(() => {
    return new DateFormatter(local.locale).resolvedOptions();
  });

  const direction = createMemo(() => {
    return getReadingDirection(local.locale);
  });

  const calendar = createMemo(() => {
    return local.createCalendar(resolvedOptions().calendar);
  });

  const [value, setControlledValue] = createControllableArraySignal({
    value: () => local.value,
    defaultValue: () => local.defaultValue,
    onChange: value => local.onChange?.(value),
  });

  const calendarDateValue = createMemo(() => {
    return value().map(date => toCalendar(toCalendarDate(date), calendar()));
  });

  const timeZone = createMemo(() => {
    const firstValue = value()[0];

    if (firstValue && "timeZone" in firstValue) {
      return firstValue.timeZone;
    }

    return resolvedOptions().timeZone;
  });

  const focusedCalendarDate = createMemo(() => {
    if (local.focusedValue) {
      return constrainValue(
        toCalendar(toCalendarDate(local.focusedValue), calendar()),
        local.min,
        local.max
      );
    }

    return undefined;
  });

  const defaultFocusedCalendarDate = createMemo(() => {
    return constrainValue(
      local.defaultFocusedValue
        ? toCalendar(toCalendarDate(local.defaultFocusedValue), calendar())
        : calendarDateValue()[0] || toCalendar(today(timeZone()), calendar()),
      local.min,
      local.max
    );
  });

  const [focusedDate, setFocusedDate] = createControllableSignal({
    value: focusedCalendarDate,
    defaultValue: defaultFocusedCalendarDate,
    onChange: value => local.onFocusChange?.(value),
  });

  const [startDate, setStartDate] = createSignal(
    alignDate(
      focusedDate()!,
      local.selectionAlignment!,
      local.visibleDuration!,
      local.locale,
      local.min,
      local.max
    )
  );

  const endDate = createMemo(() => {
    return getEndDate(startDate(), local.visibleDuration!);
  });

  const [isFocused, setIsFocused] = createSignal(local.autoFocus || false);

  const validationState = createMemo(() => {
    if (local.validationState) {
      return local.validationState;
    }

    if (calendarDateValue().length <= 0) {
      return null;
    }

    const isSomeDateInvalid = calendarDateValue().some(date => {
      return local.isDateUnavailable?.(date) || isDateInvalid(date, local.min, local.max);
    });

    return isSomeDateInvalid ? "invalid" : null;
  });

  const visibleRangeDescription = createMemo(() => {
    return getVisibleRangeDescription(messageFormatter(), startDate(), endDate(), timeZone(), true);
  });

  const ariaLabel = () => {
    return [local["aria-label"], visibleRangeDescription()].filter(Boolean).join(", ");
  };

  const isCellDisabled = (date: DateValue) => {
    return (
      local.disabled ||
      date.compare(startDate()) < 0 ||
      date.compare(endDate()) > 0 ||
      isDateInvalid(date, local.min, local.max)
    );
  };

  const isCellUnavailable = (date: DateValue) => {
    return local.isDateUnavailable?.(date) ?? false;
  };

  const isCellFocused = (date: DateValue) => {
    const resolvedFocusedDate = focusedDate();

    return isFocused() && resolvedFocusedDate != null && isSameDay(date, resolvedFocusedDate);
  };

  const isCellSelected = (cellDate: DateValue) => {
    return (
      calendarDateValue().some(date => isSameDay(cellDate, date)) &&
      !isCellDisabled(cellDate) &&
      !isCellUnavailable(cellDate)
    );
  };

  const selectDate = (date: DateValue) => {
    if (local.readOnly || local.disabled) {
      return;
    }

    let newValue = getPreviousAvailableDate(
      constrainValue(date, local.min, local.max),
      startDate(),
      local.isDateUnavailable
    );

    if (!newValue) {
      return;
    }

    if (local.selectionMode === "range") {
      // TODO: RangeCalendar
    } else {
      setControlledValue(prev => {
        if (!newValue) {
          return prev;
        }

        const firstValue = prev[0];

        // The display calendar should not have any effect on the emitted value.
        // Emit dates in the same calendar as the original value, if any, otherwise gregorian.
        newValue = toCalendar(newValue, firstValue?.calendar || new GregorianCalendar());

        // Preserve time if the input value had one.
        if (firstValue && "hour" in firstValue) {
          newValue = firstValue.set(newValue);
        }

        if (local.selectionMode === "single") {
          return [newValue];
        }

        if (local.selectionMode === "multiple") {
          const index = prev.findIndex(date => (newValue ? isSameDay(date, newValue) : false));

          // If date is already selected, remove it.
          if (index !== -1) {
            return [...prev.slice(0, index), ...prev.slice(index + 1)];
          } else {
            return [...prev, newValue];
          }
        }

        return prev;
      });
    }
  };

  const selectFocusedDate = () => {
    selectDate(focusedDate()!);
  };

  function focusCell(date: DateValue) {
    setFocusedDate(constrainValue(date, local.min, local.max));

    if (!isFocused()) {
      setIsFocused(true);
    }
  }

  const focusNextDay = () => {
    focusCell(focusedDate()!.add({ days: 1 }));
  };

  const focusPreviousDay = () => {
    focusCell(focusedDate()!.subtract({ days: 1 }));
  };

  const focusNextPage = () => {
    const page = getNextPage(
      focusedDate()!,
      startDate(),
      local.visibleDuration!,
      local.locale,
      local.min,
      local.max
    );

    setStartDate(page.startDate);
    focusCell(page.focusedDate);
  };

  const focusPreviousPage = () => {
    const page = getPreviousPage(
      focusedDate()!,
      startDate(),
      local.visibleDuration!,
      local.locale,
      local.min,
      local.max
    );

    setStartDate(page.startDate);
    focusCell(page.focusedDate);
  };

  const focusNextRow = () => {
    const row = getNextRow(
      focusedDate()!,
      startDate(),
      local.visibleDuration!,
      local.locale,
      local.min,
      local.max
    );

    if (row) {
      setStartDate(row.startDate);
      focusCell(row.focusedDate);
    }
  };

  const focusPreviousRow = () => {
    const row = getPreviousRow(
      focusedDate()!,
      startDate(),
      local.visibleDuration!,
      local.locale,
      local.min,
      local.max
    );

    if (row) {
      setStartDate(row.startDate);
      focusCell(row.focusedDate);
    }
  };

  const focusSectionStart = () => {
    const section = getSectionStart(
      focusedDate()!,
      startDate(),
      local.visibleDuration!,
      local.locale,
      local.min,
      local.max
    );

    if (section) {
      setStartDate(section.startDate);
      focusCell(section.focusedDate);
    }
  };

  const focusSectionEnd = () => {
    const section = getSectionEnd(
      focusedDate()!,
      startDate(),
      local.visibleDuration!,
      local.locale,
      local.min,
      local.max
    );

    if (section) {
      setStartDate(section.startDate);
      focusCell(section.focusedDate);
    }
  };

  const focusNextSection = (larger: boolean) => {
    const section = getNextSection(
      focusedDate()!,
      startDate(),
      larger,
      local.visibleDuration!,
      local.locale,
      local.min,
      local.max
    );

    if (section) {
      setStartDate(section.startDate);
      focusCell(section.focusedDate);
    }
  };

  const focusPreviousSection = (larger: boolean) => {
    const section = getPreviousSection(
      focusedDate()!,
      startDate(),
      larger,
      local.visibleDuration!,
      local.locale,
      local.min,
      local.max
    );

    if (section) {
      setStartDate(section.startDate);
      focusCell(section.focusedDate);
    }
  };

  const getDatesInWeek = (weekIndex: number, from: DateValue) => {
    let date = from.add({ weeks: weekIndex });
    const dates = [];

    date = startOfWeek(date, local.locale);

    // startOfWeek will clamp dates within the calendar system's valid range, which may
    // start in the middle of a week. In this case, add null placeholders.
    const dayOfWeek = getDayOfWeek(date, local.locale);
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
  };

  // Reset focused date and visible range when calendar changes.
  let lastCalendarIdentifier = calendar().identifier;

  createEffect(
    on(calendar, calendar => {
      if (calendar.identifier !== lastCalendarIdentifier) {
        const newFocusedDate = toCalendar(focusedDate()!, calendar);

        setStartDate(
          alignCenter(newFocusedDate, local.visibleDuration!, local.locale, local.min, local.max)
        );

        setFocusedDate(newFocusedDate);

        lastCalendarIdentifier = calendar.identifier;
      }
    })
  );

  createEffect(() => {
    const adjust = getAdjustedDateFn(local.visibleDuration!, local.locale, local.min, local.max);

    const adjustment = adjust({
      startDate: startDate(),
      focusedDate: focusedDate()!,
    });

    setStartDate(adjustment.startDate);
    setFocusedDate(adjustment.focusedDate);
  });

  // Announce when the visible date range changes only when pressing the Previous or Next triggers.
  createEffect(() => {
    if (!isFocused()) {
      announce(visibleRangeDescription());
    }
  });

  // Announce when the selected value changes
  createEffect(() => {
    const description = getSelectedDateDescription(messageFormatter(), value(), timeZone());

    if (description) {
      announce(description, "polite", 4000);
    }
  });

  const dataset: Accessor<CalendarDataSet> = createMemo(() => ({}));

  const context: CalendarContextValue = {
    dataset,
    value,
    isDisabled: () => local.disabled ?? false,
    isReadOnly: () => local.readOnly ?? false,
    isCellUnavailable,
    isCellDisabled,
    isCellSelected,
    isCellFocused,
    isDateInvalid,
    validationState,
    startDate,
    endDate,
    focusedDate: () => focusedDate()!,
    visibleDuration: () => local.visibleDuration!,
    selectionMode: () => local.selectionMode!,
    locale: () => local.locale,
    direction,
    min: () => local.min,
    max: () => local.max,
    timeZone,
    messageFormatter,
    setStartDate,
    setIsFocused,
    selectFocusedDate,
    selectDate,
    focusCell,
    focusNextDay,
    focusPreviousDay,
    focusNextPage,
    focusPreviousPage,
    focusNextRow,
    focusPreviousRow,
    focusSectionStart,
    focusSectionEnd,
    focusNextSection,
    focusPreviousSection,
    getDatesInWeek,
  };

  return (
    <CalendarContext.Provider value={context}>
      <Polymorphic as="div" role="group" aria-label={ariaLabel()} {...others} />
    </CalendarContext.Provider>
  );
}
