import { createContext, useContext } from "solid-js";

import { DateFieldOptions, SegmentType } from "./types";

export interface DatePickerInputContextValue {
  increment(type: SegmentType): void;
  decrement(type: SegmentType): void;
  incrementPage(type: SegmentType): void;
  decrementPage(type: SegmentType): void;
  setSegment(type: SegmentType, value: number): void;
  clearSegment(type: SegmentType): void;
  formatValue(fieldOptions: DateFieldOptions): string;
}

export const DatePickerInputContext = createContext<DatePickerInputContextValue>();

export function useDatePickerInputContext() {
  const context = useContext(DatePickerInputContext);

  if (context === undefined) {
    throw new Error(
      "[kobalte]: `useDatePickerInputContext` must be used within a `DatePicker.Input` component"
    );
  }

  return context;
}
