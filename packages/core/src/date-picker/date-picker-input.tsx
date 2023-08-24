/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/99ca82e87ba2d7fdd54f5b49326fd242320b4b51/packages/%40react-stately/datepicker/src/useDateFieldState.ts
 * https://github.com/adobe/react-spectrum/blob/99ca82e87ba2d7fdd54f5b49326fd242320b4b51/packages/%40react-aria/datepicker/src/useDateField.ts
 */

import {
  DateFormatter,
  getMinimumDayInMonth,
  getMinimumMonthInYear,
  GregorianCalendar,
  toCalendar,
} from "@internationalized/date";
import { callHandler, mergeDefaultProps, mergeRefs, OverrideComponentProps } from "@kobalte/utils";
import {
  Accessor,
  createEffect,
  createMemo,
  createSignal,
  For,
  Index,
  JSX,
  on,
  splitProps,
} from "solid-js";

import { DateValue } from "../calendar/types";
import { asSingleValue } from "../calendar/utils";
import { useFormControlContext } from "../form-control";
import { AsChildProp, Polymorphic } from "../polymorphic";
import { useDatePickerContext } from "./date-picker-context";
import { DatePickerInputContext, DatePickerInputContextValue } from "./date-picker-input-context";
import { getPlaceholder } from "./placeholders";
import { DateFieldOptions, DateSegment, SegmentType } from "./types";
import {
  convertValue,
  createPlaceholderDate,
  FormatterOptions,
  getDateFieldFormatOptions,
} from "./utils";

const EDITABLE_SEGMENTS = {
  year: true,
  month: true,
  day: true,
  hour: true,
  minute: true,
  second: true,
  dayPeriod: true,
  era: true,
};

const PAGE_STEP = {
  year: 5,
  month: 2,
  day: 7,
  hour: 2,
  minute: 15,
  second: 15,
};

// Node seems to convert everything to lowercase...
const TYPE_MAPPING = {
  dayperiod: "dayPeriod",
};

export interface DatePickerInputOptions extends AsChildProp {
  children?: (segment: Accessor<DateSegment>) => JSX.Element;
}

export interface DatePickerInputProps
  extends OverrideComponentProps<"div", DatePickerInputOptions> {}

export function DatePickerInput(props: DatePickerInputProps) {
  let ref: HTMLDivElement | undefined;

  const formControlContext = useFormControlContext();
  const datePickerContext = useDatePickerContext();

  props = mergeDefaultProps(
    {
      id: datePickerContext.generateId("input"),
    },
    props,
  );

  const [local, others] = splitProps(props, [
    "ref",
    "children",
    "onFocusOut",
    "aria-labelledby",
    "aria-describedby",
  ]);

  const timeZone = createMemo(() => datePickerContext.defaultTimeZone() || "UTC");

  const defaultFormatter = createMemo(() => new DateFormatter(datePickerContext.locale()));

  const calendar = createMemo(() => {
    return datePickerContext.createCalendar(defaultFormatter().resolvedOptions().calendar);
  });

  const calendarValue = createMemo(() => {
    if (datePickerContext.selectionMode() === "single") {
      return convertValue(asSingleValue(datePickerContext.dateValue()), calendar());
    } else if (datePickerContext.selectionMode() === "multiple") {
      // TODO: MultipleDatePicker
    } else if (datePickerContext.selectionMode() === "range") {
      // TODO: RangeDatePicker
    }
  });

  // We keep track of the placeholder date separately in state so that onChange is not called
  // until all segments are set. If the value === null (not undefined), then assume the component
  // is controlled, so use the placeholder as the value until all segments are entered, so it doesn't
  // change from uncontrolled to controlled.
  const [placeholderDate, setPlaceholderDate] = createSignal(
    createPlaceholderDate(
      datePickerContext.placeholderValue(),
      datePickerContext.granularity(),
      calendar(),
      timeZone(),
    ),
  );

  const val = createMemo(() => calendarValue() || placeholderDate());

  const showEra = createMemo(() => calendar().identifier === "gregory" && val()?.era === "BC");

  const formatOpts: Accessor<FormatterOptions> = createMemo(() => ({
    granularity: datePickerContext.granularity(),
    maxGranularity: datePickerContext.maxGranularity() ?? "year",
    timeZone: datePickerContext.defaultTimeZone(),
    hideTimeZone: datePickerContext.hideTimeZone(),
    hourCycle: datePickerContext.hourCycle(),
    showEra: showEra(),
    shouldForceLeadingZeros: datePickerContext.shouldForceLeadingZeros(),
  }));

  const opts = createMemo(() => getDateFieldFormatOptions({}, formatOpts()));

  const dateFormatter = createMemo(() => new DateFormatter(datePickerContext.locale(), opts()));
  const resolvedOptions = createMemo(() => dateFormatter().resolvedOptions());

  const ariaLabelledBy = createMemo(() => {
    return formControlContext.getAriaLabelledBy(
      others.id,
      others["aria-label"],
      local["aria-labelledby"],
    );
  });

  const ariaDescribedBy = createMemo(() => {
    return [local["aria-describedby"], datePickerContext.ariaDescribedBy()]
      .filter(Boolean)
      .join(" ");
  });

  // Determine how many editable segments there are for validation purposes.
  // The result is cached for performance.
  const allSegments: Accessor<Partial<typeof EDITABLE_SEGMENTS>> = createMemo(() => {
    return dateFormatter()
      .formatToParts(new Date())
      .filter(segment => EDITABLE_SEGMENTS[segment.type as keyof typeof EDITABLE_SEGMENTS])
      .reduce(
        (acc, segment) => {
          acc[segment.type as keyof typeof EDITABLE_SEGMENTS] = true;
          return acc;
        },
        {} as Partial<typeof EDITABLE_SEGMENTS>,
      );
  });

  const [validSegments, setValidSegments] = createSignal<Partial<typeof EDITABLE_SEGMENTS>>(
    datePickerContext.value() ? { ...allSegments() } : {},
  );

  // If all segments are valid, use the date from state, otherwise use the placeholder date.
  const displayValue = createMemo(() => {
    return calendarValue() &&
      Object.keys(validSegments()).length >= Object.keys(allSegments()).length
      ? calendarValue()
      : placeholderDate();
  });

  const setValue = (newValue: DateValue) => {
    if (formControlContext.isDisabled() || formControlContext.isReadOnly()) {
      return;
    }

    if (datePickerContext.selectionMode() === "single") {
      if (Object.keys(validSegments()).length >= Object.keys(allSegments()).length) {
        const v = asSingleValue(datePickerContext.value() || datePickerContext.placeholderValue());

        // The display calendar should not have any effect on the emitted value.
        // Emit dates in the same calendar as the original value, if any, otherwise gregorian.
        datePickerContext.setDateValue(
          toCalendar(newValue, v?.calendar || new GregorianCalendar()),
        );
      } else {
        setPlaceholderDate(newValue);
      }
    } else if (datePickerContext.selectionMode() === "multiple") {
      // TODO: MultipleDatePicker
    } else if (datePickerContext.selectionMode() === "range") {
      // TODO: RangeDatePicker
    }
  };

  const dateValue = createMemo(() => displayValue()?.toDate(timeZone()));

  const segments = createMemo(() => {
    const resolvedDateValue = dateValue();
    const resolvedDisplayValue = displayValue();

    if (!resolvedDateValue || !resolvedDisplayValue) {
      return [];
    }

    return dateFormatter()
      .formatToParts(resolvedDateValue)
      .map(segment => {
        const isOriginallyEditable =
          EDITABLE_SEGMENTS[segment.type as keyof typeof EDITABLE_SEGMENTS];

        let isEditable = isOriginallyEditable;

        if (segment.type === "era" && calendar().getEras().length === 1) {
          isEditable = false;
        }

        const isPlaceholder = isOriginallyEditable && !(validSegments() as any)[segment.type];

        const placeholder = isOriginallyEditable
          ? getPlaceholder(segment.type, segment.value, datePickerContext.locale())
          : null;

        return {
          type: TYPE_MAPPING[segment.type as keyof typeof TYPE_MAPPING] || segment.type,
          text: isPlaceholder ? placeholder : segment.value,
          ...getSegmentLimits(resolvedDisplayValue, segment.type, resolvedOptions()),
          isPlaceholder,
          placeholder,
          isEditable,
        } as DateSegment;
      });
  });

  const markValid = (part: Intl.DateTimeFormatPartTypes) => {
    setValidSegments(prev => {
      const newValue = { ...prev, [part]: true };

      if (part === "year" && allSegments().era) {
        newValue.era = true;
      }

      return newValue;
    });
  };

  const adjustSegment = (type: Intl.DateTimeFormatPartTypes, amount: number) => {
    const resolvedDisplayValue = displayValue();

    if (!(validSegments() as any)[type]) {
      markValid(type);
      if (
        resolvedDisplayValue &&
        Object.keys(validSegments()).length >= Object.keys(allSegments()).length
      ) {
        setValue(resolvedDisplayValue);
      }
    } else if (resolvedDisplayValue) {
      const newValue = addSegment(resolvedDisplayValue, type, amount, resolvedOptions());

      if (newValue) {
        setValue(newValue);
      }
    }
  };

  /**
   * Increments the given segment.
   * Upon reaching the minimum or maximum value, the value wraps around to the opposite limit.
   */
  const increment = (part: SegmentType) => {
    adjustSegment(part, 1);
  };

  /**
   * Decrements the given segment.
   * Upon reaching the minimum or maximum value, the value wraps around to the opposite limit.
   */
  const decrement = (part: SegmentType) => {
    adjustSegment(part, -1);
  };

  /**
   * Increments the given segment by a larger amount, rounding it to the nearest increment.
   * The amount to increment by depends on the field, for example 15 minutes, 7 days, and 5 years.
   * Upon reaching the minimum or maximum value, the value wraps around to the opposite limit.
   */
  const incrementPage = (part: SegmentType) => {
    adjustSegment(part, PAGE_STEP[part as keyof typeof PAGE_STEP] || 1);
  };

  /**
   * Decrements the given segment by a larger amount, rounding it to the nearest increment.
   * The amount to decrement by depends on the field, for example 15 minutes, 7 days, and 5 years.
   * Upon reaching the minimum or maximum value, the value wraps around to the opposite limit.
   */
  const decrementPage = (part: SegmentType) => {
    adjustSegment(part, -(PAGE_STEP[part as keyof typeof PAGE_STEP] || 1));
  };

  /** Sets the value of the given segment. */
  const setSegment = (part: SegmentType, value: number) => {
    markValid(part);

    const resolvedDisplayValue = displayValue();

    if (resolvedDisplayValue) {
      const newValue = setSegmentBase(resolvedDisplayValue, part, value, resolvedOptions());

      if (newValue) {
        setValue(newValue);
      }
    }
  };

  /** Clears the value of the given segment, reverting it to the placeholder. */
  const clearSegment = (part: SegmentType) => {
    setValidSegments(prev => {
      const newValue = { ...prev };
      delete newValue[part as keyof typeof newValue];
      return newValue;
    });

    const placeholder = createPlaceholderDate(
      datePickerContext.placeholderValue(),
      datePickerContext.granularity(),
      calendar(),
      timeZone(),
    );

    const resolvedDisplayValue = displayValue();
    let value = resolvedDisplayValue;

    // Reset day period to default without changing the hour.
    if (resolvedDisplayValue && placeholder) {
      if (part === "dayPeriod" && "hour" in resolvedDisplayValue && "hour" in placeholder) {
        const isPM = resolvedDisplayValue.hour >= 12;
        const shouldBePM = placeholder.hour >= 12;

        if (isPM && !shouldBePM) {
          value = resolvedDisplayValue.set({ hour: resolvedDisplayValue.hour - 12 });
        } else if (!isPM && shouldBePM) {
          value = resolvedDisplayValue.set({ hour: resolvedDisplayValue.hour + 12 });
        }
      } else if (part in resolvedDisplayValue) {
        value = resolvedDisplayValue.set({ [part]: placeholder[part as keyof typeof placeholder] });
      }
    }

    datePickerContext.setDateValue(undefined);

    if (value) {
      setValue(value);
    }
  };

  /** Formats the current date value using the given options. */
  const formatValue = (fieldOptions: DateFieldOptions) => {
    const resolvedDateValue = dateValue();

    if (!calendarValue() || !resolvedDateValue) {
      return "";
    }

    const formatOptions = getDateFieldFormatOptions(fieldOptions, formatOpts());
    const formatter = new DateFormatter(datePickerContext.locale(), formatOptions);
    return formatter.format(resolvedDateValue);
  };

  const onFocusOut: JSX.EventHandlerUnion<HTMLDivElement, FocusEvent> = e => {
    callHandler(e, local.onFocusOut);

    if (formControlContext.isDisabled() || formControlContext.isReadOnly()) {
      return;
    }

    // Confirm the placeholder if only the day period is not filled in.
    const validKeys = Object.keys(validSegments());
    const allKeys = Object.keys(allSegments());

    if (
      validKeys.length === allKeys.length - 1 &&
      allSegments().dayPeriod &&
      !validSegments().dayPeriod
    ) {
      setValidSegments({ ...allSegments() });

      const resolvedDisplayValue = displayValue();

      if (resolvedDisplayValue) {
        setValue(resolvedDisplayValue.copy());
      }
    }
  };

  // Reset placeholder when calendar changes
  createEffect(
    on(
      [
        calendar,
        timeZone,
        validSegments,
        () => datePickerContext.placeholderValue(),
        () => datePickerContext.granularity(),
      ],
      ([calendar, timeZone, validSegments, placeholderValue, granularity]) => {
        setPlaceholderDate(placeholder => {
          return Object.keys(validSegments).length > 0
            ? convertValue(placeholder, calendar)
            : createPlaceholderDate(placeholderValue, granularity, calendar, timeZone);
        });
      },
    ),
  );

  // If there is a value prop, and some segments were previously placeholders, mark them all as valid.
  createEffect(() => {
    if (
      datePickerContext.value() &&
      Object.keys(validSegments()).length < Object.keys(allSegments()).length
    ) {
      setValidSegments({ ...allSegments() });
    }
  });

  // If the value is set to null and all segments are valid, reset the placeholder.
  createEffect(() => {
    if (
      datePickerContext.value() == null
      // && Object.keys(validSegments()).length === Object.keys(allSegments()).length
    ) {
      setValidSegments({});
      setPlaceholderDate(
        createPlaceholderDate(
          datePickerContext.placeholderValue(),
          datePickerContext.granularity(),
          calendar(),
          timeZone(),
        ),
      );
    }
  });

  // When the era field appears, mark it valid if the year field is already valid.
  // If the era field disappears, remove it from the valid segments.
  createEffect(() => {
    if (allSegments().era && validSegments().year && !validSegments().era) {
      setValidSegments(prev => ({
        ...prev,
        era: true,
      }));
    } else if (!allSegments().era && validSegments().era) {
      setValidSegments(prev => {
        const newValue = { ...prev };
        delete newValue.era;
        return newValue;
      });
    }
  });

  const context: DatePickerInputContextValue = {
    calendar,
    dateValue,
    dateFormatterResolvedOptions: resolvedOptions,
    ariaLabel: () => others["aria-label"],
    ariaLabelledBy,
    ariaDescribedBy,
    segments,
    increment,
    decrement,
    incrementPage,
    decrementPage,
    setSegment,
    clearSegment,
    formatValue,
  };

  return (
    <DatePickerInputContext.Provider value={context}>
      <Polymorphic
        as="div"
        role="presentation"
        ref={mergeRefs(el => (ref = el), local.ref)}
        onFocusOut={onFocusOut}
        aria-labelledby={ariaLabelledBy()}
        aria-describedby={ariaDescribedBy()}
        {...datePickerContext.dataset()}
        {...formControlContext.dataset()}
        {...others}
      >
        <Index each={segments()}>{segment => local.children?.(segment)}</Index>
      </Polymorphic>
    </DatePickerInputContext.Provider>
  );
}

function getSegmentLimits(
  date: DateValue,
  type: string,
  options: Intl.ResolvedDateTimeFormatOptions,
) {
  switch (type) {
    case "era": {
      const eras = date.calendar.getEras();
      return {
        value: eras.indexOf(date.era),
        minValue: 0,
        maxValue: eras.length - 1,
      };
    }
    case "year":
      return {
        value: date.year,
        minValue: 1,
        maxValue: date.calendar.getYearsInEra(date),
      };
    case "month":
      return {
        value: date.month,
        minValue: getMinimumMonthInYear(date),
        maxValue: date.calendar.getMonthsInYear(date),
      };
    case "day":
      return {
        value: date.day,
        minValue: getMinimumDayInMonth(date),
        maxValue: date.calendar.getDaysInMonth(date),
      };
  }

  if ("hour" in date) {
    switch (type) {
      case "dayPeriod":
        return {
          value: date.hour >= 12 ? 12 : 0,
          minValue: 0,
          maxValue: 12,
        };
      case "hour":
        if (options.hour12) {
          const isPM = date.hour >= 12;
          return {
            value: date.hour,
            minValue: isPM ? 12 : 0,
            maxValue: isPM ? 23 : 11,
          };
        }

        return {
          value: date.hour,
          minValue: 0,
          maxValue: 23,
        };
      case "minute":
        return {
          value: date.minute,
          minValue: 0,
          maxValue: 59,
        };
      case "second":
        return {
          value: date.second,
          minValue: 0,
          maxValue: 59,
        };
    }
  }

  return {};
}

function addSegment(
  value: DateValue,
  part: string,
  amount: number,
  options: Intl.ResolvedDateTimeFormatOptions,
) {
  switch (part) {
    case "era":
    case "year":
    case "month":
    case "day":
      return value.cycle(part, amount, { round: part === "year" });
  }

  if ("hour" in value) {
    switch (part) {
      case "dayPeriod": {
        const hours = value.hour;
        const isPM = hours >= 12;
        return value.set({ hour: isPM ? hours - 12 : hours + 12 });
      }
      case "hour":
      case "minute":
      case "second":
        return value.cycle(part, amount, {
          round: part !== "hour",
          hourCycle: options.hour12 ? 12 : 24,
        });
    }
  }
}

function setSegmentBase(
  value: DateValue,
  part: string,
  segmentValue: number,
  options: Intl.ResolvedDateTimeFormatOptions,
) {
  switch (part) {
    case "day":
    case "month":
    case "year":
    case "era":
      return value.set({ [part]: segmentValue });
  }

  if ("hour" in value) {
    switch (part) {
      case "dayPeriod": {
        const hours = value.hour;
        const wasPM = hours >= 12;
        const isPM = segmentValue >= 12;
        if (isPM === wasPM) {
          return value;
        }
        return value.set({ hour: wasPM ? hours - 12 : hours + 12 });
      }
      case "hour":
        // In 12 hour time, ensure that AM/PM does not change
        if (options.hour12) {
          const hours = value.hour;
          const wasPM = hours >= 12;
          if (!wasPM && segmentValue === 12) {
            segmentValue = 0;
          }
          if (wasPM && segmentValue < 12) {
            segmentValue += 12;
          }
        }
      // fallthrough
      case "minute":
      case "second":
        return value.set({ [part]: segmentValue });
    }
  }
}
