import { type RangeValue, visuallyHiddenStyles } from "@kobalte/utils";

import { toLocalISOString } from "../calendar/date-math.ts";
import type { CalendarSelectionMode, DateValue } from "../calendar/types.ts";
import {
	asArrayValue,
	asRangeValue,
	asSingleValue,
} from "../calendar/utils.ts";

export interface DatePickerHiddenInputProps {
	name: string;
	selectionMode: CalendarSelectionMode;
	value: DateValue | DateValue[] | RangeValue<DateValue> | null | undefined;
	required?: boolean;
	disabled?: boolean;
}

/**
 * Native input rendered for form serialization of the selected value(s), since
 * there's no segmented text input to serve that role in this composition.
 */
export function DatePickerHiddenInput(props: DatePickerHiddenInputProps) {
	const serializedValue = () => {
		if (props.value == null) {
			return "";
		}

		if (props.selectionMode === "single") {
			const date = asSingleValue(props.value);
			return date ? toLocalISOString(date, "day") : "";
		}

		if (props.selectionMode === "multiple") {
			return (
				asArrayValue(props.value)
					?.map((date) => toLocalISOString(date, "day"))
					.join(",") ?? ""
			);
		}

		const range = asRangeValue(props.value);

		if (!range?.start || !range.end) {
			return "";
		}

		return `${toLocalISOString(range.start, "day")}/${toLocalISOString(range.end, "day")}`;
	};

	return (
		// biome-ignore lint/a11y/noAriaHiddenOnFocusable: it is not focusable.
		<input
			type="text"
			tabindex={-1}
			style={visuallyHiddenStyles}
			name={props.name}
			value={serializedValue()}
			required={props.required}
			disabled={props.disabled}
			readonly
			aria-hidden="true"
		/>
	);
}
