/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/0a1d0cd4e1b2f77eed7c0ea08fce8a04f8de6921/packages/@react-aria/calendar/src/useCalendarGrid.ts
 */

import { startOfWeek, today } from "@internationalized/date";
import { callHandler, mergeDefaultProps, OverrideComponentProps } from "@kobalte/utils";
import { createMemo, JSX, splitProps } from "solid-js";

import { createDateFormatter } from "../i18n";
import { Polymorphic } from "../polymorphic";
import { useCalendarContext } from "./calendar-context";
import { CalendarGridContext, CalendarGridContextValue } from "./calendar-grid-context";
import { DateValue } from "./types";
import { getVisibleRangeDescription } from "./utils";

export interface CalendarGridOptions {
  /**
   * The first date displayed in the calendar grid.
   * Defaults to the first visible date in the calendar.
   * Override this to display multiple date grids in a calendar.
   */
  startDate?: DateValue;

  /**
   * The last date displayed in the calendar grid.
   * Defaults to the last visible date in the calendar.
   * Override this to display multiple date grids in a calendar.
   */
  endDate?: DateValue;

  /** The format in which to display the week days inside the `Calendar.GridHeader`. */
  weekDayFormat?: "narrow" | "short" | "long";
}

export type CalendarGridProps = OverrideComponentProps<"table", CalendarGridOptions>;

/**
 * A calendar grid displays a single grid of days within a calendar or range calendar which
 * can be keyboard navigated and selected by the user.
 */
export function CalendarGrid(props: CalendarGridProps) {
  const rootContext = useCalendarContext();

  props = mergeDefaultProps(
    {
      weekDayFormat: "narrow",
    },
    props
  );

  const [local, others] = splitProps(props, [
    "startDate",
    "endDate",
    "weekDayFormat",
    "onKeyDown",
    "onFocusIn",
    "onFocusOut",
    "aria-label",
  ]);

  const startDate = () => local.startDate ?? rootContext.startDate();
  const endDate = () => local.endDate ?? rootContext.endDate();

  const dayFormatter = createDateFormatter(() => ({
    weekday: local.weekDayFormat,
    timeZone: rootContext.timeZone(),
  }));

  const weekDays = createMemo(() => {
    const firstDayOfWeek = startOfWeek(today(rootContext.timeZone()), rootContext.locale());

    return [...new Array(7).keys()].map(index => {
      const date = firstDayOfWeek.add({ days: index });
      return dayFormatter().format(date.toDate(rootContext.timeZone()));
    });
  });

  const visibleRangeDescription = createMemo(() => {
    return getVisibleRangeDescription(
      rootContext.messageFormatter(),
      startDate(),
      endDate(),
      rootContext.timeZone(),
      true
    );
  });

  const ariaLabel = () => {
    return [local["aria-label"], visibleRangeDescription()].filter(Boolean).join(", ");
  };

  const onKeyDown: JSX.EventHandlerUnion<HTMLTableElement, KeyboardEvent> = e => {
    callHandler(e, local.onKeyDown);

    switch (e.key) {
      case "Enter":
      case " ":
        e.preventDefault();
        rootContext.selectFocusedDate();
        break;
      case "PageUp":
        e.preventDefault();
        e.stopPropagation();
        rootContext.focusPreviousSection(e.shiftKey);
        break;
      case "PageDown":
        e.preventDefault();
        e.stopPropagation();
        rootContext.focusNextSection(e.shiftKey);
        break;
      case "End":
        e.preventDefault();
        e.stopPropagation();
        rootContext.focusSectionEnd();
        break;
      case "Home":
        e.preventDefault();
        e.stopPropagation();
        rootContext.focusSectionStart();
        break;
      case "ArrowLeft":
        e.preventDefault();
        e.stopPropagation();
        if (rootContext.direction() === "rtl") {
          rootContext.focusNextDay();
        } else {
          rootContext.focusPreviousDay();
        }
        break;
      case "ArrowUp":
        e.preventDefault();
        e.stopPropagation();
        rootContext.focusPreviousRow();
        break;
      case "ArrowRight":
        e.preventDefault();
        e.stopPropagation();
        if (rootContext.direction() === "rtl") {
          rootContext.focusPreviousDay();
        } else {
          rootContext.focusNextDay();
        }
        break;
      case "ArrowDown":
        e.preventDefault();
        e.stopPropagation();
        rootContext.focusNextRow();
        break;
      case "Escape":
        // TODO: RangeCalendar mode: Cancel the selection.
        if (rootContext.selectionMode() === "range") {
          e.preventDefault();
          //state.setAnchorDate(null);
        }
        break;
    }
  };

  const onFocusIn: JSX.FocusEventHandlerUnion<HTMLTableElement, FocusEvent> = e => {
    callHandler(e, local.onFocusIn);

    rootContext.setIsFocused(true);
  };

  const onFocusOut: JSX.FocusEventHandlerUnion<HTMLTableElement, FocusEvent> = e => {
    callHandler(e, local.onFocusOut);

    rootContext.setIsFocused(false);
  };

  const context: CalendarGridContextValue = {
    startDate,
    weekDays,
  };

  return (
    <CalendarGridContext.Provider value={context}>
      <Polymorphic
        as="table"
        role="grid"
        aria-readonly={rootContext.isReadOnly()}
        aria-disabled={rootContext.isDisabled()}
        aria-multiselectable={rootContext.selectionMode() !== "single"}
        aria-label={ariaLabel()}
        onKeyDown={onKeyDown}
        onFocusIn={onFocusIn}
        onFocusOut={onFocusOut}
        {...others}
      />
    </CalendarGridContext.Provider>
  );
}
