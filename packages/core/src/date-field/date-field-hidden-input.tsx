import {
	parseDate,
	parseDateTime,
	parseZonedDateTime,
} from "@internationalized/date";
import { visuallyHiddenStyles } from "@kobalte/utils";
import type { ComponentProps } from "@solidjs/web";
import { useFormControlContext } from "../form-control/index.ts";
import { useDateFieldContext } from "./date-field-context.tsx";

export interface DateFieldHiddenInputProps extends ComponentProps<"input"> {}

export function DateFieldHiddenInput(props: DateFieldHiddenInputProps) {
	const formControlContext = useFormControlContext();
	const context = useDateFieldContext();

	return (
		// biome-ignore lint/a11y/noAriaHiddenOnFocusable: it is not focusable.
		<input
			type="text"
			tabindex={-1}
			style={visuallyHiddenStyles}
			name={formControlContext.name()}
			value={context.value()?.toString() ?? ""}
			required={formControlContext.isRequired()}
			disabled={formControlContext.isDisabled()}
			readonly={formControlContext.isReadOnly()}
			aria-hidden="true"
			onChange={(e) => {
				const parsed = parseDateValue(e.currentTarget.value);
				if (parsed) context.setValue(parsed);
			}}
			{...props}
		/>
	);
}

const parseDateValue = (value: string) => {
	for (const parser of [parseZonedDateTime, parseDateTime, parseDate]) {
		try {
			return parser(value);
		} catch {
			// try the next, less specific parser
		}
	}
	return undefined;
};
