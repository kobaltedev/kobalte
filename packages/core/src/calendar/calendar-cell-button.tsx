/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/bb9f65fc853474065a9de9ed6f5f471c16689237/packages/@react-aria/calendar/src/useCalendarCell.ts
 */

import { isSameDay } from "@internationalized/date";
import {
  combineProps,
  createPolymorphicComponent,
  focusWithoutScrolling,
  getScrollParent,
  mergeDefaultProps,
  scrollIntoView,
} from "@kobalte/utils";
import { createEffect, JSX, splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

import { createFocusRing, createHover, createPress, getInteractionModality } from "../primitives";
import { useCalendarCellContext } from "./calendar-cell-context";
import { useCalendarContext } from "./calendar-context";

export const CalendarCellButton = createPolymorphicComponent<"div">(props => {
  let ref: HTMLElement | undefined;

  const calendarContext = useCalendarContext();
  const context = useCalendarCellContext();

  props = mergeDefaultProps(
    {
      as: "div",
      children: context.formattedDate(),
    },
    props
  );

  const [local, others] = splitProps(props, ["as"]);

  const tabIndex = () => {
    if (context.isDisabled()) {
      return undefined;
    }

    const state = calendarContext.calendarState();

    return isSameDay(context.date(), state.focusedDate()) ? 0 : -1;
  };

  let isAnchorPressed = false;
  let isRangeBoundaryPressed = false;
  let touchDragTimeoutId: number | null = null;

  const { isPressed, pressHandlers } = createPress({
    // When dragging to select a range, we don't want dragging over the original anchor
    // again to trigger onPressStart. Cancel presses immediately when the pointer exits.
    cancelOnPointerExit: () => {
      const state = calendarContext.calendarState();
      return "anchorDate" in state && !!state.anchorDate();
    },
    preventFocusOnPress: true,
    isDisabled: () => !context.isSelectable(),
    onPressStart: e => {
      const state = calendarContext.calendarState();

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
        if (highlightedRange && !context.isInvalid()) {
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
      const state = calendarContext.calendarState();

      // For non-range selection, always select on press up.
      if (!("anchorDate" in state) && !state.isReadOnly()) {
        state.selectDate(context.date());
        state.setFocusedDate(context.date());
      }
    },
    onPressUp: e => {
      const state = calendarContext.calendarState();

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
    const state = calendarContext.calendarState();

    if (!context.isDisabled()) {
      state.setFocusedDate(context.date());
    }
  };

  const onPointerEnter: JSX.EventHandlerUnion<any, PointerEvent> = e => {
    const state = calendarContext.calendarState();

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

  // Focus the button in the DOM when the state updates.
  createEffect(() => {
    if (context.isFocused() && ref) {
      focusWithoutScrolling(ref);

      // Scroll into view if navigating with a keyboard, otherwise
      // try not to shift the view under the user's mouse/finger.
      // Only scroll the direct scroll parent, not the whole page, so
      // we don't scroll to the bottom when opening date picker popover.
      if (getInteractionModality() !== "pointer") {
        scrollIntoView(getScrollParent(ref) as HTMLElement, ref);
      }
    }
  });

  return (
    <Dynamic
      component={local.as}
      role="button"
      tabIndex={tabIndex()}
      aria-label={context.label()}
      aria-disabled={!context.isSelectable() || undefined}
      data-disabled={context.isDisabled() ? "" : undefined}
      data-unavailable={context.isUnavailable() ? "" : undefined}
      data-outside-visible-range={context.isOutsideVisibleRange() ? "" : undefined}
      data-selected={context.isSelected() ? "" : undefined}
      data-invalid={context.isInvalid() ? "" : undefined}
      data-hover={isHovered() ? "" : undefined}
      data-focus={context.isFocused() ? "" : undefined}
      data-focus-visible={isFocusVisible() ? "" : undefined}
      data-active={isPressed() ? "" : undefined}
      {...combineProps(
        {
          ref: el => (ref = el),
        },
        others,
        pressHandlers,
        hoverHandlers,
        focusRingHandlers,
        {
          onFocus,
          onPointerEnter,
          onPointerDown,
          onContextMenu,
        }
      )}
    />
  );
});
