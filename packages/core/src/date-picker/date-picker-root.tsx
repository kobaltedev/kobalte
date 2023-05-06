/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/950d45db36e63851f411ed0dc6a5aad0af57da68/packages/@react-types/datepicker/src/index.d.ts
 */

import {
  Calendar,
  CalendarDate,
  DateDuration,
  DateFormatter,
  toCalendarDate,
  toCalendarDateTime,
} from "@internationalized/date";
import {
  access,
  createFocusManager,
  createGenerateId,
  mergeDefaultProps,
  OverrideComponentProps,
  RangeValue,
  ValidationState,
} from "@kobalte/utils";
import {
  Accessor,
  createEffect,
  createMemo,
  createSignal,
  createUniqueId,
  JSX,
  on,
  splitProps,
} from "solid-js";

import {
  CalendarMultipleSelectionOptions,
  CalendarRangeSelectionOptions,
  CalendarSingleSelectionOptions,
} from "../calendar/calendar-root";
import { DateValue, TimeValue } from "../calendar/types";
import { createFormControl, FORM_CONTROL_PROP_NAMES, FormControlContext } from "../form-control";
import { createMessageFormatter, getReadingDirection, useLocale } from "../i18n";
import { AsChildProp, Polymorphic } from "../polymorphic";
import { PopperRoot, PopperRootOptions } from "../popper";
import {
  createControllableArraySignal,
  createControllableSignal,
  createDisclosureState,
  createFormResetListener,
  createPresence,
  createRegisterId,
} from "../primitives";
import { DATE_PICKER_INTL_MESSAGES } from "./date-picker.intl";
import {
  DatePickerContext,
  DatePickerContextValue,
  DatePickerDataSet,
} from "./date-picker-context";
import { DateFieldGranularity, DateTimeFormatOptions } from "./types";
import { createDefaultProps, getDateTimeFormatOptions, getPlaceholderTime } from "./utils";
import {
  asArrayValue,
  asRangeValue,
  asSingleValue,
  getArrayValueOfSelection,
  getFirstValueOfSelection,
  isDateInvalid,
} from "../calendar/utils";

export type DatePickerRootOptions = (
  | CalendarSingleSelectionOptions
  | CalendarMultipleSelectionOptions
  | CalendarRangeSelectionOptions
) &
  Omit<PopperRootOptions, "anchorRef" | "contentRef" | "onCurrentPlacementChange"> &
  AsChildProp & {
    /**
     * A function that creates a [Calendar](https://react-spectrum.adobe.com/internationalized/date/Calendar.html)
     * object for a given calendar identifier. Such a function may be imported from the
     * `@internationalized/date` package, or manually implemented to include support for
     * only certain calendars.
     */
    createCalendar: (name: string) => Calendar;

    /** The locale to display and edit the value according to. */
    locale?: string;

    /**
     * The amount of days that will be displayed at once.
     * This affects how pagination works.
     */
    visibleDuration?: DateDuration;

    /** The controlled open state of the date picker. */
    open?: boolean;

    /**
     * The default open state when initially rendered.
     * Useful when you do not need to control the open state.
     */
    defaultOpen?: boolean;

    /** Event handler called when the open state of the date picker changes. */
    onOpenChange?: (isOpen: boolean) => void;

    /** The minimum allowed date that a user may select. */
    minValue?: DateValue;

    /** The maximum allowed date that a user may select. */
    maxValue?: DateValue;

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

    /** Whether the date picker should close automatically when a date is selected. */
    closeOnSelect?: boolean;

    /**
     * A placeholder date that influences the format of the placeholder shown when no value is selected.
     * Defaults to today's date at midnight.
     */
    placeholderValue?: DateValue;

    /**
     * Whether to display the time in 12 or 24-hour format.
     * By default, this is determined by the user's locale.
     */
    hourCycle?: 12 | 24;

    /**
     * Determines the smallest unit that is displayed in the date picker.
     * By default, this is `"day"` for dates, and `"minute"` for times.
     */
    granularity?: DateFieldGranularity;

    /** Whether to hide the time zone abbreviation. */
    hideTimeZone?: boolean;

    /**
     * Whether the date picker should be the only visible content for screen readers.
     * When set to `true`:
     * - interaction with outside elements will be disabled.
     * - scroll will be locked.
     * - focus will be locked inside the select content.
     * - elements outside the date picker content will not be visible for screen readers.
     */
    modal?: boolean;

    /**
     * Used to force mounting the date picker (portal, positioner and content) when more control is needed.
     * Useful when controlling animation with SolidJS animation libraries.
     */
    forceMount?: boolean;

    /**
     * A unique identifier for the component.
     * The id is used to generate id attributes for nested components.
     * If no id prop is provided, a generated id will be used.
     */
    id?: string;

    /**
     * The name of the date picker.
     * Submitted with its owning form as part of a name/value pair.
     */
    name?: string;

    /** Whether the date picker should display its "valid" or "invalid" visual styling. */
    validationState?: ValidationState;

    /** Whether the user must select a date before the owning form can be submitted. */
    required?: boolean;

    /** Whether the date picker is disabled. */
    disabled?: boolean;

    /** Whether the date picker is read only. */
    readOnly?: boolean;

    /** The children of the date picker. */
    children?: JSX.Element;
  };

export type DatePickerRootProps = OverrideComponentProps<"div", DatePickerRootOptions>;

/**
 * A date picker combines a `DateField` and a `Calendar` popover to allow users to enter or select a date and time value.
 */
export function DatePickerRoot(props: DatePickerRootProps) {
  const defaultId = `date-picker-${createUniqueId()}`;

  props = mergeDefaultProps(
    {
      id: defaultId,
      visibleDuration: { months: 1 },
      selectionMode: "single",
      gutter: 8,
      sameWidth: false,
      modal: false,
      placement: "bottom-start",
    },
    props
  );

  const [local, popperProps, formControlProps, others] = splitProps(
    props,
    [
      "locale",
      "createCalendar",
      "visibleDuration",
      "selectionMode",
      "isDateUnavailable",
      "allowsNonContiguousRanges",
      "closeOnSelect",
      "minValue",
      "maxValue",
      "placeholderValue",
      "hourCycle",
      "granularity",
      "hideTimeZone",
      "open",
      "defaultOpen",
      "onOpenChange",
      "value",
      "defaultValue",
      "onChange",
      "modal",
      "forceMount",
    ],
    [
      "getAnchorRect",
      "placement",
      "gutter",
      "shift",
      "flip",
      "slide",
      "overlap",
      "sameWidth",
      "fitViewport",
      "hideWhenDetached",
      "detachedPadding",
      "arrowPadding",
      "overflowPadding",
    ],
    FORM_CONTROL_PROP_NAMES
  );

  const [triggerId, setTriggerId] = createSignal<string>();
  const [contentId, setContentId] = createSignal<string>();

  const [controlRef, setControlRef] = createSignal<HTMLDivElement>();
  const [triggerRef, setTriggerRef] = createSignal<HTMLButtonElement>();
  const [contentRef, setContentRef] = createSignal<HTMLDivElement>();

  const messageFormatter = createMessageFormatter(() => DATE_PICKER_INTL_MESSAGES);

  const locale = createMemo(() => {
    return local.locale ?? useLocale().locale();
  });

  const direction = createMemo(() => {
    return getReadingDirection(locale());
  });

  const closeOnSelect = createMemo(() => {
    return local.closeOnSelect ?? local.selectionMode !== "multiple";
  });

  const [value, setValue] = createControllableSignal<
    DateValue | DateValue[] | RangeValue<DateValue> | undefined
  >({
    value: () => local.value,
    defaultValue: () => local.defaultValue,
    onChange: value => local.onChange?.(value as any),
  });

  // The date portion of the selected date, dates or range.
  const [selectedDate, setSelectedDate] = createSignal<
    DateValue | DateValue[] | RangeValue<DateValue> | undefined
  >();

  // The time portion of the selected date or range.
  const [selectedTime, setSelectedTime] = createSignal<
    TimeValue | RangeValue<TimeValue> | undefined
  >();

  const disclosureState = createDisclosureState({
    open: () => local.open,
    defaultOpen: () => local.defaultOpen,
    onOpenChange: isOpen => local.onOpenChange?.(isOpen),
  });

  const { granularity, defaultTimeZone } = createDefaultProps({
    value: () => getFirstValueOfSelection(local.selectionMode, value()) ?? local.placeholderValue,
    granularity: () => local.granularity,
  });

  const contentPresence = createPresence(() => local.forceMount || disclosureState.isOpen());

  const { formControlContext } = createFormControl(formControlProps);

  createFormResetListener(contentRef, () => {
    setValue(local.defaultValue);
  });

  const hasTime = createMemo(() => {
    return granularity() === "hour" || granularity() === "minute" || granularity() === "second";
  });

  const validationState = createMemo(() => {
    if (formControlProps.validationState) {
      return formControlProps.validationState;
    }

    const values = getArrayValueOfSelection(local.selectionMode, value());

    if (values.length <= 0) {
      return undefined;
    }

    const isSomeDateInvalid = values.some(date => {
      return local.isDateUnavailable?.(date) || isDateInvalid(date, local.minValue, local.maxValue);
    });

    return isSomeDateInvalid ? "invalid" : undefined;
  });

  const formattedValue = createMemo(() => {
    const firstValue = getFirstValueOfSelection(local.selectionMode, value());

    if (!firstValue) {
      return "";
    }

    const formatOptions = getDateTimeFormatOptions(
      { month: "long" },
      {
        granularity: granularity(),
        timeZone: defaultTimeZone(),
        hideTimeZone: local.hideTimeZone,
        hourCycle: local.hourCycle,
        showEra: firstValue.calendar.identifier === "gregory" && firstValue.era === "BC",
      }
    );

    const formatter = new DateFormatter(locale(), formatOptions);

    const formatDate = (date: DateValue | undefined) => {
      return date ? formatter.format(date.toDate(defaultTimeZone() ?? "UTC")) : "";
    };

    let formattedValue: string | undefined;

    if (local.selectionMode === "single") {
      formattedValue = formatDate(asSingleValue(value()));
    } else if (local.selectionMode === "multiple") {
      formattedValue = asArrayValue(value())?.map(formatDate).join(", ");
    } else if (local.selectionMode === "range") {
      // TODO: RangeDatePicker
    }

    return formattedValue ?? "";
  });

  const ariaDescribedBy = () => {
    let description = "";

    if (local.selectionMode === "single" || local.selectionMode === "multiple") {
      description = messageFormatter().format("selectedDateDescription", { date: formattedValue });
    } else if (local.selectionMode === "range") {
      // TODO: RangeDatePicker
    }

    return formControlContext.getAriaDescribedBy(description);
  };

  const commitSingleValue = (date: DateValue, time: TimeValue) => {
    setValue("timeZone" in time ? time.set(toCalendarDate(date)) : toCalendarDateTime(date, time));
  };

  const commitRangeValue = (dateRange: RangeValue<DateValue>, timeRange: RangeValue<TimeValue>) => {
    // TODO: RangeDatePicker
  };

  // Intercept `setValue` to make sure the Time section is not changed by date selection in Calendar.
  const selectDate = (newValue: DateValue | DateValue[] | RangeValue<DateValue>) => {
    if (local.selectionMode === "single") {
      if (hasTime()) {
        const resolvedSelectedTime = selectedTime() as TimeValue | undefined;

        if (resolvedSelectedTime || closeOnSelect()) {
          commitSingleValue(
            newValue as DateValue,
            resolvedSelectedTime || getPlaceholderTime(local.placeholderValue)
          );
        } else {
          setSelectedDate(newValue as DateValue);
        }
      } else {
        setValue(newValue);
      }

      if (closeOnSelect()) {
        disclosureState.close();
      }
    } else if (local.selectionMode === "multiple") {
      setValue(newValue);
    } else if (local.selectionMode === "range") {
      // TODO: RangeDatePicker
    }
  };

  const selectTime = (newValue: TimeValue | RangeValue<TimeValue>) => {
    if (local.selectionMode === "single") {
      const resolvedSelectedDate = selectedDate() as DateValue | undefined;

      if (resolvedSelectedDate) {
        commitSingleValue(resolvedSelectedDate, newValue as TimeValue);
      } else {
        setSelectedTime(newValue);
      }
    } else if (local.selectionMode === "range") {
      // TODO: RangeDatePicker
    }
  };

  const close = () => {
    if (local.selectionMode === "single") {
      const resolvedSelectedDate = selectedDate() as DateValue | undefined;
      const resolvedSelectedTime = selectedTime() as TimeValue | undefined;

      // Commit the selected date when the calendar is closed. Use a placeholder time if one wasn't set.
      // If only the time was set and not the date, don't commit.
      // The state will be preserved until the user opens the popover again.
      if (!value() && resolvedSelectedDate && hasTime()) {
        commitSingleValue(
          resolvedSelectedDate,
          resolvedSelectedTime || getPlaceholderTime(local.placeholderValue)
        );
      }
    } else if (local.selectionMode === "range") {
      // TODO: RangeDatePicker
    }

    disclosureState.close();
  };

  const toggle = () => {
    if (disclosureState.isOpen()) {
      close();
    } else {
      disclosureState.open();
    }
  };

  const dataset: Accessor<DatePickerDataSet> = createMemo(() => ({
    "data-expanded": disclosureState.isOpen() ? "" : undefined,
    "data-closed": !disclosureState.isOpen() ? "" : undefined,
  }));

  createEffect(
    on(value, value => {
      if (!value) {
        setSelectedDate(undefined);
        setSelectedTime(undefined);
        return;
      }

      if (local.selectionMode === "single") {
        setSelectedDate(value);

        if ("hour" in value) {
          setSelectedTime(value);
        }
      } else if (local.selectionMode === "multiple") {
        setSelectedDate(value);
      } else if (local.selectionMode === "range") {
        // TODO: RangeDatePicker
      }
    })
  );

  const context: DatePickerContextValue = {
    dataset,
    isOpen: disclosureState.isOpen,
    isDisabled: () => formControlContext.isDisabled() ?? false,
    isModal: () => local.modal ?? false,
    contentPresence,
    messageFormatter,
    visibleDuration: () => local.visibleDuration!,
    selectionMode: () => local.selectionMode!,
    allowsNonContiguousRanges: () => local.allowsNonContiguousRanges ?? false,
    placeholderValue: () => local.placeholderValue,
    minValue: () => local.minValue,
    maxValue: () => local.maxValue,
    locale,
    direction,
    ariaDescribedBy,
    validationState,
    dateValue: selectedDate,
    timeValue: selectedTime,
    triggerId,
    contentId,
    controlRef,
    triggerRef,
    contentRef,
    setControlRef,
    setTriggerRef,
    setContentRef,
    createCalendar: name => local.createCalendar(name),
    isDateUnavailable: date => local.isDateUnavailable?.(date) ?? false,
    setDateValue: selectDate,
    setTimeValue: selectTime,
    open: disclosureState.open,
    close,
    toggle,
    generateId: createGenerateId(() => access(formControlProps.id)!),
    registerTriggerId: createRegisterId(setTriggerId),
    registerContentId: createRegisterId(setContentId),
  };

  return (
    <FormControlContext.Provider value={formControlContext}>
      <DatePickerContext.Provider value={context}>
        <PopperRoot anchorRef={controlRef} contentRef={contentRef} {...popperProps}>
          <Polymorphic
            as="div"
            role="group"
            id={access(formControlProps.id)}
            {...formControlContext.dataset()}
            {...dataset()}
            {...others}
          />
        </PopperRoot>
      </DatePickerContext.Provider>
    </FormControlContext.Provider>
  );
}
