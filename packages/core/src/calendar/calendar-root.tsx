/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/15e101b74966bd5eb719c6529ce71ce57eaed430/packages/@react-aria/calendar/src/useCalendarBase.ts
 */

import { CalendarDate, getWeeksInMonth, startOfWeek, today } from "@internationalized/date";
import { createPolymorphicComponent, mergeDefaultProps } from "@kobalte/utils";
import { Accessor, createEffect, JSX, on, splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

import { createDateFormatter } from "../i18n";
import { announce } from "../live-announcer";
import { CalendarContext, CalendarContextValue } from "./calendar-context";
import { createSelectedDateDescription, createVisibleRangeDescription } from "./primitives";
import { CalendarState, RangeCalendarState } from "./types";

interface CalendarRootState {
  /** A description of the visible date range, for use in the calendar title. */
  title: Accessor<string>;

  /**
   * A list of week day abbreviations formatted for the current locale,
   * typically used in column headers.
   */
  weekDays: Accessor<string[]>;

  /**
   * The number of weeks in the currently displayed month.
   * Used render the proper number of rows in the calendar grid.
   */
  weeksInMonth: Accessor<number>;

  /** A function de retrieve the dates to render for a given week index. */
  getDatesInWeek: (weekIndex: number) => Array<CalendarDate | null>;
}

export interface CalendarRootOptions {
  /** The state of the calendar as returned by `createCalendarState` or `createRangeCalendarState`. */
  state: CalendarState | RangeCalendarState;

  /** Whether the calendar is disabled. */
  isDisabled?: boolean;

  /**
   * The children of the calendar.
   * It is a _render prop_ which give access to the internal state.
   */
  children?: (state: CalendarRootState) => JSX.Element;
}

export const CalendarRoot = createPolymorphicComponent<"div", CalendarRootOptions>(props => {
  props = mergeDefaultProps({ as: "div" }, props);

  const [local, others] = splitProps(props, [
    "as",
    "children",
    "state",
    "isDisabled",
    "aria-label",
    "aria-labelledby",
  ]);

  const dayFormatter = createDateFormatter(() => ({
    weekday: "narrow",
    timeZone: local.state.timeZone(),
  }));

  const weekDays = () => {
    const weekStart = startOfWeek(today(local.state.timeZone()), local.state.locale());

    return [...new Array(7).keys()].map(index => {
      const date = weekStart.add({ days: index });
      const dateDay = date.toDate(local.state.timeZone());
      return dayFormatter().format(dateDay);
    });
  };

  const weeksInMonth = () => {
    return getWeeksInMonth(local.state.visibleRange().start, local.state.locale());
  };

  const title = createVisibleRangeDescription({
    startDate: () => local.state.visibleRange().start,
    endDate: () => local.state.visibleRange().end,
    timeZone: () => local.state.timeZone(),
    isAria: () => false,
  });

  const visibleRangeDescription = createVisibleRangeDescription({
    startDate: () => local.state.visibleRange().start,
    endDate: () => local.state.visibleRange().end,
    timeZone: () => local.state.timeZone(),
    isAria: () => true,
  });

  const selectedDateDescription = createSelectedDateDescription(local.state);

  let isNextFocused = false;
  const isNextDisabled = () => local.isDisabled || local.state.isNextVisibleRangeInvalid();

  let isPreviousFocused = false;
  const isPreviousDisabled = () => local.isDisabled || local.state.isPreviousVisibleRangeInvalid();

  // Announce when the visible date range changes.
  createEffect(
    on(
      visibleRangeDescription,
      visibleRangeDescription => {
        // Only when pressing the Previous or Next button.
        if (!local.state.isFocused()) {
          announce(visibleRangeDescription);
        }
      },
      { defer: true }
    )
  );

  // Announce when the selected value changes,
  // handle an update to the caption that describes the currently selected range, to announce the new value
  createEffect(
    on(
      selectedDateDescription,
      selectedDateDescription => {
        if (selectedDateDescription) {
          announce(selectedDateDescription, "polite", 4000);
        }
      },
      { defer: true }
    )
  );

  // If the next or previous buttons become disabled while they are focused, move focus to the calendar body.
  createEffect(() => {
    if (isNextDisabled() && isNextFocused) {
      isNextFocused = false;
      local.state.setFocused(true);
    }

    if (isPreviousDisabled() && isPreviousFocused) {
      isPreviousFocused = false;
      local.state.setFocused(true);
    }
  });

  const context: CalendarContextValue = {
    calendarState: () => local.state,
    selectedDateDescription,
    isPreviousDisabled,
    isNextDisabled,
    ariaLabel: () => local["aria-label"],
    ariaLabelledBy: () => local["aria-labelledby"],
    setPreviousFocused: newValue => (isPreviousFocused = newValue),
    setNextFocused: newValue => (isNextFocused = newValue),
  };

  return (
    <CalendarContext.Provider value={context}>
      <Dynamic
        component={local.as}
        role="group"
        aria-label={[local["aria-label"], visibleRangeDescription()].filter(Boolean).join(", ")}
        aria-labelledby={local["aria-labelledby"]}
        {...others}
      >
        {local.children?.({
          title,
          weekDays,
          weeksInMonth,
          getDatesInWeek: weekIndex => local.state.getDatesInWeek(weekIndex),
        })}
      </Dynamic>
    </CalendarContext.Provider>
  );
});
