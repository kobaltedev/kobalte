import { isSameDay, isSameMonth, isWeekend } from "@internationalized/date";
import {
  callHandler,
  focusWithoutScrolling,
  mergeRefs,
  OverrideComponentProps,
} from "@kobalte/utils";
import { createEffect, createMemo, JSX, splitProps } from "solid-js";

import * as Button from "../button";
import { createDateFormatter } from "../i18n";
import { useCalendarCellContext } from "./calendar-cell-context";
import { useCalendarContext } from "./calendar-context";
import { useCalendarGridContext } from "./calendar-grid-context";
import { getEraFormat } from "./utils";

export type CalendarCellTriggerProps = OverrideComponentProps<"button", Button.ButtonRootOptions>;

export function CalendarCellTrigger(props: CalendarCellTriggerProps) {
  let ref: HTMLButtonElement | undefined;

  const rootContext = useCalendarContext();
  const gridContext = useCalendarGridContext();
  const context = useCalendarCellContext();

  const [local, others] = splitProps(props, [
    "ref",
    "disabled",
    "onPointerEnter",
    "onPointerLeave",
    "onPointerDown",
    "onPointerUp",
    "onClick",
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
    /*
    // TODO: RangeCalendar
    if (
      rootContext.selectionMode() === "range" &&
      state.value &&
      !state.anchorDate &&
      (isSameDay(date, state.value.start) || isSameDay(date, state.value.end))
    ) {
      label = selectedDateDescription + ", ";
    }
    */

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

  let isAnchorPressed = false;
  let isRangeBoundaryPressed = false;
  let touchDragTimerRef: number | undefined;

  const onPressEnd = () => {
    isRangeBoundaryPressed = false;
    isAnchorPressed = false;
    window.clearTimeout(touchDragTimerRef);
    touchDragTimerRef = undefined;
  };

  const onPointerEnter: JSX.EventHandlerUnion<HTMLButtonElement, PointerEvent> = e => {
    callHandler(e, local.onPointerEnter);

    // Highlight the date on hover or drag over a date when selecting a range.
    /*
    // TODO: RangeCalendar
    if (
      rootContext.selectionMode() === "range" &&
      (e.pointerType !== "touch" || rootContext.isDragging()) &&
      context.isSelectable()
    ) {
      rootContext.highlightDate(context.date());
    }
    */
  };

  const onPointerLeave: JSX.EventHandlerUnion<HTMLButtonElement, PointerEvent> = e => {
    callHandler(e, local.onPointerLeave);
    onPressEnd();
  };

  const onPointerDown: JSX.EventHandlerUnion<HTMLButtonElement, PointerEvent> = e => {
    callHandler(e, local.onPointerDown);

    // This is necessary on touch devices to allow dragging
    // outside the original pressed element.
    // (JSDOM does not support this)
    if ("releasePointerCapture" in e.target) {
      e.target.releasePointerCapture(e.pointerId);
    }

    if (rootContext.isReadOnly()) {
      rootContext.focusCell(context.date());
      return;
    }

    /*
    TODO: RangeCalendar
    if (
      rootContext.selectionMode() === "range" &&
      !state.anchorDate &&
      (e.pointerType === "mouse" || e.pointerType === "touch")
    ) {
      // Allow dragging the start or end date of a range to modify it
      // rather than starting a new selection.
      // Don't allow dragging when invalid, or weird jumping behavior may occur as date ranges
      // are constrained to available dates. The user will need to select a new range in this case.
      if (state.highlightedRange && !isInvalid) {
        if (isSameDay(date, state.highlightedRange.start)) {
          state.setAnchorDate(state.highlightedRange.end);
          state.setFocusedDate(date);
          state.setDragging(true);
          isRangeBoundaryPressed = true;
          return;
        } else if (isSameDay(date, state.highlightedRange.end)) {
          state.setAnchorDate(state.highlightedRange.start);
          state.setFocusedDate(date);
          state.setDragging(true);
          isRangeBoundaryPressed = true;
          return;
        }
      }

      let startDragging = () => {
        state.setDragging(true);
        touchDragTimerRef = null;

        state.selectDate(date);
        state.setFocusedDate(date);
        isAnchorPressed = true;
      };

      // Start selection on mouse/touch down so users can drag to select a range.
      // On touch, delay dragging to determine if the user really meant to scroll.
      if (e.pointerType === "touch") {
        touchDragTimerRef = setTimeout(startDragging, 200);
      } else {
        startDragging();
      }
    }
    */
  };

  const onPointerUp: JSX.EventHandlerUnion<HTMLButtonElement, PointerEvent> = e => {
    callHandler(e, local.onPointerUp);
    onPressEnd();

    if (rootContext.isReadOnly()) {
      return;
    }

    // If the user tapped quickly, the date won't be selected yet and the
    // timer will still be in progress. In this case, select the date on touch up.
    // Timer is cleared in onPressEnd.
    if (rootContext.selectionMode() === "range" && touchDragTimerRef) {
      rootContext.selectDate(context.date());
      rootContext.focusCell(context.date());
    }

    /*
    // TODO: RangeCalendar
    if (rootContext.selectionMode() === "range") {
      if (isRangeBoundaryPressed) {
        // When clicking on the start or end date of an already selected range,
        // start a new selection on press up to also allow dragging the date to
        // change the existing range.
        rootContext.setAnchorDate(context.date());
      } else if (rootContext.anchorDate() && !isAnchorPressed) {
        // When releasing a drag or pressing the end date of a range, select it.
        rootContext.selectDate(context.date());
        rootContext.focusCell(context.date());
      } else if (e.pointerType === "keyboard" && !rootContext.anchorDate()) {
        // For range selection, auto-advance the focused date by one if using keyboard.
        // This gives an indication that you're selecting a range rather than a single date.
        // For mouse, this is unnecessary because users will see the indication on hover. For screen readers,
        // there will be an announcement to "click to finish selecting range" (above).
        rootContext.selectDate(context.date());
        let nextDay = context.date().add({ days: 1 });
        if (rootContext.isDateInvalid(nextDay)) {
          nextDay = context.date().subtract({ days: 1 });
        }
        if (!rootContext.isDateInvalid(nextDay)) {
          rootContext.focusCell(nextDay);
        }
      } else if (e.pointerType === "virtual") {
        // For screen readers, just select the date on click.
        rootContext.selectDate(context.date());
        rootContext.focusCell(context.date());
      }
    }
    */
  };

  const onClick: JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent> = e => {
    callHandler(e, local.onClick);

    // For non-range selection, always select on press up.
    if (rootContext.selectionMode() !== "range" && context.isSelectable()) {
      rootContext.selectDate(context.date());
      rootContext.focusCell(context.date());
    }
  };

  // Focus the button in the DOM when the date become the focused/highlighted one.
  createEffect(() => {
    if (ref && context.isFocused()) {
      focusWithoutScrolling(ref);
    }
  });

  return (
    <Button.Root
      as="div"
      ref={mergeRefs(el => (ref = el), local.ref)}
      tabIndex={tabIndex()}
      disabled={isDisabled()}
      aria-disabled={!context.isSelectable() || undefined}
      aria-invalid={context.isInvalid() || undefined}
      aria-label={ariaLabel()}
      data-invalid={context.isInvalid() || undefined}
      data-selected={context.isSelected() || undefined}
      data-value={context.date().toString()}
      data-type="day"
      data-today={context.isDateToday() || undefined}
      data-weekend={isDateWeekend() || undefined}
      data-highlighted={context.isFocused() || undefined}
      data-unavailable={context.isUnavailable() || undefined}
      //data-selection-start={isSelectionStart || undefined} // TODO: RangeCalendar
      //data-selection-end={isSelectionEnd || undefined} // TODO: RangeCalendar
      data-outside-visible-range={isOutsideVisibleRange() || undefined}
      data-outside-month={isOutsideMonth() || undefined}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onClick={onClick}
      onContextMenu={e => {
        // Prevent context menu on long press.
        e.preventDefault();
      }}
      {...others}
    >
      {formattedDate()}
    </Button.Root>
  );
}
