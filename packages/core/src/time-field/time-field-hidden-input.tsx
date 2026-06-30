import { visuallyHiddenStyles } from "@kobalte/utils";
import type { ComponentProps } from "solid-js";
import { useFormControlContext } from "../form-control";
import { useTimeFieldContext } from "./time-field-context";

export interface TimeFieldHiddenInputProps extends ComponentProps<"input"> {}

export function TimeFieldHiddenInput(props: TimeFieldHiddenInputProps) {
	const formControlContext = useFormControlContext();
	const context = useTimeFieldContext();

	return (
		// biome-ignore lint/a11y/noAriaHiddenOnFocusable: it is not focusable.
		<input
			type="text"
			tabIndex={-1}
			style={visuallyHiddenStyles}
			name={formControlContext.name()}
			value={context.formattedValue() || ""}
			required={formControlContext.isRequired()}
			disabled={formControlContext.isDisabled()}
			readOnly={formControlContext.isReadOnly()}
			aria-hidden="true"
			onChange={(e) => context.setValue(parseTime(e.currentTarget.value))}
			{...props}
		/>
	);
}

const parseTime = (value: string) => {
	const [time, period] = value.split(" ");
	const [hours, minutes, seconds] = time.split(":");

	const parsedHours =
		period === "PM" ? Number.parseInt(hours) + 12 : Number.parseInt(hours);
	const parsedMinutes = Number.parseInt(minutes);
	const parsedSeconds = Number.parseInt(seconds);

	return {
		hour: Number.isNaN(parsedHours) ? undefined : parsedHours,
		minute: Number.isNaN(parsedMinutes) ? undefined : parsedMinutes,
		second: Number.isNaN(parsedSeconds) ? undefined : parsedSeconds,
	};
};
