/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/a8903d3b8c462b85cc34e8565e1a1084827d0a29/packages/@react-aria/calendar/src/useCalendarCell.ts
 */

import { isSameDay, isSameMonth, isWeekend } from "@internationalized/date";
import {
  callHandler,
  focusWithoutScrolling,
  getWindow,
  mergeRefs,
  OverrideComponentProps,
} from "@kobalte/utils";
import { createEffect, createMemo, JSX, splitProps } from "solid-js";

import { createDateFormatter } from "../i18n";
import { AsChildProp, Polymorphic } from "../polymorphic";
import { useCalendarContext } from "./calendar-context";
import { useCalendarGriBodyCellContext } from "./calendar-grid-body-cell-context";
import { useCalendarGridContext } from "./calendar-grid-context";
import { asRangeValue, getEraFormat, getSelectedDateDescription } from "./utils";

export interface CalendarGridBodyCellTriggerOptions extends AsChildProp {
  /** Whether the cell trigger is disabled. */
  disabled?: boolean;
}

export type CalendarGridBodyCellTriggerProps = OverrideComponentProps<
  "div",
  CalendarGridBodyCellTriggerOptions
>;

export function CalendarGridBodyCellTrigger(props: CalendarGridBodyCellTriggerProps) {
  let ref: HTMLDivElement | undefined;

  const rootContext = useCalendarContext();
  const gridContext = useCalendarGridContext();
  const context = useCalendarGriBodyCellContext();

  const [local, others] = splitProps(props, [
    "ref",
    "disabled",
    "onPointerEnter",
    "onPointerDown",
    "onPointerUp",
    "onPointerLeave",
    "onClick",
    "onKeyDown",
  ]);

  const isDisabled = () => local.disabled || context.isDisabled();

  const isDateWeekend = () => {
    return isWeekend(context.date(), rootContext.locale());
  };

  const isOutsideVisibleRange = () => {
    return (
      context.date().compare(rootContext.startDate()) < 0 ||
      context.date().compare(rootContext.endDate()) > 0
    );
  };

  const isOutsideMonth = () => {
    return !isSameMonth(gridContext.startDate(), context.date());
  };

  const isSelectionStart = () => {
    if (rootContext.selectionMode() !== "range") {
      return false;
    }

    const start = rootContext.highlightedRange()?.start;

    return start != null && isSameDay(context.date(), start);
  };

  const isSelectionEnd = () => {
    if (rootContext.selectionMode() !== "range") {
      return false;
    }

    const end = rootContext.highlightedRange()?.end;

    return end != null && isSameDay(context.date(), end);
  };

  const tabIndex = createMemo(() => {
    if (!isDisabled()) {
      return isSameDay(context.date(), rootContext.focusedDate()) ? 0 : -1;
    }

    return undefined;
  });

  const labelDateFormatter = createDateFormatter(() => ({
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    era: getEraFormat(context.date()),
    timeZone: rootContext.timeZone(),
  }));

  const cellDateFormatter = createDateFormatter(() => ({
    day: "numeric",
    timeZone: rootContext.timeZone(),
    calendar: context.date().calendar.identifier,
  }));

  const nativeDate = createMemo(() => {
    return context.date().toDate(rootContext.timeZone());
  });

  const formattedDate = createMemo(() => {
    return cellDateFormatter()
      .formatToParts(nativeDate())
      .find(part => part.type === "day")?.value;
  });

  const ariaLabel = createMemo(() => {
    let label = "";

    // If this is a range calendar, add a description of the full selected range
    // to the first and last selected date.
    if (rootContext.selectionMode() === "range" && !rootContext.anchorDate()) {
      const { start, end } = asRangeValue(rootContext.value()) ?? {};

      if (start && end && (isSameDay(context.date(), start) || isSameDay(context.date(), end))) {
        label =
          getSelectedDateDescription(
            rootContext.messageFormatter(),
            context.date(),
            rootContext.timeZone()
          ) + ", ";
      }
    }

    label += labelDateFormatter().format(nativeDate());
    if (context.isDateToday()) {
      // If date is today, set appropriate string depending on selected state:
      label = rootContext
        .messageFormatter()
        .format(context.isSelected() ? "todayDateSelected" : "todayDate", {
          date: label,
        });
    } else if (context.isSelected()) {
      // If date is selected but not today:
      label = rootContext.messageFormatter().format("dateSelected", {
        date: label,
      });
    }

    const min = rootContext.min();
    const max = rootContext.max();

    if (min && isSameDay(context.date(), min)) {
      label += ", " + rootContext.messageFormatter().format("minimumDate");
    } else if (max && isSameDay(context.date(), max)) {
      label += ", " + rootContext.messageFormatter().format("maximumDate");
    }

    return label;
  });

  let isPointerDown = false;
  let isAnchorPressed = false;
  let isRangeBoundaryPressed = false;
  let touchDragTimerRef: number | undefined;

  const onPressEnd = () => {
    isRangeBoundaryPressed = false;
    isAnchorPressed = false;

    if (touchDragTimerRef != null) {
      getWindow(ref).clearTimeout(touchDragTimerRef);
      touchDragTimerRef = undefined;
    }
  };

  const onPointerEnter: JSX.EventHandlerUnion<HTMLDivElement, PointerEvent> = e => {
    callHandler(e, local.onPointerEnter);

    // Highlight the date on hover or drag over a date when selecting a range.
    if (
      rootContext.selectionMode() === "range" &&
      (e.pointerType !== "touch" || rootContext.isDragging()) &&
      context.isSelectable()
    ) {
      rootContext.highlightDate(context.date());
    }
  };

  const onPointerLeave: JSX.EventHandlerUnion<HTMLDivElement, PointerEvent> = e => {
    callHandler(e, local.onPointerLeave);

    if (isPointerDown) {
      onPressEnd();
    }
  };

  const onPointerDown: JSX.EventHandlerUnion<HTMLDivElement, PointerEvent> = e => {
    callHandler(e, local.onPointerDown);
    isPointerDown = true;

    // This is necessary on touch devices to allow dragging
    // outside the original pressed element.
    if ("releasePointerCapture" in e.target) {
      e.target.releasePointerCapture(e.pointerId);
    }

    if (rootContext.isReadOnly()) {
      rootContext.focusCell(context.date());
      return;
    }

    if (rootContext.selectionMode() === "range" && !rootContext.anchorDate()) {
      const highlightedRange = rootContext.highlightedRange();

      // Allow dragging the start or end date of a range to modify it
      // rather than starting a new selection.
      // Don't allow dragging when invalid, or weird jumping behavior may occur as date ranges
      // are constrained to available dates. The user will need to select a new range in this case.
      if (highlightedRange && !context.isInvalid()) {
        if (isSameDay(context.date(), highlightedRange.start)) {
          rootContext.setAnchorDate(highlightedRange.end);
          rootContext.focusCell(context.date());
          rootContext.setIsDragging(true);
          isRangeBoundaryPressed = true;
          return;
        } else if (isSameDay(context.date(), highlightedRange.end)) {
          rootContext.setAnchorDate(highlightedRange.start);
          rootContext.focusCell(context.date());
          rootContext.setIsDragging(true);
          isRangeBoundaryPressed = true;
          return;
        }
      }

      const startDragging = () => {
        rootContext.setIsDragging(true);
        touchDragTimerRef = undefined;

        rootContext.selectDate(context.date());
        rootContext.focusCell(context.date());
        isAnchorPressed = true;
      };

      // Start selection on mouse/touch down so users can drag to select a range.
      // On touch, delay dragging to determine if the user really meant to scroll.
      if (e.pointerType === "touch") {
        touchDragTimerRef = getWindow(ref).setTimeout(startDragging, 200);
      } else {
        startDragging();
      }
    }
  };

  const onPointerUp: JSX.EventHandlerUnion<HTMLDivElement, PointerEvent> = e => {
    callHandler(e, local.onPointerUp);
    isPointerDown = false;

    if (rootContext.isReadOnly() || rootContext.selectionMode() !== "range") {
      onPressEnd();
      return;
    }

    // If the user tapped quickly, the date won't be selected yet and the
    // timer will still be in progress. In this case, select the date on touch up.
    if (touchDragTimerRef != null) {
      rootContext.selectDate(context.date());
      rootContext.focusCell(context.date());
    }

    if (isRangeBoundaryPressed) {
      // When clicking on the start or end date of an already selected range,
      // start a new selection on press up to also allow dragging the date to
      // change the existing range.
      rootContext.setAnchorDate(context.date());
    } else if (rootContext.anchorDate() && !isAnchorPressed) {
      // When releasing a drag or pressing the end date of a range, select it.
      rootContext.selectDate(context.date());
      rootContext.focusCell(context.date());
    }

    onPressEnd();
  };

  const onClick: JSX.EventHandlerUnion<HTMLDivElement, MouseEvent> = e => {
    callHandler(e, local.onClick);

    // For non-range selection, always select on press up.
    if (rootContext.selectionMode() !== "range" && context.isSelectable()) {
      rootContext.selectDate(context.date());
      rootContext.focusCell(context.date());
    }
  };

  const onKeyDown: JSX.EventHandlerUnion<HTMLDivElement, KeyboardEvent> = e => {
    callHandler(e, local.onKeyDown);

    if (!["Enter", " "].includes(e.key)) {
      return;
    }

    if (rootContext.isReadOnly()) {
      rootContext.focusCell(context.date());
      return;
    }

    if (rootContext.selectionMode() === "range" && !rootContext.anchorDate()) {
      // Prevent `Calendar.Grid` to select the cell.
      e.stopPropagation();

      // For range selection, auto-advance the focused date by one if using keyboard.
      // This gives an indication that you're selecting a range rather than a single date.
      rootContext.selectDate(context.date());
      let nextDay = context.date().add({ days: 1 });

      if (rootContext.isCellInvalid(nextDay)) {
        nextDay = context.date().subtract({ days: 1 });
      }

      if (!rootContext.isCellInvalid(nextDay)) {
        rootContext.focusCell(nextDay);
      }
    }
  };

  // Focus the button in the DOM when the date become the focused/highlighted one.
  createEffect(() => {
    if (ref && context.isFocused()) {
      focusWithoutScrolling(ref);
    }
  });

  return (
    // eslint-disable-next-line jsx-a11y/role-supports-aria-props
    <Polymorphic
      as="div"
      ref={mergeRefs(el => (ref = el), local.ref)}
      role="button"
      tabIndex={tabIndex()}
      disabled={isDisabled()}
      aria-disabled={!context.isSelectable() || undefined}
      aria-invalid={context.isInvalid() || undefined}
      aria-label={ariaLabel()}
      data-disabled={isDisabled() || undefined}
      data-invalid={context.isInvalid() || undefined}
      data-selected={context.isSelected() || undefined}
      data-value={context.date().toString()}
      data-type="day"
      data-today={context.isDateToday() || undefined}
      data-weekend={isDateWeekend() || undefined}
      data-highlighted={context.isFocused() || undefined}
      data-unavailable={context.isUnavailable() || undefined}
      data-selection-start={isSelectionStart() || undefined}
      data-selection-end={isSelectionEnd() || undefined}
      data-outside-visible-range={isOutsideVisibleRange() || undefined}
      data-outside-month={isOutsideMonth() || undefined}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onClick={onClick}
      onKeyDown={onKeyDown}
      onContextMenu={(e: Event) => {
        // Prevent context menu on long press.
        e.preventDefault();
      }}
      {...others}
    >
      {formattedDate()}
    </Polymorphic>
  );
}
