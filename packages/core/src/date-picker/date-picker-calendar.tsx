import type { RangeValue } from "@kobalte/utils";
import type { ValidComponent } from "@solidjs/web";
import { merge } from "solid-js";

import { Calendar } from "../calendar/index.tsx";
import type { DateValue } from "../calendar/types.ts";
import { useFormControlContext } from "../form-control/index.ts";
import type { PolymorphicProps } from "../polymorphic/index.tsx";
import { usePopoverContext } from "../popover/index.tsx";
import { useDatePickerContext } from "./date-picker-context.tsx";

export interface DatePickerCalendarOptions {}

export type DatePickerCalendarProps = DatePickerCalendarOptions & {
	id?: string;
};

/**
 * The calendar used to select a date, dates, or date range, rendered inside `DatePicker.Content`.
 */
export function DatePickerCalendar<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, DatePickerCalendarProps>,
) {
	const formControlContext = useFormControlContext();
	const context = useDatePickerContext();
	const popoverContext = usePopoverContext();

	const mergedProps = merge(
		{
			id: context.generateId("calendar"),
		},
		props as DatePickerCalendarProps,
	);

	const onChange = (
		newValue: DateValue | DateValue[] | RangeValue<DateValue> | undefined,
	) => {
		context.setDateValue(newValue);

		if (context.closeOnSelect()) {
			popoverContext.close();
		}
	};

	return (
		<Calendar
			autoFocus
			selectionMode={context.selectionMode() as any}
			value={context.value() as any}
			onChange={onChange as any}
			locale={context.locale()}
			isDateUnavailable={context.isDateUnavailable}
			visibleDuration={context.visibleDuration()}
			allowsNonContiguousRanges={context.allowsNonContiguousRanges()}
			defaultFocusedValue={
				context.value() ? undefined : context.placeholderValue()
			}
			minValue={context.minValue()}
			maxValue={context.maxValue()}
			disabled={formControlContext.isDisabled()}
			readOnly={formControlContext.isReadOnly()}
			validationState={context.validationState()}
			{...mergedProps}
		/>
	);
}
