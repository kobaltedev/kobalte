/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/bb9f65fc853474065a9de9ed6f5f471c16689237/packages/@react-aria/calendar/src/useCalendarGrid.ts
 */

import { CalendarDate } from "@internationalized/date";
import {
  callHandler,
  contains,
  createPolymorphicComponent,
  mergeDefaultProps,
  mergeRefs,
} from "@kobalte/utils";
import { createEffect, JSX, splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

import { useLocale } from "../i18n";
import { useCalendarContext } from "./calendar-context";
import { createVisibleRangeDescription } from "./primitives";

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
  let ref: HTMLTableElement | undefined;

  const context = useCalendarContext();

  props = mergeDefaultProps({ as: "table" }, props);

  const [local, others] = splitProps(props, [
    "as",
    "ref",
    "startDate",
    "endDate",
    "onKeyDown",
    "onFocusIn",
    "onFocusOut",
  ]);

  const { direction } = useLocale();

  const startDate = () => local.startDate ?? context.calendarState().visibleRange().start;
  const endDate = () => local.endDate ?? context.calendarState().visibleRange().end;

  const visibleRangeDescription = createVisibleRangeDescription({
    startDate,
    endDate,
    timeZone: () => context.calendarState().timeZone(),
    isAria: () => true,
  });

  const onKeyDown: JSX.EventHandlerUnion<any, KeyboardEvent> = e => {
    callHandler(e, local.onKeyDown);

    const state = context.calendarState();

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
    context.calendarState().setFocused(true);
  };

  const onFocusOut: JSX.EventHandlerUnion<any, FocusEvent> = e => {
    callHandler(e, local.onFocusOut);

    // Focus events bubble through portals. We only care about blur in this grid.
    if (!contains(ref, e.target)) {
      return;
    }

    const relatedTarget = e.relatedTarget as HTMLElement | null;

    if (relatedTarget && !contains(ref, relatedTarget)) {
      context.calendarState().setFocused(false);
    }
  };

  return (
    <Dynamic
      component={local.as}
      ref={mergeRefs(el => (ref = el), local.ref)}
      role="grid"
      aria-readonly={context.calendarState().isReadOnly() || undefined}
      aria-disabled={context.calendarState().isDisabled() || undefined}
      aria-multiselectable={"highlightedRange" in context.calendarState() || undefined}
      aria-label={[context.ariaLabel(), visibleRangeDescription()].filter(Boolean).join(", ")}
      aria-labelledby={context.ariaLabelledBy()}
      onKeyDown={onKeyDown}
      onFocusIn={onFocusIn}
      onFocusOut={onFocusOut}
      {...others}
    />
  );
});
