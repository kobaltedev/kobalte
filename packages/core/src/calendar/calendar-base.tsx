/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/15e101b74966bd5eb719c6529ce71ce57eaed430/packages/@react-aria/calendar/src/useCalendarBase.ts
 */

import { createPolymorphicComponent, mergeDefaultProps, mergeRefs } from "@kobalte/utils";
import { createEffect, on, onMount, splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

import { announce } from "../live-announcer";
import { CalendarContext, CalendarContextValue } from "./calendar-context";
import { createSelectedDateDescription, createVisibleRangeDescription } from "./primitives";
import { CalendarState, RangeCalendarState } from "./types";

export interface CalendarBaseOptions {
  /** The state of the calendar as returned by `createCalendarState` or `createRangeCalendarState`. */
  state: CalendarState | RangeCalendarState;

  /** Whether the calendar is disabled. */
  isDisabled?: boolean;

  /** Whether dates outside each calendar month should not be visible. */
  hideDatesOutsideMonth?: boolean;
}

/**
 * Base component for a calendar, provide context for its children.
 * Used to build calendar and range calendar.
 */
export const CalendarBase = createPolymorphicComponent<"div", CalendarBaseOptions>(props => {
  let ref: HTMLDivElement | undefined;

  props = mergeDefaultProps({ as: "div" }, props);

  const [local, others] = splitProps(props, [
    "as",
    "ref",
    "state",
    "isDisabled",
    "hideDatesOutsideMonth",
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

  onMount(() => {
    if (ref) {
      local.state.setCalendarRef(ref);
    }
  });

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
      {
        defer: true,
      }
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
      {
        defer: true,
      }
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
    hideDatesOutsideMonth: () => local.hideDatesOutsideMonth ?? false,
    ariaLabel: () => local["aria-label"],
    ariaLabelledBy: () => local["aria-labelledby"],
    setPreviousFocused: newValue => (isPreviousFocused = newValue),
    setNextFocused: newValue => (isNextFocused = newValue),
  };

  return (
    <CalendarContext.Provider value={context}>
      <Dynamic
        component={local.as}
        ref={mergeRefs(el => (ref = el), local.ref)}
        role="group"
        aria-label={[local["aria-label"], visibleRangeDescription()].filter(Boolean).join(", ")}
        aria-labelledby={local["aria-labelledby"]}
        {...others}
      />
    </CalendarContext.Provider>
  );
});
