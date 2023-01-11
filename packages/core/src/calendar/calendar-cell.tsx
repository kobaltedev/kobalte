/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/bb9f65fc853474065a9de9ed6f5f471c16689237/packages/@react-aria/calendar/src/useCalendarCell.ts
 */

import { CalendarDate, isSameDay, isToday } from "@internationalized/date";
import { createPolymorphicComponent, mergeDefaultProps } from "@kobalte/utils";
import { createMemo, Show, splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

import { createDateFormatter, createLocalizedStringFormatter } from "../i18n";
import { CALENDAR_INTL_MESSAGES } from "./calendar.intl";
import { CalendarCellContext, CalendarCellContextValue } from "./calendar-cell-context";
import { useCalendarContext } from "./calendar-context";
import { getEraFormat } from "./utils";

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
 * The wrapper component for a `Calendar.Day`.
 */
export const CalendarCell = createPolymorphicComponent<"td", CalendarCellOptions>(props => {
  const [local, others] = splitProps(props, ["as", "date", "isDisabled"]);

  return (
    <Show when={local.date} fallback={<td />}>
      <CalendarCellBase date={local.date!} isDisabled={local.isDisabled} {...others} />
    </Show>
  );
});

interface CalendarCellBaseOptions {
  date: CalendarDate;
  isDisabled?: boolean;
}

const CalendarCellBase = createPolymorphicComponent<"td", CalendarCellBaseOptions>(props => {
  const calendarContext = useCalendarContext();

  props = mergeDefaultProps({ as: "td" }, props);

  const [local, others] = splitProps(props, ["as", "date", "isDisabled"]);

  const state = () => calendarContext.state();

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
    const state = calendarContext.state();

    const isInvalid = state.validationState() === "invalid";

    if ("highlightedRange" in state) {
      const highlightedRange = state.highlightedRange();

      return (
        isInvalid &&
        !state.anchorDate() &&
        highlightedRange != null &&
        local.date.compare(highlightedRange.start) >= 0 &&
        local.date.compare(highlightedRange.end) <= 0
      );
    }

    const value = state.value();

    return isInvalid && value != null && isSameDay(value, local.date);
  };

  const isSelected = () => isInvalid() || state().isSelected(local.date);
  const isDisabled = () => local.isDisabled || state().isCellDisabled(local.date);
  const isUnavailable = () => state().isCellUnavailable(local.date);
  const isSelectable = () => !isDisabled() && !isUnavailable();

  // aria-label should be localized Day of week, Month, Day and Year without Time.
  const label = createMemo(() => {
    const state = calendarContext.state();

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

    const nativeDate = local.date.toDate(state.timeZone());

    label += dateFormatter().format(nativeDate);

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

  const context: CalendarCellContextValue = {
    isSelectable,
    isDisabled,
    isUnavailable,
    isSelected,
    isInvalid,
    date: () => local.date,
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
        {...others}
      />
    </CalendarCellContext.Provider>
  );
});
