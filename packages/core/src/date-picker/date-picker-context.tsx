import { Calendar, CalendarDate, DateDuration } from "@internationalized/date";
import { Accessor, createContext, JSX, useContext } from "solid-js";

import { CalendarSelectionMode, DateValue, TimeValue } from "../calendar/types";
import { Direction, LocalizedMessageFormatter } from "../i18n";
import { CreatePresenceResult } from "../primitives";
import { RangeValue, ValidationState } from "@kobalte/utils";

export interface DatePickerDataSet {
  "data-expanded": string | undefined;
  "data-closed": string | undefined;
}

export interface DatePickerContextValue {
  dataset: Accessor<DatePickerDataSet>;
  isOpen: Accessor<boolean>;
  isDisabled: Accessor<boolean>;
  isModal: Accessor<boolean>;
  contentPresence: CreatePresenceResult;
  messageFormatter: Accessor<LocalizedMessageFormatter>;
  visibleDuration: Accessor<DateDuration>;
  allowsNonContiguousRanges: Accessor<boolean>;
  selectionMode: Accessor<CalendarSelectionMode>;
  minValue: Accessor<DateValue | undefined>;
  maxValue: Accessor<DateValue | undefined>;
  placeholderValue: Accessor<DateValue | undefined>;
  locale: Accessor<string>;
  direction: Accessor<Direction>;
  ariaDescribedBy: Accessor<string | undefined>;
  validationState: Accessor<ValidationState | undefined>;
  dateValue: Accessor<DateValue | DateValue[] | RangeValue<DateValue> | undefined>;
  timeValue: Accessor<TimeValue | RangeValue<TimeValue> | undefined>;
  triggerId: Accessor<string | undefined>;
  contentId: Accessor<string | undefined>;
  controlRef: Accessor<HTMLDivElement | undefined>;
  triggerRef: Accessor<HTMLButtonElement | undefined>;
  contentRef: Accessor<HTMLDivElement | undefined>;
  setControlRef: (el: HTMLDivElement) => void;
  setTriggerRef: (el: HTMLButtonElement) => void;
  setContentRef: (el: HTMLDivElement) => void;
  createCalendar: (name: string) => Calendar;
  isDateUnavailable: (date: DateValue) => boolean;
  setDateValue: (newValue: DateValue | DateValue[] | RangeValue<DateValue>) => void;
  setTimeValue: (newValue: TimeValue | RangeValue<TimeValue>) => void;
  open: () => void;
  close: () => void;
  toggle: () => void;
  generateId: (part: string) => string;
  registerTriggerId: (id: string) => () => void;
  registerContentId: (id: string) => () => void;
}

export const DatePickerContext = createContext<DatePickerContextValue>();

export function useDatePickerContext() {
  const context = useContext(DatePickerContext);

  if (context === undefined) {
    throw new Error(
      "[kobalte]: `useDatePickerContext` must be used within a `DatePicker` component"
    );
  }

  return context;
}
