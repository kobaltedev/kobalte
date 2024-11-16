import type { ComponentProps } from "solid-js";

import { useFormControlContext } from "../form-control";
import { useTimeFieldContext } from "./time-field-context";

export interface TimeFieldHiddenInputProps extends ComponentProps<"input"> {}

export function TimeFieldHiddenInput(props: TimeFieldHiddenInputProps) {
	const formControlContext = useFormControlContext();
	const context = useTimeFieldContext();

	return (
		<input
			type="text"
			hidden
			name={formControlContext.name()}
			value={context.formattedValue() || ""}
			required={formControlContext.isRequired()}
			disabled={formControlContext.isDisabled()}
			readOnly={formControlContext.isReadOnly()}
			{...props}
		/>
	);
}
