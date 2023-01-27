/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/15e101b74966bd5eb719c6529ce71ce57eaed430/packages/@react-aria/calendar/src/useCalendar.ts
 * https://github.com/adobe/react-spectrum/blob/15e101b74966bd5eb719c6529ce71ce57eaed430/packages/@react-stately/calendar/src/useCalendarState.ts
 */

import { Calendar, CalendarDate } from "@internationalized/date";
import { access, createPolymorphicComponent, ValidationState } from "@kobalte/utils";
import { splitProps } from "solid-js";

import { CalendarBase, CalendarBaseOptions } from "./calendar-base";
import { createCalendarState } from "./create-calendar-state";
import { DateValue, MappedDateValue } from "./types";

export interface CalendarRootOptions extends Pick<CalendarBaseOptions, "hideDatesOutsideMonth"> {
  /** The controlled selected date of the calendar. */
  value?: DateValue;

  /**
   * The selected date of the calendar when initially rendered.
   * Useful when you do not need to control the selected date.
   */
  defaultValue?: DateValue;

  /** Event handler called when the selected date changes. */
  onValueChange?: (selectedDate: MappedDateValue<DateValue>) => void;

  /** The locale to display and edit the value according to. */
  locale?: string;

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
  visibleMonths?: number;

  /** Determines how to align the initial selection relative to the visible date range. */
  selectionAlignment?: "start" | "center" | "end";

  /** The minimum allowed date that a user may select. */
  minValue?: DateValue;

  /** The maximum allowed date that a user may select. */
  maxValue?: DateValue;

  /** Callback that is called for each date of the calendar. If it returns true, then the date is unavailable. */
  isDateUnavailable?: (date: DateValue) => boolean;

  /** Whether the calendar is disabled. */
  isDisabled?: boolean;

  /** Whether the calendar value is immutable. */
  isReadOnly?: boolean;

  /** Whether to automatically focus the calendar when it mounts. */
  autoFocus?: boolean;

  /** Controls the currently focused date within the calendar. */
  focusedValue?: DateValue;

  /** The date that is focused when the calendar first mounts (uncontrolled). */
  defaultFocusedValue?: DateValue;

  /** Handler that is called when the focused date changes. */
  onFocusChange?: (date: CalendarDate) => void;

  /** Whether the current selection is valid or invalid according to application logic. */
  validationState?: ValidationState;
}

/**
 * Displays one or more date grids and allows users to select a single date.
 */
export const CalendarRoot = createPolymorphicComponent<"div", CalendarRootOptions>(props => {
  const [calendarProps, others] = splitProps(props, [
    "value",
    "defaultValue",
    "onValueChange",
    "locale",
    "createCalendar",
    "visibleMonths",
    "selectionAlignment",
    "minValue",
    "maxValue",
    "isDateUnavailable",
    "isDisabled",
    "isReadOnly",
    "autoFocus",
    "focusedValue",
    "defaultFocusedValue",
    "onFocusChange",
    "validationState",
  ]);

  const state = createCalendarState(calendarProps);

  return <CalendarBase state={state} isDisabled={access(calendarProps.isDisabled)} {...others} />;
});
