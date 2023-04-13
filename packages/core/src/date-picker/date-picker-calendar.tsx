import { mergeDefaultProps, OverrideComponentProps } from "@kobalte/utils";

import { CalendarBase, CalendarBaseOptions } from "../calendar/calendar-base";
import { useFormControlContext } from "../form-control";
import { useDatePickerContext } from "./date-picker-context";

export interface DatePickerCalendarOptions extends Partial<CalendarBaseOptions> {}

export type DatePickerCalendarProps = OverrideComponentProps<"div", DatePickerCalendarOptions>;

export function DatePickerCalendar(props: DatePickerCalendarProps) {
  const formControlContext = useFormControlContext();
  const context = useDatePickerContext();

  props = mergeDefaultProps(
    {
      id: context.generateId("calendar"),
    },
    props
  );

  return (
    <CalendarBase
      autoFocus
      locale={context.locale()}
      createCalendar={context.createCalendar}
      isDateUnavailable={context.isDateUnavailable}
      visibleDuration={context.visibleDuration()}
      selectionMode={context.selectionMode()}
      allowsNonContiguousRanges={context.allowsNonContiguousRanges()}
      minValue={context.minValue()}
      maxValue={context.maxValue()}
      disabled={formControlContext.isDisabled()}
      readOnly={formControlContext.isReadOnly()}
      validationState={formControlContext.validationState()}
      {...props}
    />
  );
}
