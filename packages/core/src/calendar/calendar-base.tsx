/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/0a1d0cd4e1b2f77eed7c0ea08fce8a04f8de6921/packages/@react-stately/calendar/src/useCalendarState.ts
 * https://github.com/adobe/react-spectrum/blob/0a1d0cd4e1b2f77eed7c0ea08fce8a04f8de6921/packages/@react-aria/calendar/src/useCalendarBase.ts
 */

import {
  Calendar,
  CalendarDate,
  DateDuration,
  DateFormatter,
  getDayOfWeek,
  GregorianCalendar,
  isEqualDay,
  isSameDay,
  maxDate,
  minDate,
  startOfWeek,
  toCalendar,
  toCalendarDate,
  today,
} from "@internationalized/date";
import {
  callHandler,
  contains,
  getDocument,
  getWindow,
  mergeDefaultProps,
  mergeRefs,
  OverrideComponentProps,
  RangeValue,
  ValidationState,
} from "@kobalte/utils";
import {
  Accessor,
  createEffect,
  createMemo,
  createSignal,
  JSX,
  on,
  onCleanup,
  splitProps,
} from "solid-js";

import { createMessageFormatter, getReadingDirection } from "../i18n";
import { announce } from "../live-announcer";
import { Polymorphic } from "../polymorphic";
import { createControllableArraySignal, createControllableSignal } from "../primitives";
import { CALENDAR_INTL_MESSAGES } from "./calendar.intl";
import { CalendarContext, CalendarContextValue, CalendarDataSet } from "./calendar-context";
import { CalendarSelectionMode, DateAlignment, DateValue } from "./types";
import {
  alignCenter,
  alignDate,
  constrainValue,
  getAdjustedDateFn,
  getEndDate,
  getNextPage,
  getNextRow,
  getNextSection,
  getPreviousAvailableDate,
  getPreviousPage,
  getPreviousRow,
  getPreviousSection,
  getSectionEnd,
  getSectionStart,
  getSelectedDateDescription,
  getVisibleRangeDescription,
  isDateInvalid,
  makeCalendarDateRange,
  getNextUnavailableDate,
  sortDates,
} from "./utils";

export interface CalendarBaseOptions {
  /** The locale to display and edit the value according to. */
  locale: string;

  /**
   * A function that creates a [Calendar](https://react-spectrum.adobe.com/internationalized/date/Calendar.html)
   * object for a given calendar identifier. Such a function may be imported from the
   * `@internationalized/date` package, or manually implemented to include support for
   * only certain calendars.
   */
  createCalendar: (name: string) => Calendar;

  /** The amount of days that will be displayed at once. This affects how pagination works. */
  visibleDuration?: DateDuration;

  /** Determines how to align the initial selection relative to the visible date range. */
  selectionAlignment?: DateAlignment;

  /**
   * The selection mode of the calendar.
   * - `single` - only one date can be selected
   * - `multiple` - multiple dates can be selected
   * - `range` - a range of dates can be selected
   */
  selectionMode?: CalendarSelectionMode;

  /** The controlled selected dates of the calendar. */
  value?: Array<DateValue>;

  /**
   * The dates of the calendar that should be selected when initially rendered.
   * Useful when you do not need to control the state of the calendar.
   */
  defaultValue?: Array<DateValue>;

  /** Event handler called when the selected dates change. */
  onChange?: (value: Array<DateValue>) => void;

  /** The minimum allowed date that a user may select. */
  min?: DateValue;

  /** The maximum allowed date that a user may select. */
  max?: DateValue;

  /**
   * Callback that is called for each date of the calendar.
   * If it returns true, then the date is unavailable.
   */
  isDateUnavailable?: (date: DateValue) => boolean;

  /**
   * In "range" selection mode, when combined with `isDateUnavailable`,
   * determines whether non-contiguous ranges, i.e. ranges containing unavailable dates, may be selected.
   */
  allowsNonContiguousRanges?: boolean;

  /** Whether to automatically focus the calendar when it mounts. */
  autoFocus?: boolean;

  /** Controls the currently focused date within the calendar. */
  focusedValue?: DateValue;

  /** The date that is focused when the calendar first mounts. */
  defaultFocusedValue?: DateValue;

  /** Handler that is called when the focused date changes. */
  onFocusChange?: (date: DateValue) => void;

  /** Whether the current selection is valid or invalid according to application logic. */
  validationState?: ValidationState;

  /** Whether the calendar is disabled. */
  disabled?: boolean;

  /** Whether the calendar value is immutable. */
  readOnly?: boolean;
}

export type CalendarBaseProps = OverrideComponentProps<"div", CalendarBaseOptions>;

export function CalendarBase(props: CalendarBaseProps) {
  let ref: HTMLDivElement | undefined;

  props = mergeDefaultProps(
    {
      visibleDuration: { months: 1 },
      selectionMode: "single",
    },
    props
  );

  const [local, others] = splitProps(props, [
    "ref",
    "locale",
    "createCalendar",
    "visibleDuration",
    "selectionAlignment",
    "selectionMode",
    "value",
    "defaultValue",
    "onChange",
    "min",
    "max",
    "isDateUnavailable",
    "allowsNonContiguousRanges",
    "autoFocus",
    "focusedValue",
    "defaultFocusedValue",
    "onFocusChange",
    "validationState",
    "disabled",
    "readOnly",
    "onFocusOut",
    "aria-label",
  ]);

  const messageFormatter = createMessageFormatter(() => CALENDAR_INTL_MESSAGES);

  const resolvedOptions = createMemo(() => {
    return new DateFormatter(local.locale).resolvedOptions();
  });

  const direction = createMemo(() => {
    return getReadingDirection(local.locale);
  });

  const calendar = createMemo(() => {
    return local.createCalendar(resolvedOptions().calendar);
  });

  const [value, setControlledValue] = createControllableArraySignal({
    value: () => local.value,
    defaultValue: () => local.defaultValue ?? [],
    onChange: value => local.onChange?.(value),
  });

  // The selected values as range, for "range" selection mode.
  const valueRange: Accessor<RangeValue<DateValue | undefined>> = createMemo(() => {
    const [start, end] = value();
    return { start, end };
  });

  const [availableRange, setAvailableRange] = createSignal<RangeValue<DateValue | undefined>>();

  const selectionAlignment = createMemo(() => {
    if (local.selectionMode === "range") {
      const { start: valueStart, end: valueEnd } = valueRange();

      if (valueStart && valueEnd) {
        const start = alignCenter(
          toCalendarDate(valueStart),
          local.visibleDuration!,
          local.locale,
          local.min,
          local.max
        );

        const end = start.add(local.visibleDuration!).subtract({ days: 1 });

        if (valueEnd.compare(end) > 0) {
          return "start";
        }
      }

      return "center";
    }

    return local.selectionAlignment ?? "center";
  });

  const min = createMemo(() => {
    const startRange = availableRange()?.start;

    if (local.selectionMode === "range" && local.min && startRange) {
      return maxDate(local.min, startRange);
    }

    return local.min;
  });

  const max = createMemo(() => {
    const endRange = availableRange()?.end;

    if (local.selectionMode === "range" && local.max && endRange) {
      return minDate(local.max, endRange);
    }

    return local.max;
  });

  const calendarDateValue = createMemo(() => {
    return value().map(date => toCalendar(toCalendarDate(date), calendar()));
  });

  const timeZone = createMemo(() => {
    const firstValue = value()[0];

    if (firstValue && "timeZone" in firstValue) {
      return firstValue.timeZone;
    }

    return resolvedOptions().timeZone;
  });

  const focusedCalendarDate = createMemo(() => {
    if (local.focusedValue) {
      return constrainValue(
        toCalendar(toCalendarDate(local.focusedValue), calendar()),
        min(),
        max()
      );
    }

    return undefined;
  });

  const defaultFocusedCalendarDate = createMemo(() => {
    return constrainValue(
      local.defaultFocusedValue
        ? toCalendar(toCalendarDate(local.defaultFocusedValue), calendar())
        : calendarDateValue()[0] || toCalendar(today(timeZone()), calendar()),
      min(),
      max()
    );
  });

  const [focusedDate, setFocusedDate] = createControllableSignal({
    value: focusedCalendarDate,
    defaultValue: defaultFocusedCalendarDate,
    onChange: value => local.onFocusChange?.(value),
  });

  const [startDate, setStartDate] = createSignal(
    alignDate(
      focusedDate()!,
      selectionAlignment(),
      local.visibleDuration!,
      local.locale,
      min(),
      max()
    )
  );

  const endDate = createMemo(() => {
    return getEndDate(startDate(), local.visibleDuration!);
  });

  const [isFocused, setIsFocused] = createSignal(local.autoFocus || false);

  const [isDragging, setIsDragging] = createSignal(false);

  const visibleRangeDescription = createMemo(() => {
    return getVisibleRangeDescription(messageFormatter(), startDate(), endDate(), timeZone(), true);
  });

  const ariaLabel = () => {
    return [local["aria-label"], visibleRangeDescription()].filter(Boolean).join(", ");
  };

  const isCellDisabled = (date: DateValue) => {
    return (
      local.disabled ||
      date.compare(startDate()) < 0 ||
      date.compare(endDate()) > 0 ||
      isDateInvalid(date, min(), max())
    );
  };

  const isCellUnavailable = (date: DateValue) => {
    return local.isDateUnavailable?.(date) ?? false;
  };

  const updateAvailableRange = (date: DateValue | undefined) => {
    if (date && local.isDateUnavailable && !local.allowsNonContiguousRanges) {
      setAvailableRange({
        start: getNextUnavailableDate(date, startDate(), endDate(), isCellUnavailable, -1),
        end: getNextUnavailableDate(date, startDate(), endDate(), isCellUnavailable, 1),
      });
    } else {
      setAvailableRange(undefined);
    }
  };

  const [anchorDate, setAnchorDate] = createControllableSignal<DateValue | undefined>({
    onChange: value => updateAvailableRange(value),
  });

  const highlightedRange = createMemo(() => {
    const resolvedAnchorDate = anchorDate();

    if (resolvedAnchorDate) {
      return makeCalendarDateRange(resolvedAnchorDate, focusedDate()!);
    }

    const { start, end } = valueRange();

    return makeCalendarDateRange(start, end);
  });

  const validationState = createMemo(() => {
    if (local.validationState) {
      return local.validationState;
    }

    if (calendarDateValue().length <= 0) {
      return null;
    }

    if (local.selectionMode === "range" && anchorDate()) {
      return null;
    }

    const isSomeDateInvalid = calendarDateValue().some(date => {
      return local.isDateUnavailable?.(date) || isDateInvalid(date, min(), max());
    });

    return isSomeDateInvalid ? "invalid" : null;
  });

  const isCellSelected = (cellDate: DateValue) => {
    const isAvailable = !isCellDisabled(cellDate) && !isCellUnavailable(cellDate);

    if (local.selectionMode === "range") {
      const { start, end } = highlightedRange() ?? {};

      const isInRange =
        start != null && cellDate.compare(start) >= 0 && end != null && cellDate.compare(end) <= 0;

      return isInRange && isAvailable;
    }

    return calendarDateValue().some(date => isSameDay(cellDate, date)) && isAvailable;
  };

  const isCellFocused = (date: DateValue) => {
    const resolvedFocusedDate = focusedDate();

    return isFocused() && resolvedFocusedDate != null && isSameDay(date, resolvedFocusedDate);
  };

  const isCellInvalid = (date: DateValue) => {
    if (local.selectionMode === "range") {
      return (
        isDateInvalid(date, min(), max()) ||
        isDateInvalid(date, availableRange()?.start, availableRange()?.end)
      );
    }

    return isDateInvalid(date, min(), max());
  };

  const selectDate = (date: DateValue) => {
    if (local.readOnly || local.disabled) {
      return;
    }

    let newValue = getPreviousAvailableDate(
      constrainValue(date, min(), max()),
      startDate(),
      local.isDateUnavailable
    );

    if (!newValue) {
      return;
    }

    if (local.selectionMode === "range") {
      if (!anchorDate()) {
        setAnchorDate(newValue);
      } else {
        setControlledValue(prev => {
          const [prevStart, prevEnd] = prev;

          const range = makeCalendarDateRange(anchorDate(), newValue);

          if (!range) {
            return prev;
          }

          return [convertValue(range.start, prevStart), convertValue(range.end, prevEnd)];
        });

        setAnchorDate(undefined);
      }
    } else {
      setControlledValue(prev => {
        if (!newValue) {
          return prev;
        }

        newValue = convertValue(newValue, prev[0]);

        if (local.selectionMode === "single") {
          return [newValue];
        }

        if (local.selectionMode === "multiple") {
          const index = prev.findIndex(date => newValue != null && isSameDay(date, newValue));

          // If new value is already selected, remove it.
          if (index !== -1) {
            const nextValues = [...prev];
            nextValues.splice(index, 1);
            return sortDates(nextValues);
          } else {
            return sortDates([...prev, newValue]);
          }
        }

        return prev;
      });
    }
  };

  const selectFocusedDate = () => {
    selectDate(focusedDate()!);
  };

  const focusCell = (date: DateValue) => {
    setFocusedDate(constrainValue(date, min(), max()));

    if (!isFocused()) {
      setIsFocused(true);
    }
  };

  const highlightDate = (date: DateValue) => {
    if (anchorDate()) {
      focusCell(date);
    }
  };

  const focusNextDay = () => {
    focusCell(focusedDate()!.add({ days: 1 }));
  };

  const focusPreviousDay = () => {
    focusCell(focusedDate()!.subtract({ days: 1 }));
  };

  const focusNextPage = () => {
    const page = getNextPage(
      focusedDate()!,
      startDate(),
      local.visibleDuration!,
      local.locale,
      min(),
      max()
    );

    setStartDate(page.startDate);
    focusCell(page.focusedDate);
  };

  const focusPreviousPage = () => {
    const page = getPreviousPage(
      focusedDate()!,
      startDate(),
      local.visibleDuration!,
      local.locale,
      min(),
      max()
    );

    setStartDate(page.startDate);
    focusCell(page.focusedDate);
  };

  const focusNextRow = () => {
    const row = getNextRow(
      focusedDate()!,
      startDate(),
      local.visibleDuration!,
      local.locale,
      min(),
      max()
    );

    if (row) {
      setStartDate(row.startDate);
      focusCell(row.focusedDate);
    }
  };

  const focusPreviousRow = () => {
    const row = getPreviousRow(
      focusedDate()!,
      startDate(),
      local.visibleDuration!,
      local.locale,
      min(),
      max()
    );

    if (row) {
      setStartDate(row.startDate);
      focusCell(row.focusedDate);
    }
  };

  const focusSectionStart = () => {
    const section = getSectionStart(
      focusedDate()!,
      startDate(),
      local.visibleDuration!,
      local.locale,
      min(),
      max()
    );

    if (section) {
      setStartDate(section.startDate);
      focusCell(section.focusedDate);
    }
  };

  const focusSectionEnd = () => {
    const section = getSectionEnd(
      focusedDate()!,
      startDate(),
      local.visibleDuration!,
      local.locale,
      min(),
      max()
    );

    if (section) {
      setStartDate(section.startDate);
      focusCell(section.focusedDate);
    }
  };

  const focusNextSection = (larger: boolean) => {
    const section = getNextSection(
      focusedDate()!,
      startDate(),
      larger,
      local.visibleDuration!,
      local.locale,
      min(),
      max()
    );

    if (section) {
      setStartDate(section.startDate);
      focusCell(section.focusedDate);
    }
  };

  const focusPreviousSection = (larger: boolean) => {
    const section = getPreviousSection(
      focusedDate()!,
      startDate(),
      larger,
      local.visibleDuration!,
      local.locale,
      min(),
      max()
    );

    if (section) {
      setStartDate(section.startDate);
      focusCell(section.focusedDate);
    }
  };

  const getDatesInWeek = (weekIndex: number, from: DateValue) => {
    let date = from.add({ weeks: weekIndex });
    const dates = [];

    date = startOfWeek(date, local.locale);

    // startOfWeek will clamp dates within the calendar system's valid range, which may
    // start in the middle of a week. In this case, add null placeholders.
    const dayOfWeek = getDayOfWeek(date, local.locale);
    for (let i = 0; i < dayOfWeek; i++) {
      dates.push(null);
    }

    while (dates.length < 7) {
      dates.push(date);
      const nextDate = date.add({ days: 1 });
      if (isSameDay(date, nextDate)) {
        // If the next day is the same, we have hit the end of the calendar system.
        break;
      }
      date = nextDate;
    }

    // Add null placeholders if at the end of the calendar system.
    while (dates.length < 7) {
      dates.push(null);
    }

    return dates;
  };

  const onFocusOut: JSX.FocusEventHandlerUnion<HTMLDivElement, FocusEvent> = e => {
    callHandler(e, local.onFocusOut);

    const relatedTarget = e.relatedTarget as Element | null;

    // Stop range selection on focus out, e.g. tabbing away from the calendar.
    if (
      local.selectionMode === "range" &&
      ref &&
      (!relatedTarget || !contains(ref, relatedTarget)) &&
      anchorDate()
    ) {
      selectFocusedDate();
    }
  };

  // Reset focused date and visible range when calendar changes.
  let lastCalendarIdentifier = calendar().identifier;

  createEffect(
    on(calendar, calendar => {
      if (calendar.identifier !== lastCalendarIdentifier) {
        const newFocusedDate = toCalendar(focusedDate()!, calendar);

        setStartDate(
          alignCenter(newFocusedDate, local.visibleDuration!, local.locale, min(), max())
        );

        setFocusedDate(newFocusedDate);

        lastCalendarIdentifier = calendar.identifier;
      }
    })
  );

  createEffect(() => {
    const adjust = getAdjustedDateFn(local.visibleDuration!, local.locale, min(), max());

    const adjustment = adjust({
      startDate: startDate(),
      focusedDate: focusedDate()!,
    });

    setStartDate(adjustment.startDate);
    setFocusedDate(adjustment.focusedDate);
  });

  // Announce when the visible date range changes only when pressing the Previous or Next triggers.
  createEffect(() => {
    if (!isFocused()) {
      announce(visibleRangeDescription());
    }
  });

  // Announce when the selected value changes
  createEffect(() => {
    // TODO
    const description = ""; //getSelectedDateDescription(messageFormatter(), value(), timeZone());

    if (description) {
      announce(description, "polite", 4000);
    }
  });

  // In "range" selection mode, update the available range if the visible range changes.
  createEffect(
    on([startDate, endDate], () => {
      if (local.selectionMode === "range") {
        updateAvailableRange(anchorDate());
      }
    })
  );

  let isVirtualClick = false;

  createEffect(() => {
    if (local.selectionMode !== "range" || !ref) {
      return;
    }

    const win = getWindow(ref);
    const doc = getDocument(ref);

    // We need to ignore virtual pointer events from VoiceOver due to these bugs.
    // https://bugs.webkit.org/show_bug.cgi?id=222627
    // https://bugs.webkit.org/show_bug.cgi?id=223202
    const onWindowPointerDown = (e: PointerEvent) => {
      isVirtualClick = e.width === 0 && e.height === 0;
    };

    // Stop range selection when pressing or releasing a pointer outside the calendar body,
    // except when pressing the next or previous buttons to switch months.
    const endDragging = (e: PointerEvent) => {
      if (isVirtualClick) {
        isVirtualClick = false;
        return;
      }

      setIsDragging(false);
      if (!anchorDate()) {
        return;
      }

      const target = e.target as Element;
      if (
        contains(ref, doc.activeElement) &&
        (!contains(ref, target) || !target.closest('button, [role="button"]'))
      ) {
        selectFocusedDate();
      }
    };

    // Prevent touch scrolling while dragging
    const onTouchMove = (e: TouchEvent) => {
      if (isDragging()) {
        e.preventDefault();
      }
    };

    win.addEventListener("pointerdown", onWindowPointerDown);
    win.addEventListener("pointerup", endDragging);
    win.addEventListener("pointercancel", endDragging);
    ref.addEventListener("touchmove", onTouchMove, { passive: false, capture: true });

    onCleanup(() => {
      win.removeEventListener("pointerdown", onWindowPointerDown);
      win.removeEventListener("pointerup", endDragging);
      win.removeEventListener("pointercancel", endDragging);
      ref?.removeEventListener("touchmove", onTouchMove, { capture: true });
    });
  });

  const dataset: Accessor<CalendarDataSet> = createMemo(() => ({}));

  const context: CalendarContextValue = {
    dataset,
    value,
    valueRange,
    isDisabled: () => local.disabled ?? false,
    isReadOnly: () => local.readOnly ?? false,
    isDragging,
    isCellUnavailable,
    isCellDisabled,
    isCellSelected,
    isCellFocused,
    isCellInvalid,
    validationState,
    startDate,
    endDate,
    anchorDate,
    focusedDate: () => focusedDate()!,
    visibleDuration: () => local.visibleDuration!,
    selectionMode: () => local.selectionMode!,
    locale: () => local.locale,
    highlightedRange,
    direction,
    min,
    max,
    timeZone,
    messageFormatter,
    setStartDate,
    setAnchorDate,
    setIsFocused,
    setIsDragging,
    selectFocusedDate,
    selectDate,
    highlightDate,
    focusCell,
    focusNextDay,
    focusPreviousDay,
    focusNextPage,
    focusPreviousPage,
    focusNextRow,
    focusPreviousRow,
    focusSectionStart,
    focusSectionEnd,
    focusNextSection,
    focusPreviousSection,
    getDatesInWeek,
  };

  return (
    <CalendarContext.Provider value={context}>
      <Polymorphic
        ref={mergeRefs(el => (ref = el), local.ref)}
        as="div"
        role="group"
        aria-label={ariaLabel()}
        onFocusOut={onFocusOut}
        {...others}
      />
    </CalendarContext.Provider>
  );
}

function convertValue(newValue: DateValue, oldValue?: DateValue): DateValue {
  // The display calendar should not have any effect on the emitted value.
  // Emit dates in the same calendar as the original value, if any, otherwise gregorian.
  newValue = toCalendar(newValue, oldValue?.calendar || new GregorianCalendar());

  // Preserve time if the input value had one.
  if (oldValue && "hour" in oldValue) {
    return oldValue.set(newValue);
  }

  return newValue;
}
