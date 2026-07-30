import { visuallyHiddenStyles } from "@kobalte/utils";
import type { ComponentProps } from "@solidjs/web";
import { useFormControlContext } from "../form-control/index.ts";
import { useTimeFieldContext } from "./time-field-context.tsx";

export interface TimeFieldHiddenInputProps extends ComponentProps<"input"> {}

export function TimeFieldHiddenInput(props: TimeFieldHiddenInputProps) {
	const formControlContext = useFormControlContext();
	const context = useTimeFieldContext();

	return (
		// biome-ignore lint/a11y/noAriaHiddenOnFocusable: it is not focusable.
		<input
			type="text"
			tabindex={-1}
			style={visuallyHiddenStyles}
			name={formControlContext.name()}
			value={context.formattedValue() || ""}
			required={formControlContext.isRequired()}
			disabled={formControlContext.isDisabled()}
			readonly={formControlContext.isReadOnly()}
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
		period === "PM"
			? Number.parseInt(hours, 10) + 12
			: Number.parseInt(hours, 10);
	const parsedMinutes = Number.parseInt(minutes, 10);
	const parsedSeconds = Number.parseInt(seconds, 10);

	return {
		hour: Number.isNaN(parsedHours) ? undefined : parsedHours,
		minute: Number.isNaN(parsedMinutes) ? undefined : parsedMinutes,
		second: Number.isNaN(parsedSeconds) ? undefined : parsedSeconds,
	};
};
