/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/15e101b74966bd5eb719c6529ce71ce57eaed430/packages/@react-stately/calendar/src/types.ts
 */

import { CalendarDate, CalendarDateTime, ZonedDateTime } from "@internationalized/date";
import { RangeValue, ValidationState } from "@kobalte/utils";
import { Accessor } from "solid-js";

export type DateValue = CalendarDate | CalendarDateTime | ZonedDateTime;

export type MappedDateValue<T> = T extends ZonedDateTime
  ? ZonedDateTime
  : T extends CalendarDateTime
  ? CalendarDateTime
  : T extends CalendarDate
  ? CalendarDate
  : never;

export type DateRange = RangeValue<DateValue>;

interface CalendarStateBase {
  /** Whether the calendar is disabled. */
  isDisabled: Accessor<boolean>;

  /** Whether the calendar is in a read only state. */
  isReadOnly: Accessor<boolean>;

  /** Whether focus is currently within the calendar. */
  isFocused: Accessor<boolean>;

  /** The date range that is currently visible in the calendar. */
  visibleRange: Accessor<RangeValue<CalendarDate>>;

  /** The minimum allowed date that a user may select. */
  minValue: Accessor<DateValue | undefined>;

  /** The maximum allowed date that a user may select. */
  maxValue: Accessor<DateValue | undefined>;

  /** The locale to display and edit the value according to. */
  locale: Accessor<string>;

  /** The time zone of the dates currently being displayed. */
  timeZone: Accessor<string>;

  /** The current validation state of the selected value. */
  validationState: Accessor<ValidationState | undefined>;

  /** The currently focused date. */
  focusedDate: Accessor<CalendarDate>;

  /** Sets the focused date. */
  setFocusedDate: (value: CalendarDate) => void;

  /** Moves focus to the next calendar date. */
  focusNextDay: () => void;

  /** Moves focus to the previous calendar date. */
  focusPreviousDay: () => void;

  /** Moves focus to the next row of dates, e.g. the next week. */
  focusNextRow: () => void;

  /** Moves focus to the previous row of dates, e.g. the previous work. */
  focusPreviousRow: () => void;

  /** Moves focus to the next page of dates, e.g. the next month if one month is visible. */
  focusNextPage: () => void;

  /** Moves focus to the previous page of dates, e.g. the previous month if one month is visible. */
  focusPreviousPage: () => void;

  /** Moves focus to one year after the current page of dates, e.g. the month + 1 year if one month is visible. */
  focusNextYear: () => void;

  /** Moves focus to one year before the current page of dates, e.g. the month - 1 year if one month is visible. */
  focusPreviousYear: () => void;

  /** Moves focus to the start of the current section of dates, e.g. the start of the current month. */
  focusSectionStart: () => void;

  /** Moves focus to the end of the current section of dates, e.g. the end of the current month. */
  focusSectionEnd: () => void;

  /**
   * Moves focus to the next section of dates based on what is currently displayed.
   * By default, focus is moved by one of the currently displayed unit. For example, if
   * one or more months are displayed, then focus is moved forward by one month.
   * If the `larger` option is `true`, the focus is moved by the next larger unit than
   * the one displayed. For example, if months are displayed, then focus moves to the next year.
   */
  focusNextSection: (larger?: boolean) => void;

  /**
   * Moves focus to the previous section of dates based on what is currently displayed.
   * By default, focus is moved by one of the currently displayed unit. For example, if
   * one or more months are displayed, then focus is moved backward by one month.
   * If the `larger` option is `true`, the focus is moved by the next larger unit than
   * the one displayed. For example, if months are displayed, then focus moves to the previous year.
   */
  focusPreviousSection: (larger?: boolean) => void;

  /** Selects the currently focused date. */
  selectFocusedDate: () => void;

  /** Selects the given date. */
  selectDate: (date: CalendarDate) => void;

  /** Sets whether focus is currently within the calendar. */
  setFocused: (value: boolean) => void;

  /** Returns whether the given date is invalid according to the `minValue` and `maxValue` props. */
  isInvalid: (date: CalendarDate) => boolean;

  /** Returns whether the given date is currently selected. */
  isSelected: (date: CalendarDate) => boolean;

  /** Returns whether the given date is currently focused. */
  isCellFocused: (date: CalendarDate) => boolean;

  /** Returns whether the given date is disabled according to the `minValue, `maxValue`, and `isDisabled` props. */
  isCellDisabled: (date: CalendarDate) => boolean;

  /** Returns whether the given date is unavailable according to the `isDateUnavailable` prop. */
  isCellUnavailable: (date: CalendarDate) => boolean;

  /** Returns whether the previous visible date range is allowed to be selected according to the `minValue` prop. */
  isPreviousVisibleRangeInvalid: () => boolean;

  /** Returns whether the next visible date range is allowed to be selected according to the `maxValue` prop. */
  isNextVisibleRangeInvalid: () => boolean;

  /**
   * Returns an array of dates in the week index counted from the provided start date, or the first visible date if not given.
   * The returned array always has 7 elements, but may include null if the date does not exist according to the calendar system.
   */
  getDatesInWeek: (weekIndex: number, startDate?: CalendarDate) => Array<CalendarDate | null>;
}

export interface CalendarState extends CalendarStateBase {
  /** The currently selected date. */
  value: Accessor<CalendarDate | undefined>;

  /** Sets the currently selected date. */
  setValue: (value: CalendarDate) => void;
}

export interface RangeCalendarState extends CalendarStateBase {
  /** The currently selected date range. */
  value: Accessor<DateRange | undefined>;

  /** Sets the currently selected date range. */
  setValue: (value: DateRange) => void;

  /** The current anchor date that the user clicked on to begin range selection. */
  anchorDate: Accessor<CalendarDate | undefined>;

  /** Sets the anchor date that the user clicked on to begin range selection. */
  setAnchorDate: (date: CalendarDate | undefined) => void;

  /** The currently highlighted date range. */
  highlightedRange: Accessor<RangeValue<CalendarDate> | undefined>;

  /** Highlights the given date during selection, e.g. by hovering or dragging. */
  highlightDate: (date: CalendarDate) => void;

  /** Whether the user is currently dragging over the calendar. */
  isDragging: Accessor<boolean>;

  /** Sets whether the user is dragging over the calendar. */
  setDragging: (isDragging: boolean) => void;
}
