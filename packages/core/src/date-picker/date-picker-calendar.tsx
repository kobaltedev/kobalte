import { mergeDefaultProps, OverrideComponentProps } from "@kobalte/utils";

import { CalendarRoot } from "../calendar/calendar-root";
import { useFormControlContext } from "../form-control";
import { AsChildProp } from "../polymorphic";
import { useDatePickerContext } from "./date-picker-context";

export interface DatePickerCalendarOptions extends AsChildProp {}

export type DatePickerCalendarProps = Omit<
  OverrideComponentProps<"div", DatePickerCalendarOptions>,
  "onChange"
>;

export function DatePickerCalendar(props: DatePickerCalendarProps) {
  const formControlContext = useFormControlContext();
  const context = useDatePickerContext();

  props = mergeDefaultProps(
    {
      id: context.generateId("calendar"),
    },
    props,
  );

  return (
    <CalendarRoot
      autoFocus
      selectionMode={context.selectionMode() as any}
      value={context.dateValue() as any}
      onChange={context.setDateValue as any}
      locale={context.locale()}
      createCalendar={context.createCalendar}
      isDateUnavailable={context.isDateUnavailable}
      visibleDuration={context.visibleDuration()}
      allowsNonContiguousRanges={context.allowsNonContiguousRanges()}
      defaultFocusedValue={context.dateValue() ? undefined : context.placeholderValue()}
      minValue={context.minValue()}
      maxValue={context.maxValue()}
      disabled={formControlContext.isDisabled()}
      readOnly={formControlContext.isReadOnly()}
      validationState={context.validationState()}
      {...props}
    />
  );
}
