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
  CalendarDate,
  DateDuration,
  DateFormatter,
  GregorianCalendar,
  toCalendar,
  toCalendarDate,
  today,
} from "@internationalized/date";
import { mergeDefaultProps, OverrideComponentProps, ValidationState } from "@kobalte/utils";
import { Accessor, createEffect, createMemo, createSignal, on, splitProps } from "solid-js";

import { createMessageFormatter } from "../i18n";
import { announce } from "../live-announcer";
import { Polymorphic } from "../polymorphic";
import { createControllableSignal } from "../primitives";
import { CALENDAR_INTL_MESSAGES } from "./calendar.intl";
import { CalendarContext, CalendarContextValue, CalendarDataSet } from "./calendar-context";
import { DateAlignment, DateValue } from "./types";
import {
  alignCenter,
  alignDate,
  alignStartDate,
  constrainValue,
  getAdjustedDateFn,
  getEndDate,
  getPreviousAvailableDate,
  getSelectedDateDescription,
  getVisibleRangeDescription,
  isDateInvalid,
  isNextVisibleRangeInvalid,
  isPreviousVisibleRangeInvalid,
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

  /** The controlled selected date of the calendar. */
  value?: DateValue;

  /**
   * The date of the calendar that should be selected when initially rendered.
   * Useful when you do not need to control the state of the calendar.
   */
  defaultValue?: DateValue;

  /** Event handler called when the selected date changes. */
  onChange?: (value: DateValue) => void;

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
    },
    props
  );

  const [local, others] = splitProps(props, [
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
    "locale",
    "createCalendar",
    "visibleDuration",
    "selectionAlignment",
    "aria-label",
  ]);

  const messageFormatter = createMessageFormatter(() => CALENDAR_INTL_MESSAGES);

  const resolvedOptions = createMemo(() => {
    return new DateFormatter(local.locale).resolvedOptions();
  });

  const calendar = createMemo(() => {
    return local.createCalendar(resolvedOptions().calendar);
  });

  const [value, setControlledValue] = createControllableSignal({
    value: () => local.value,
    defaultValue: () => local.defaultValue,
    onChange: value => local.onChange?.(value),
  });

  const calendarDateValue = createMemo(() => {
    const resolvedValue = value();

    if (resolvedValue) {
      return toCalendar(toCalendarDate(resolvedValue), calendar());
    }

    return null;
  });

  const timeZone = createMemo(() => {
    const resolvedValue = value();

    if (resolvedValue && "timeZone" in resolvedValue) {
      return resolvedValue.timeZone;
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
        : calendarDateValue() || toCalendar(today(timeZone()), calendar()),
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

  const isDateUnavailable = createMemo(() => {
    const resolvedCalendarDateValue = calendarDateValue();

    if (!resolvedCalendarDateValue) {
      return false;
    }

    if (local.isDateUnavailable?.(resolvedCalendarDateValue)) {
      return true;
    }

    return isDateInvalid(resolvedCalendarDateValue, local.min, local.max);
  });

  const validationState = createMemo(() => {
    return local.validationState || (isDateUnavailable() ? "invalid" : null);
  });

  const title = createMemo(() => {
    return getVisibleRangeDescription(
      messageFormatter(),
      startDate(),
      endDate(),
      timeZone(),
      false
    );
  });

  const visibleRangeDescription = createMemo(() => {
    return getVisibleRangeDescription(messageFormatter(), startDate(), endDate(), timeZone(), true);
  });

  const selectedDateDescription = createMemo(() => {
    const resolvedValue = value();

    if (resolvedValue) {
      return getSelectedDateDescription(messageFormatter(), resolvedValue, timeZone());
    }
  });

  const ariaLabel = () => {
    return [local["aria-label"], visibleRangeDescription()].filter(Boolean).join(", ");
  };

  // Sets focus to a specific cell date.
  const focusCell = (date: CalendarDate) => {
    setFocusedDate(constrainValue(date, local.min, local.max));
  };

  const setValue = (date: CalendarDate) => {
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

    const resolvedValue = value();

    // The display calendar should not have any effect on the emitted value.
    // Emit dates in the same calendar as the original value, if any, otherwise gregorian.
    newValue = toCalendar(newValue, resolvedValue?.calendar || new GregorianCalendar());

    // Preserve time if the input value had one.
    if (resolvedValue && "hour" in resolvedValue) {
      setControlledValue(resolvedValue.set(newValue));
    } else {
      setControlledValue(newValue);
    }
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
    const resolvedDescription = selectedDateDescription();

    if (resolvedDescription) {
      announce(resolvedDescription, "polite", 4000);
    }
  });

  const dataset: Accessor<CalendarDataSet> = createMemo(() => ({}));

  const context: CalendarContextValue = {
    dataset,
    isDisabled: () => local.disabled ?? false,
    startDate,
    endDate,
    focusedDate: () => focusedDate()!,
    visibleDuration: () => local.visibleDuration!,
    locale: () => local.locale,
    min: () => local.min,
    max: () => local.max,
    messageFormatter,
    setFocusedDate,
    setStartDate,
    setIsFocused,
  };

  return (
    <CalendarContext.Provider value={context}>
      <Polymorphic as="div" role="group" aria-label={ariaLabel()} {...others} />
    </CalendarContext.Provider>
  );
}
