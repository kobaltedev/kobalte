import {
  Body as CalendarBody,
  type CalendarBodyProps as DatePickerCalendarBodyProps,
  type CalendarGridBodyCellOptions as DatePickerCalendarGridBodyCellOptions,
  type CalendarGridBodyCellProps as DatePickerCalendarGridBodyCellProps,
  type CalendarGridBodyCellTriggerOptions as DatePickerCalendarGridBodyCellTriggerOptions,
  type CalendarGridBodyCellTriggerProps as DatePickerCalendarGridBodyCellTriggerProps,
  type CalendarGridBodyOptions as DatePickerCalendarGridBodyOptions,
  type CalendarGridBodyProps as DatePickerCalendarGridBodyProps,
  type CalendarGridBodyRowOptions as DatePickerCalendarGridBodyRowOptions,
  type CalendarGridBodyRowProps as DatePickerCalendarGridBodyRowProps,
  type CalendarGridHeaderCellProps as DatePickerCalendarGridHeaderCellProps,
  type CalendarGridHeaderProps as DatePickerCalendarGridHeaderProps,
  type CalendarGridHeaderRowProps as DatePickerCalendarGridHeaderRowProps,
  type CalendarGridOptions as DatePickerCalendarGridOptions,
  type CalendarGridProps as DatePickerCalendarGridProps,
  type CalendarHeaderProps as DatePickerCalendarHeaderProps,
  type CalendarHeadingProps as DatePickerCalendarHeadingProps,
  type CalendarNextTriggerOptions as DatePickerCalendarNextTriggerOptions,
  type CalendarNextTriggerProps as DatePickerCalendarNextTriggerProps,
  type CalendarPrevTriggerOptions as DatePickerCalendarPrevTriggerOptions,
  type CalendarPrevTriggerProps as DatePickerCalendarPrevTriggerProps,
  Grid as CalendarGrid,
  GridBody as CalendarGridBody,
  GridBodyCell as CalendarGridBodyCell,
  GridBodyCellTrigger as CalendarGridBodyCellTrigger,
  GridBodyRow as CalendarGridBodyRow,
  GridHeader as CalendarGridHeader,
  GridHeaderCell as CalendarGridHeaderCell,
  GridHeaderRow as CalendarGridHeaderRow,
  Header as CalendarHeader,
  Heading as CalendarHeading,
  NextTrigger as CalendarNextTrigger,
  PrevTrigger as CalendarPrevTrigger,
} from "../calendar";
import {
  FormControlDescription as Description,
  type FormControlDescriptionProps as DatePickerDescriptionProps,
  FormControlErrorMessage as ErrorMessage,
  type FormControlErrorMessageOptions as DatePickerErrorMessageOptions,
  type FormControlErrorMessageProps as DatePickerErrorMessageProps,
} from "../form-control";
import {
  PopperArrow as Arrow,
  type PopperArrowOptions as DatePickerArrowOptions,
  type PopperArrowProps as DatePickerArrowProps,
} from "../popper";
import {
  DatePickerCalendar as Calendar,
  type DatePickerCalendarOptions,
  type DatePickerCalendarProps,
} from "./date-picker-calendar";
import {
  DatePickerContent as Content,
  type DatePickerContentOptions,
  type DatePickerContentProps,
} from "./date-picker-content";
import {
  DatePickerControl as Control,
  type DatePickerControlOptions,
  type DatePickerControlProps,
} from "./date-picker-control";
import { DatePickerPortal as Portal, type DatePickerPortalProps } from "./date-picker-portal";
import {
  DatePickerRoot as Root,
  type DatePickerRootOptions,
  type DatePickerRootProps,
} from "./date-picker-root";
import { DatePickerTrigger as Trigger, type DatePickerTriggerProps } from "./date-picker-trigger";

export type {
  DatePickerArrowOptions,
  DatePickerArrowProps,
  DatePickerCalendarBodyProps,
  DatePickerCalendarGridBodyCellOptions,
  DatePickerCalendarGridBodyCellProps,
  DatePickerCalendarGridBodyCellTriggerOptions,
  DatePickerCalendarGridBodyCellTriggerProps,
  DatePickerCalendarGridBodyOptions,
  DatePickerCalendarGridBodyProps,
  DatePickerCalendarGridBodyRowOptions,
  DatePickerCalendarGridBodyRowProps,
  DatePickerCalendarGridHeaderCellProps,
  DatePickerCalendarGridHeaderProps,
  DatePickerCalendarGridHeaderRowProps,
  DatePickerCalendarGridOptions,
  DatePickerCalendarGridProps,
  DatePickerCalendarHeaderProps,
  DatePickerCalendarHeadingProps,
  DatePickerCalendarNextTriggerOptions,
  DatePickerCalendarNextTriggerProps,
  DatePickerCalendarOptions,
  DatePickerCalendarPrevTriggerOptions,
  DatePickerCalendarPrevTriggerProps,
  DatePickerCalendarProps,
  DatePickerContentOptions,
  DatePickerContentProps,
  DatePickerControlOptions,
  DatePickerControlProps,
  DatePickerDescriptionProps,
  DatePickerErrorMessageOptions,
  DatePickerErrorMessageProps,
  DatePickerPortalProps,
  DatePickerRootOptions,
  DatePickerRootProps,
  DatePickerTriggerProps,
};

export {
  Arrow,
  Calendar,
  CalendarBody,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridBodyCell,
  CalendarGridBodyCellTrigger,
  CalendarGridBodyRow,
  CalendarGridHeader,
  CalendarGridHeaderCell,
  CalendarGridHeaderRow,
  CalendarHeader,
  CalendarHeading,
  CalendarNextTrigger,
  CalendarPrevTrigger,
  Content,
  Control,
  Description,
  ErrorMessage,
  Portal,
  Root,
  Trigger,
};

/*

<DatePicker.Root>
  <DatePicker.Label/>
  <DatePicker.Control>
    <DatePicker.Input> // DateField
      {segment => <DatePicker.Segment segment={segment} />}
    </DatePicker.Input>
    <DatePicker.Trigger/>
  </DatePicker.Control>
  <DatePicker.Description/>
  <DatePicker.ErrorMessage/>
  <DatePicker.Portal>
    <DatePicker.Content>
      <DatePicker.Arrow/>
      <DatePicker.Calendar>
        <DatePicker.CalendarHeader>
          <DatePicker.CalendarPrevTrigger/>
          <DatePicker.CalendarViewTrigger/>
          <DatePicker.CalendarNextTrigger/>
        </DatePicker.CalendarHeader>
        <DatePicker.CalendarBody>
          <DatePicker.CalendarGrid>
            <DatePicker.CalendarGridHeader>
              <DatePicker.CalendarGridHeaderRow>
                {weekDay => (
                  <DatePicker.CalendarGridHeaderCell>
                    {weekDay()}
                  </DatePicker.CalendarGridHeaderCell>
                )}
              </DatePicker.CalendarGridHeaderRow>
            </DatePicker.CalendarGridHeader>
            <DatePicker.CalendarGridBody>
              {weekIndex => (
                <DatePicker.CalendarGridBodyRow weekIndex={weekIndex()}>
                  {date => (
                    <DatePicker.CalendarGridBodyCell date={date()}>
                      <DatePicker.CalendarGridBodyCellTrigger/>
                    </DatePicker.CalendarGridBodyCell>
                  )}
                </DatePicker.CalendarGridBodyRow>
              )}
            </DatePicker.CalendarGridBody>
          </DatePicker.CalendarGrid>
        </DatePicker.CalendarBody>
      </DatePicker.Calendar>
    </DatePicker.Content>
  </DatePicker.Portal>
</DatePicker.Root>

*/
