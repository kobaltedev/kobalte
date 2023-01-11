/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/15e101b74966bd5eb719c6529ce71ce57eaed430/packages/@react-aria/calendar/src/useCalendar.ts
 * https://github.com/adobe/react-spectrum/blob/15e101b74966bd5eb719c6529ce71ce57eaed430/packages/@react-stately/calendar/src/useCalendarState.ts
 */

import { access, createPolymorphicComponent } from "@kobalte/utils";
import { splitProps } from "solid-js";

import { CalendarRoot, CalendarRootOptions } from "./calendar-root";
import { createCalendarState, CreateCalendarStateProps } from "./create-calendar-state";

export interface CalendarSingleOptions
  extends CreateCalendarStateProps,
    Pick<CalendarRootOptions, "hideDatesOutsideMonth"> {}

/**
 * Displays one or more date grids and allows users to select a single date.
 */
export const CalendarSingle = createPolymorphicComponent<"div", CalendarSingleOptions>(props => {
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

  return <CalendarRoot state={state} isDisabled={access(calendarProps.isDisabled)} {...others} />;
});
