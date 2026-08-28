import { visuallyHiddenStyles } from "@kobalte/utils";
import type { ComponentProps } from "@solidjs/web";
import {
	parseLocalISOString,
	toLocalISOString,
} from "../calendar/date-math.ts";
import { useFormControlContext } from "../form-control/index.ts";
import { useDateFieldContext } from "./date-field-context.tsx";

export interface DateFieldHiddenInputProps extends ComponentProps<"input"> {}

export function DateFieldHiddenInput(props: DateFieldHiddenInputProps) {
	const formControlContext = useFormControlContext();
	const context = useDateFieldContext();

	const serializedValue = () => {
		const value = context.value();
		return value ? toLocalISOString(value, context.granularity()) : "";
	};

	return (
		// biome-ignore lint/a11y/noAriaHiddenOnFocusable: it is not focusable.
		<input
			type="text"
			tabindex={-1}
			style={visuallyHiddenStyles}
			name={formControlContext.name()}
			value={serializedValue()}
			required={formControlContext.isRequired()}
			disabled={formControlContext.isDisabled()}
			readonly={formControlContext.isReadOnly()}
			aria-hidden="true"
			onChange={(e) => {
				const parsed = parseLocalISOString(e.currentTarget.value);
				if (parsed) context.setValue(parsed);
			}}
			{...props}
		/>
	);
}
