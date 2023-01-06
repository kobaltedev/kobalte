/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/bb9f65fc853474065a9de9ed6f5f471c16689237/packages/@react-aria/calendar/src/useCalendarCell.ts
 */

import { CalendarDate, isSameDay, isToday } from "@internationalized/date";
import { createPolymorphicComponent, mergeDefaultProps } from "@kobalte/utils";
import { createMemo, onCleanup, Show, splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

import { createDateFormatter, createLocalizedStringFormatter } from "../i18n";
import { CALENDAR_INTL_MESSAGES } from "./calendar.intl";
import { CalendarCellContext, CalendarCellContextValue } from "./calendar-cell-context";
import { useCalendarContext } from "./calendar-context";
import { getEraFormat } from "./utils";

interface CalendarCellBaseOptions {
  date: CalendarDate;
  isDisabled?: boolean;
}

const CalendarCellBase = createPolymorphicComponent<"td", CalendarCellBaseOptions>(props => {
  const calendarContext = useCalendarContext();

  props = mergeDefaultProps({ as: "td" }, props);

  const [local, others] = splitProps(props, ["as", "date", "isDisabled"]);

  const state = () => calendarContext.calendarState();

  const stringFormatter = createLocalizedStringFormatter(() => CALENDAR_INTL_MESSAGES);

  const dateFormatter = createDateFormatter(() => ({
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    era: getEraFormat(local.date),
    timeZone: state().timeZone(),
  }));

  const isInvalid = () => {
    const state = calendarContext.calendarState();

    const isInvalid = state.validationState() === "invalid";

    if ("highlightedRange" in state) {
      const highlightedRange = state.highlightedRange();

      return (
        isInvalid &&
        !state.anchorDate() &&
        highlightedRange &&
        local.date.compare(highlightedRange.start) >= 0 &&
        local.date.compare(highlightedRange.end) <= 0
      );
    }

    const value = state.value();

    return isInvalid && value != null && isSameDay(value, local.date);
  };

  const isSelected = () => isInvalid() || state().isSelected(local.date);

  const isFocused = () => state().isCellFocused(local.date);

  const isDisabled = () => local.isDisabled || state().isCellDisabled(local.date);

  const isUnavailable = () => state().isCellUnavailable(local.date);

  const isSelectable = () => !isDisabled() && !isUnavailable();

  const isOutsideVisibleRange = () => {
    return (
      local.date.compare(state().visibleRange().start) < 0 ||
      local.date.compare(state().visibleRange().end) > 0
    );
  };

  const nativeDate = createMemo(() => local.date.toDate(state().timeZone()));

  // aria-label should be localized Day of week, Month, Day and Year without Time.
  const label = createMemo(() => {
    const state = calendarContext.calendarState();

    let label = "";

    // If this is a range calendar, add a description of the full selected range
    // to the first and last selected date.
    if ("highlightedRange" in state) {
      const value = state.value();

      if (
        value &&
        !state.anchorDate() &&
        (isSameDay(local.date, value.start) || isSameDay(local.date, value.end))
      ) {
        label = calendarContext.selectedDateDescription() + ", ";
      }
    }

    label += dateFormatter().format(nativeDate());

    if (isToday(local.date, state.timeZone())) {
      // If date is today, set appropriate string depending on selected state:
      label = stringFormatter().format(isSelected() ? "todayDateSelected" : "todayDate", {
        date: label,
      });
    } else if (isSelected()) {
      // If date is selected but not today:
      label = stringFormatter().format("dateSelected", {
        date: label,
      });
    }

    const minValue = state.minValue();
    const maxValue = state.maxValue();

    if (minValue && isSameDay(local.date, minValue)) {
      label += ", " + stringFormatter().format("minimumDate");
    } else if (maxValue && isSameDay(local.date, maxValue)) {
      label += ", " + stringFormatter().format("maximumDate");
    }

    return label;
  });

  // TODO: need react-aria `useDescription`
  /*
  // When a cell is focused and this is a range calendar, add a prompt to help
  // screenreader users know that they are in a range selection mode.
  let rangeSelectionPrompt = "";
  if ("anchorDate" in state && isFocused && !state.isReadOnly && isSelectable) {
    // If selection has started add "click to finish selecting range"
    if (state.anchorDate) {
      rangeSelectionPrompt = stringFormatter.format("finishRangeSelectionPrompt");
      // Otherwise, add "click to start selecting range" prompt
    } else {
      rangeSelectionPrompt = stringFormatter.format("startRangeSelectionPrompt");
    }
  }

  let descriptionProps = useDescription(rangeSelectionPrompt);
  */

  const cellDateFormatter = createDateFormatter(() => ({
    day: "numeric",
    timeZone: state().timeZone(),
    calendar: local.date.calendar.identifier,
  }));

  const formattedDate = createMemo(() => cellDateFormatter().format(nativeDate()));

  const context: CalendarCellContextValue = {
    isSelectable,
    isDisabled,
    isUnavailable,
    isOutsideVisibleRange,
    isSelected,
    isInvalid,
    isFocused,
    date: () => local.date,
    formattedDate,
    label,
  };

  return (
    <CalendarCellContext.Provider value={context}>
      <Dynamic
        component={local.as}
        role="gridcell"
        aria-disabled={!isSelectable() || undefined}
        aria-selected={isSelected() || undefined}
        aria-invalid={isInvalid() || undefined}
        data-disabled={!isSelectable() ? "" : undefined}
        data-selected={isSelected() ? "" : undefined}
        data-invalid={isInvalid() ? "" : undefined}
        {...others}
      />
    </CalendarCellContext.Provider>
  );
});

export interface CalendarCellOptions {
  /** The date that this cell represents. */
  date?: CalendarDate | null;

  /**
   * Whether the cell is disabled. By default, this is determined by the
   * Calendar's `minValue`, `maxValue`, and `isDisabled` props.
   */
  isDisabled?: boolean;
}

/**
 * Displays a date cell within a calendar grid which can be selected by the user.
 */
export const CalendarCell = createPolymorphicComponent<"td", CalendarCellOptions>(props => {
  const [local, others] = splitProps(props, ["as", "date", "isDisabled"]);

  return (
    <Show when={local.date} fallback={<td {...others} />}>
      <CalendarCellBase date={local.date!} isDisabled={local.isDisabled} {...others} />
    </Show>
  );
});
