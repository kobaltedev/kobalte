import {
	Body as CalendarBody,
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
} from "../calendar/index.tsx";
import {
	type FormControlDescriptionCommonProps as DatePickerDescriptionCommonProps,
	type FormControlDescriptionOptions as DatePickerDescriptionOptions,
	type FormControlDescriptionProps as DatePickerDescriptionProps,
	type FormControlDescriptionRenderProps as DatePickerDescriptionRenderProps,
	type FormControlErrorMessageCommonProps as DatePickerErrorMessageCommonProps,
	type FormControlErrorMessageOptions as DatePickerErrorMessageOptions,
	type FormControlErrorMessageProps as DatePickerErrorMessageProps,
	type FormControlErrorMessageRenderProps as DatePickerErrorMessageRenderProps,
	type FormControlLabelCommonProps as DatePickerLabelCommonProps,
	type FormControlLabelOptions as DatePickerLabelOptions,
	type FormControlLabelProps as DatePickerLabelProps,
	type FormControlLabelRenderProps as DatePickerLabelRenderProps,
	FormControlDescription as Description,
	FormControlErrorMessage as ErrorMessage,
	FormControlLabel as Label,
} from "../form-control/index.ts";
import {
	Anchor,
	Arrow,
	CloseButton,
	Content,
	type PopoverAnchorCommonProps as DatePickerAnchorCommonProps,
	type PopoverAnchorOptions as DatePickerAnchorOptions,
	type PopoverAnchorProps as DatePickerAnchorProps,
	type PopoverAnchorRenderProps as DatePickerAnchorRenderProps,
	type PopoverArrowOptions as DatePickerArrowOptions,
	type PopoverArrowProps as DatePickerArrowProps,
	type PopoverCloseButtonCommonProps as DatePickerCloseButtonCommonProps,
	type PopoverCloseButtonOptions as DatePickerCloseButtonOptions,
	type PopoverCloseButtonProps as DatePickerCloseButtonProps,
	type PopoverCloseButtonRenderProps as DatePickerCloseButtonRenderProps,
	type PopoverContentCommonProps as DatePickerContentCommonProps,
	type PopoverContentOptions as DatePickerContentOptions,
	type PopoverContentProps as DatePickerContentProps,
	type PopoverContentRenderProps as DatePickerContentRenderProps,
	type PopoverPortalProps as DatePickerPortalProps,
	Portal,
} from "../popover/index.tsx";
import {
	DatePickerCalendar as Calendar,
	type DatePickerCalendarOptions,
	type DatePickerCalendarProps,
} from "./date-picker-calendar.tsx";
import {
	type DatePickerRootOptions,
	type DatePickerRootProps,
	DatePickerRoot as Root,
} from "./date-picker-root.tsx";
import {
	type DatePickerTriggerOptions,
	type DatePickerTriggerProps,
	DatePickerTrigger as Trigger,
} from "./date-picker-trigger.tsx";
import {
	type DatePickerValueOptions,
	type DatePickerValueProps,
	type DatePickerValueRenderProps,
	DatePickerValue as Value,
} from "./date-picker-value.tsx";

export type { DatePickerIntlTranslations } from "./date-picker.intl.ts";

export type {
	DatePickerAnchorCommonProps,
	DatePickerAnchorOptions,
	DatePickerAnchorProps,
	DatePickerAnchorRenderProps,
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
	DatePickerCloseButtonCommonProps,
	DatePickerCloseButtonOptions,
	DatePickerCloseButtonProps,
	DatePickerCloseButtonRenderProps,
	DatePickerContentCommonProps,
	DatePickerContentOptions,
	DatePickerContentProps,
	DatePickerContentRenderProps,
	DatePickerDescriptionCommonProps,
	DatePickerDescriptionOptions,
	DatePickerDescriptionProps,
	DatePickerDescriptionRenderProps,
	DatePickerErrorMessageCommonProps,
	DatePickerErrorMessageOptions,
	DatePickerErrorMessageProps,
	DatePickerErrorMessageRenderProps,
	DatePickerLabelCommonProps,
	DatePickerLabelOptions,
	DatePickerLabelProps,
	DatePickerLabelRenderProps,
	DatePickerPortalProps,
	DatePickerRootOptions,
	DatePickerRootProps,
	DatePickerTriggerOptions,
	DatePickerTriggerProps,
	DatePickerValueOptions,
	DatePickerValueProps,
	DatePickerValueRenderProps,
};

export {
	Anchor,
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
	CloseButton,
	Content,
	Description,
	ErrorMessage,
	Label,
	Portal,
	Root,
	Trigger,
	Value,
};

export const DatePicker = Object.assign(Root, {
	Anchor,
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
	CloseButton,
	Content,
	Description,
	ErrorMessage,
	Label,
	Portal,
	Trigger,
	Value,
});

/*

<DatePicker>
  <DatePicker.Label/>
  <DatePicker.Trigger>
    <DatePicker.Value>Pick a date</DatePicker.Value>
  </DatePicker.Trigger>
  <DatePicker.Description/>
  <DatePicker.ErrorMessage/>
  <DatePicker.Portal>
    <DatePicker.Content>
      <DatePicker.Arrow/>
      <DatePicker.Calendar>
        <DatePicker.CalendarHeader>
          <DatePicker.CalendarPrevTrigger/>
          <DatePicker.CalendarHeading/>
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
</DatePicker>

*/
