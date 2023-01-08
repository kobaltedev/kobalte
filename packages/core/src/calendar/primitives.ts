/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/15e101b74966bd5eb719c6529ce71ce57eaed430/packages/@react-aria/calendar/src/utils.ts
 */

import { CalendarDate, endOfMonth, isSameDay, startOfMonth } from "@internationalized/date";
import { Accessor, createMemo } from "solid-js";

import { createDateFormatter, createLocalizedStringFormatter } from "../i18n";
import { CALENDAR_INTL_MESSAGES } from "./calendar.intl";
import { CalendarState, RangeCalendarState } from "./types";
import { formatRange, getEraFormat } from "./utils";

export function createSelectedDateDescription(state: CalendarState | RangeCalendarState) {
  const stringFormatter = createLocalizedStringFormatter(() => CALENDAR_INTL_MESSAGES);

  const start = () => {
    if ("highlightedRange" in state) {
      return state.highlightedRange().start;
    } else {
      return state.value();
    }
  };

  const end = () => {
    if ("highlightedRange" in state) {
      return state.highlightedRange().end;
    } else {
      return state.value();
    }
  };

  const dateFormatter = createDateFormatter(() => {
    const startDate = start();
    const endDate = end();

    let era = startDate ? getEraFormat(startDate) : undefined;

    if (era == null && endDate != null) {
      era = getEraFormat(endDate);
    }

    return {
      weekday: "long",
      month: "long",
      year: "numeric",
      day: "numeric",
      era,
      timeZone: state.timeZone(),
    };
  });

  const anchorDate = () => ("anchorDate" in state ? state.anchorDate() : null);

  return createMemo(() => {
    const startDate = start();
    const endDate = end();

    // No message if currently selecting a range, or there is nothing highlighted.
    if (!anchorDate() && startDate && endDate) {
      // Use a single date message if the start and end dates are the same day,
      // otherwise include both dates.
      if (isSameDay(startDate, endDate)) {
        const date = dateFormatter().format(startDate.toDate(state.timeZone()));
        return stringFormatter().format("selectedDateDescription", { date });
      } else {
        const dateRange = formatRange(
          dateFormatter(),
          stringFormatter(),
          startDate,
          endDate,
          state.timeZone()
        );

        return stringFormatter().format("selectedRangeDescription", { dateRange });
      }
    }

    return "";
  });
}

interface CreateVisibleRangeDescriptionProps {
  startDate: Accessor<CalendarDate>;
  endDate: Accessor<CalendarDate>;
  timeZone: Accessor<string>;
  isAria: Accessor<boolean>;
}

export function createVisibleRangeDescription(props: CreateVisibleRangeDescriptionProps) {
  const stringFormatter = createLocalizedStringFormatter(() => CALENDAR_INTL_MESSAGES);

  const era: Accessor<any> = () => {
    return getEraFormat(props.startDate()) || getEraFormat(props.endDate());
  };

  const monthFormatter = createDateFormatter(() => ({
    month: "long",
    year: "numeric",
    era: era(),
    calendar: props.startDate().calendar.identifier,
    timeZone: props.timeZone(),
  }));

  const dateFormatter = createDateFormatter(() => ({
    month: "long",
    year: "numeric",
    day: "numeric",
    era: era(),
    calendar: props.startDate().calendar.identifier,
    timeZone: props.timeZone(),
  }));

  return createMemo(() => {
    // Special case for month granularity. Format as a single month if only a
    // single month is visible, otherwise format as a range of months.
    if (isSameDay(props.startDate(), startOfMonth(props.startDate()))) {
      if (isSameDay(props.endDate(), endOfMonth(props.startDate()))) {
        return monthFormatter().format(props.startDate().toDate(props.timeZone()));
      } else if (isSameDay(props.endDate(), endOfMonth(props.endDate()))) {
        if (props.isAria()) {
          return formatRange(
            monthFormatter(),
            stringFormatter(),
            props.startDate(),
            props.endDate(),
            props.timeZone()
          );
        } else {
          return monthFormatter().formatRange(
            props.startDate().toDate(props.timeZone()),
            props.endDate().toDate(props.timeZone())
          );
        }
      }
    }

    if (props.isAria()) {
      return formatRange(
        dateFormatter(),
        stringFormatter(),
        props.startDate(),
        props.endDate(),
        props.timeZone()
      );
    } else {
      return dateFormatter().formatRange(
        props.startDate().toDate(props.timeZone()),
        props.endDate().toDate(props.timeZone())
      );
    }
  });
}
