/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/bb9f65fc853474065a9de9ed6f5f471c16689237/packages/@react-aria/calendar/src/useCalendarCell.ts
 * https://github.com/adobe/react-spectrum/blob/73d8be4dd7ff1713084cfe3f602f11aef1cecb07/packages/@react-spectrum/calendar/src/CalendarCell.tsx
 */

import { getDayOfWeek, isSameDay, isSameMonth, isToday } from "@internationalized/date";
import {
  composeEventHandlers,
  createPolymorphicComponent,
  mergeDefaultProps,
  mergeRefs,
} from "@kobalte/utils";
import { createMemo, JSX, splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

import { createDateFormatter } from "../i18n";
import { createFocusRing, createHover, createPress } from "../primitives";
import { useCalendarCellContext } from "./calendar-cell-context";
import { useCalendarContext } from "./calendar-context";
import { useCalendarMonthContext } from "./calendar-month-context";

/**
 * A day of the `Calendar.Month` which can be selected by the user.
 */
export const CalendarDay = createPolymorphicComponent<"div">(props => {
  let ref: HTMLDivElement | undefined;

  const calendarContext = useCalendarContext();
  const monthContext = useCalendarMonthContext();
  const context = useCalendarCellContext();

  props = mergeDefaultProps({ as: "div" }, props);

  const [local, others] = splitProps(props, [
    "as",
    "ref",
    "onFocus",
    "onContextMenu",
    "onKeyDown",
    "onKeyUp",
    "onClick",
    "onPointerDown",
    "onPointerUp",
    "onMouseDown",
    "onDragStart",
    "onPointerEnter",
    "onPointerLeave",
    "onFocusIn",
    "onFocusOut",
  ]);

  const cellDateFormatter = createDateFormatter(() => ({
    day: "numeric",
    timeZone: calendarContext.state().timeZone(),
    calendar: context.date().calendar.identifier,
  }));

  const isLastSelectedBeforeDisabled = () => {
    const state = calendarContext.state();

    return (
      !context.isDisabled() &&
      !context.isInvalid() &&
      state.isCellUnavailable(context.date().add({ days: 1 }))
    );
  };

  const isFirstSelectedAfterDisabled = () => {
    const state = calendarContext.state();

    return (
      !context.isDisabled() &&
      !context.isInvalid() &&
      state.isCellUnavailable(context.date().subtract({ days: 1 }))
    );
  };

  const dayOfWeek = () => {
    return getDayOfWeek(context.date(), calendarContext.state().locale());
  };

  const isRangeStart = () => {
    return (
      context.isSelected() &&
      (isFirstSelectedAfterDisabled() || dayOfWeek() === 0 || context.date().day === 1)
    );
  };

  const isRangeEnd = () => {
    const currentMonth = calendarContext.state().visibleRange().start;

    return (
      context.isSelected() &&
      (isLastSelectedBeforeDisabled() ||
        dayOfWeek() === 6 ||
        context.date().day === currentMonth.calendar.getDaysInMonth(currentMonth))
    );
  };

  const isRangeSelection = () => {
    return context.isSelected() && "highlightedRange" in calendarContext.state();
  };

  const isSelectionStart = () => {
    const state = calendarContext.state();

    if ("highlightedRange" in state) {
      const highlightedRange = state.highlightedRange();

      return (
        context.isSelected() &&
        highlightedRange != null &&
        isSameDay(context.date(), highlightedRange.start)
      );
    }

    return false;
  };

  const isSelectionEnd = () => {
    const state = calendarContext.state();

    if ("highlightedRange" in state) {
      const highlightedRange = state.highlightedRange();

      return (
        context.isSelected() &&
        highlightedRange != null &&
        isSameDay(context.date(), highlightedRange.end)
      );
    }

    return false;
  };

  const isOutsideMonth = () => {
    return !isSameMonth(monthContext.startDate(), context.date());
  };

  const isFocused = () => {
    return calendarContext.state().isCellFocused(context.date());
  };

  const formattedDate = createMemo(() => {
    return cellDateFormatter().format(context.nativeDate());
  });

  const tabIndex = () => {
    if (context.isDisabled() || isOutsideMonth()) {
      return undefined;
    }

    const state = calendarContext.state();

    return isSameDay(context.date(), state.focusedDate()) ? 0 : -1;
  };

  let isAnchorPressed = false;
  let isRangeBoundaryPressed = false;
  let touchDragTimeoutId: number | null = null;

  const { isPressed, pressHandlers } = createPress({
    // When dragging to select a range, we don't want dragging over the original anchor
    // again to trigger onPressStart. Cancel presses immediately when the pointer exits.
    cancelOnPointerExit: () => {
      const state = calendarContext.state();
      return "anchorDate" in state && !!state.anchorDate();
    },
    preventFocusOnPress: true,
    isDisabled: () => !context.isSelectable(),
    onPressStart: e => {
      const state = calendarContext.state();

      if (state.isReadOnly()) {
        state.setFocusedDate(context.date());
        return;
      }

      if (
        "highlightedRange" in state &&
        !state.anchorDate() &&
        (e.pointerType === "mouse" || e.pointerType === "touch")
      ) {
        const highlightedRange = state.highlightedRange();

        // Allow dragging the start or end date of a range to modify it
        // rather than starting a new selection.
        // Don't allow dragging when invalid, or weird jumping behavior may occur as date ranges
        // are constrained to available dates. The user will need to select a new range in this case.
        if (highlightedRange != null && !context.isInvalid()) {
          if (isSameDay(context.date(), highlightedRange.start)) {
            state.setAnchorDate(highlightedRange.end);
            state.setFocusedDate(context.date());
            state.setDragging(true);
            isRangeBoundaryPressed = true;
            return;
          } else if (isSameDay(context.date(), highlightedRange.end)) {
            state.setAnchorDate(highlightedRange.start);
            state.setFocusedDate(context.date());
            state.setDragging(true);
            isRangeBoundaryPressed = true;
            return;
          }
        }

        const startDragging = () => {
          state.setDragging(true);
          touchDragTimeoutId = null;

          state.selectDate(context.date());
          state.setFocusedDate(context.date());
          isAnchorPressed = true;
        };

        // Start selection on mouse/touch down so users can drag to select a range.
        // On touch, delay dragging to determine if the user really meant to scroll.
        if (e.pointerType === "touch") {
          touchDragTimeoutId = window.setTimeout(startDragging, 200);
        } else {
          startDragging();
        }
      }
    },
    onPressEnd: () => {
      isRangeBoundaryPressed = false;
      isAnchorPressed = false;

      if (touchDragTimeoutId != null) {
        window.clearTimeout(touchDragTimeoutId);
      }

      touchDragTimeoutId = null;
    },
    onPress: () => {
      const state = calendarContext.state();

      // For non-range selection, always select on press up.
      if (!("anchorDate" in state) && !state.isReadOnly()) {
        state.selectDate(context.date());
        state.setFocusedDate(context.date());
      }
    },
    onPressUp: e => {
      const state = calendarContext.state();

      if (state.isReadOnly()) {
        return;
      }

      // If the user tapped quickly, the date won't be selected yet and the
      // timer will still be in progress. In this case, select the date on touch up.
      // Timer is cleared in onPressEnd.
      if ("anchorDate" in state && touchDragTimeoutId) {
        state.selectDate(context.date());
        state.setFocusedDate(context.date());
      }

      if ("anchorDate" in state) {
        if (isRangeBoundaryPressed) {
          // When clicking on the start or end date of an already selected range,
          // start a new selection on press up to also allow dragging the date to
          // change the existing range.
          state.setAnchorDate(context.date());
        } else if (state.anchorDate() && !isAnchorPressed) {
          // When releasing a drag or pressing the end date of a range, select it.
          state.selectDate(context.date());
          state.setFocusedDate(context.date());
        } else if (e.pointerType === "keyboard" && !state.anchorDate()) {
          // For range selection, auto-advance the focused date by one if using keyboard.
          // This gives an indication that you're selecting a range rather than a single date.
          // For mouse, this is unnecessary because users will see the indication on hover. For screen readers,
          // there will be an announcement to "click to finish selecting range" (above).
          state.selectDate(context.date());

          let nextDay = context.date().add({ days: 1 });

          if (state.isInvalid(nextDay)) {
            nextDay = context.date().subtract({ days: 1 });
          }

          if (!state.isInvalid(nextDay)) {
            state.setFocusedDate(nextDay);
          }
        } else if (e.pointerType === "virtual") {
          // For screen readers, just select the date on click.
          state.selectDate(context.date());
          state.setFocusedDate(context.date());
        }
      }
    },
  });

  const { isHovered, hoverHandlers } = createHover({
    isDisabled: () => !context.isSelectable(),
  });

  const { isFocusVisible, focusRingHandlers } = createFocusRing();

  const onFocus: JSX.EventHandlerUnion<any, FocusEvent> = e => {
    const state = calendarContext.state();

    if (!context.isDisabled()) {
      state.setFocusedDate(context.date());
    }
  };

  const onPointerEnter: JSX.EventHandlerUnion<any, PointerEvent> = e => {
    const state = calendarContext.state();

    // Highlight the date on hover or drag over a date when selecting a range.
    if (
      "highlightDate" in state &&
      (e.pointerType !== "touch" || state.isDragging()) &&
      context.isSelectable()
    ) {
      state.highlightDate(context.date());
    }
  };

  const onPointerDown: JSX.EventHandlerUnion<any, PointerEvent> = e => {
    // This is necessary on touch devices to allow dragging
    // outside the original pressed element.
    // (JSDOM does not support this)
    if ("releasePointerCapture" in e.target) {
      e.target.releasePointerCapture(e.pointerId);
    }
  };

  const onContextMenu: JSX.EventHandlerUnion<any, MouseEvent> = e => {
    // Prevent context menu on long press.
    e.preventDefault();
  };

  return (
    <Dynamic
      component={local.as}
      ref={mergeRefs(el => (ref = el), local.ref)}
      role="button"
      tabIndex={tabIndex()}
      children={formattedDate()}
      aria-label={context.label()}
      aria-disabled={!context.isSelectable() || undefined}
      data-date={context.date()}
      data-today={isToday(context.date(), calendarContext.state().timeZone()) ? "" : undefined}
      data-unavailable={context.isUnavailable() ? "" : undefined}
      data-outside-month={isOutsideMonth() ? "" : undefined}
      data-range-start={isRangeStart() ? "" : undefined}
      data-range-end={isRangeEnd() ? "" : undefined}
      data-range-selection={isRangeSelection() ? "" : undefined}
      data-selection-start={isSelectionStart() ? "" : undefined}
      data-selection-end={isSelectionEnd() ? "" : undefined}
      data-selected={context.isSelected() ? "" : undefined}
      data-disabled={context.isDisabled() ? "" : undefined}
      data-invalid={context.isInvalid() ? "" : undefined}
      data-hover={isHovered() ? "" : undefined}
      data-focus={isFocused() ? "" : undefined}
      data-focus-visible={isFocusVisible() ? "" : undefined}
      data-active={isPressed() ? "" : undefined}
      onFocus={composeEventHandlers([local.onFocus, onFocus])}
      onContextMenu={composeEventHandlers([local.onContextMenu, onContextMenu])}
      onKeyDown={composeEventHandlers([local.onKeyDown, pressHandlers.onKeyDown])}
      onKeyUp={composeEventHandlers([local.onKeyUp, pressHandlers.onKeyUp])}
      onClick={composeEventHandlers([local.onClick, pressHandlers.onClick])}
      onPointerDown={composeEventHandlers([
        local.onPointerDown,
        pressHandlers.onPointerDown,
        onPointerDown,
      ])}
      onPointerUp={composeEventHandlers([local.onPointerUp, pressHandlers.onPointerUp])}
      onMouseDown={composeEventHandlers([local.onMouseDown, pressHandlers.onMouseDown])}
      onDragStart={composeEventHandlers([local.onDragStart, pressHandlers.onDragStart])}
      onPointerEnter={composeEventHandlers([
        local.onPointerEnter,
        onPointerEnter,
        hoverHandlers.onPointerEnter,
      ])}
      onPointerLeave={composeEventHandlers([local.onPointerLeave, hoverHandlers.onPointerLeave])}
      onFocusIn={composeEventHandlers([local.onFocusIn, focusRingHandlers.onFocusIn])}
      onFocusOut={composeEventHandlers([local.onFocusOut, focusRingHandlers.onFocusOut])}
      {...others}
    />
  );
});
