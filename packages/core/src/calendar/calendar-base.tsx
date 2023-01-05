/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/15e101b74966bd5eb719c6529ce71ce57eaed430/packages/@react-aria/calendar/src/useCalendarBase.ts
 */

import { CalendarDate } from "@internationalized/date";
import { createPolymorphicComponent, mergeDefaultProps, ValidationState } from "@kobalte/utils";
import { Accessor, createEffect, JSX, on, splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

import { announce } from "../live-announcer";
import { CalendarContext, CalendarContextValue } from "./calendar-context";
import { createSelectedDateDescription, createVisibleRangeDescription } from "./primitives";
import { CalendarState, DateValue, RangeCalendarState } from "./types";

interface CalendarBaseState {
  /** A description of the visible date range, for use in the calendar title. */
  title: Accessor<string>;
}

export interface CalendarBaseOptions {
  state: CalendarState | RangeCalendarState;

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

  /** The date that is focused when the calendar first mounts (uncountrolled). */
  defaultFocusedValue?: DateValue;

  /** Handler that is called when the focused date changes. */
  onFocusChange?: (date: CalendarDate) => void;

  /** Whether the current selection is valid or invalid according to application logic. */
  validationState?: ValidationState;

  children: (state: CalendarBaseState) => JSX.Element;
}

export const CalendarBase = createPolymorphicComponent<"div", CalendarBaseOptions>(props => {
  props = mergeDefaultProps({ as: "div" }, props);

  const [local, others] = splitProps(props, ["as", "children", "aria-label", "aria-labelledby"]);

  const title = createVisibleRangeDescription({
    startDate: () => props.state.visibleRange().start,
    endDate: () => props.state.visibleRange().end,
    timeZone: () => props.state.timeZone(),
    isAria: () => false,
  });

  const visibleRangeDescription = createVisibleRangeDescription({
    startDate: () => props.state.visibleRange().start,
    endDate: () => props.state.visibleRange().end,
    timeZone: () => props.state.timeZone(),
    isAria: () => true,
  });

  const selectedDateDescription = createSelectedDateDescription(props.state);

  let isNextFocused = false;
  const isNextDisabled = () => props.isDisabled || props.state.isNextVisibleRangeInvalid();

  let isPreviousFocused = false;
  const isPreviousDisabled = () => props.isDisabled || props.state.isPreviousVisibleRangeInvalid();

  // Announce when the visible date range changes.
  createEffect(
    on(
      visibleRangeDescription,
      visibleRangeDescription => {
        // Only when pressing the Previous or Next button.
        if (!props.state.isFocused()) {
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
      props.state.setFocused(true);
    }

    if (isPreviousDisabled() && isPreviousFocused) {
      isPreviousFocused = false;
      props.state.setFocused(true);
    }
  });

  const context: CalendarContextValue = {
    calendarState: () => props.state,
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
        {local.children({
          title,
        })}
      </Dynamic>
    </CalendarContext.Provider>
  );
});
