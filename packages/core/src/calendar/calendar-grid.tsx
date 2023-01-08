/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/bb9f65fc853474065a9de9ed6f5f471c16689237/packages/@react-aria/calendar/src/useCalendarGrid.ts
 */

import { CalendarDate } from "@internationalized/date";
import { callHandler, createPolymorphicComponent, mergeDefaultProps } from "@kobalte/utils";
import { JSX, splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

import { useLocale } from "../i18n";
import { useCalendarContext } from "./calendar-context";
import { createVisibleRangeDescription } from "./primitives";
import { CalendarGridContext, CalendarGridContextValue } from "./calendar-grid-context";

export interface CalendarGridOptions {
  /**
   * The first date displayed in the calendar grid.
   * Defaults to the first visible date in the calendar.
   * Override this to display multiple date grids in a calendar.
   */
  startDate?: CalendarDate;

  /**
   * The last date displayed in the calendar grid.
   * Defaults to the last visible date in the calendar.
   * Override this to display multiple date grids in a calendar.
   */
  endDate?: CalendarDate;
}

/**
 * Displays a single grid of days within a calendar or range calendar which
 * can be navigated via keyboard and selected by the user.
 */
export const CalendarGrid = createPolymorphicComponent<"table", CalendarGridOptions>(props => {
  const calendarContext = useCalendarContext();

  props = mergeDefaultProps({ as: "table" }, props);

  const [local, others] = splitProps(props, [
    "as",
    "startDate",
    "endDate",
    "onKeyDown",
    "onFocusIn",
    "onFocusOut",
  ]);

  const { direction } = useLocale();

  const startDate = () => local.startDate ?? calendarContext.state().visibleRange().start;
  const endDate = () => local.endDate ?? calendarContext.state().visibleRange().end;

  const visibleRangeDescription = createVisibleRangeDescription({
    startDate,
    endDate,
    timeZone: () => calendarContext.state().timeZone(),
    isAria: () => true,
  });

  const onKeyDown: JSX.EventHandlerUnion<any, KeyboardEvent> = e => {
    callHandler(e, local.onKeyDown);

    const state = calendarContext.state();

    switch (e.key) {
      case "Enter":
      case " ":
        e.preventDefault();
        state.selectFocusedDate();
        break;
      case "PageUp":
        e.preventDefault();
        e.stopPropagation();
        state.focusPreviousSection(e.shiftKey);
        break;
      case "PageDown":
        e.preventDefault();
        e.stopPropagation();
        state.focusNextSection(e.shiftKey);
        break;
      case "End":
        e.preventDefault();
        e.stopPropagation();
        state.focusSectionEnd();
        break;
      case "Home":
        e.preventDefault();
        e.stopPropagation();
        state.focusSectionStart();
        break;
      case "ArrowLeft":
        e.preventDefault();
        e.stopPropagation();
        if (direction() === "rtl") {
          state.focusNextDay();
        } else {
          state.focusPreviousDay();
        }
        break;
      case "ArrowUp":
        e.preventDefault();
        e.stopPropagation();
        state.focusPreviousRow();
        break;
      case "ArrowRight":
        e.preventDefault();
        e.stopPropagation();
        if (direction() === "rtl") {
          state.focusPreviousDay();
        } else {
          state.focusNextDay();
        }
        break;
      case "ArrowDown":
        e.preventDefault();
        e.stopPropagation();
        state.focusNextRow();
        break;
      case "Escape":
        // Cancel the selection.
        if ("setAnchorDate" in state) {
          e.preventDefault();
          state.setAnchorDate(null);
        }
        break;
    }
  };

  const onFocusIn: JSX.EventHandlerUnion<any, FocusEvent> = e => {
    callHandler(e, local.onFocusIn);
    calendarContext.state().setFocused(true);
  };

  const onFocusOut: JSX.EventHandlerUnion<any, FocusEvent> = e => {
    callHandler(e, local.onFocusOut);
    calendarContext.state().setFocused(false);
  };

  const context: CalendarGridContextValue = {
    startDate,
  };

  return (
    <CalendarGridContext.Provider value={context}>
      <Dynamic
        component={local.as}
        role="grid"
        aria-readonly={calendarContext.state().isReadOnly() || undefined}
        aria-disabled={calendarContext.state().isDisabled() || undefined}
        aria-multiselectable={"highlightedRange" in calendarContext.state() || undefined}
        aria-label={[calendarContext.ariaLabel(), visibleRangeDescription()]
          .filter(Boolean)
          .join(", ")}
        aria-labelledby={calendarContext.ariaLabelledBy()}
        onKeyDown={onKeyDown}
        onFocusIn={onFocusIn}
        onFocusOut={onFocusOut}
        {...others}
      />
    </CalendarGridContext.Provider>
  );
});
