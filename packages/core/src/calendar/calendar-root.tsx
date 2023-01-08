/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/15e101b74966bd5eb719c6529ce71ce57eaed430/packages/@react-aria/calendar/src/useCalendarBase.ts
 */

import { createPolymorphicComponent, mergeDefaultProps } from "@kobalte/utils";
import { createEffect, on, splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

import { announce } from "../live-announcer";
import { CalendarContext, CalendarContextValue } from "./calendar-context";
import { createSelectedDateDescription, createVisibleRangeDescription } from "./primitives";
import { CalendarState, RangeCalendarState } from "./types";

export interface CalendarRootOptions {
  /** The state of the calendar as returned by `createCalendarState` or `createRangeCalendarState`. */
  state: CalendarState | RangeCalendarState;

  /** Whether the calendar is disabled. */
  isDisabled?: boolean;
}

export const CalendarRoot = createPolymorphicComponent<"div", CalendarRootOptions>(props => {
  props = mergeDefaultProps({ as: "div" }, props);

  const [local, others] = splitProps(props, [
    "as",
    "state",
    "isDisabled",
    "aria-label",
    "aria-labelledby",
  ]);

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
    state: () => local.state,
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
      />
    </CalendarContext.Provider>
  );
});
