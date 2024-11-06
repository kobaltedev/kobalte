import { visuallyHiddenStyles } from "@kobalte/utils";
import type { ComponentProps } from "solid-js";

import { useFormControlContext } from "../form-control";
import { usePinInputContext } from "./pin-input-context";

export interface PinInputHiddenInputProps extends ComponentProps<"input"> {}

export function PinInputHiddenInput(props: PinInputHiddenInputProps) {
	const formControlContext = useFormControlContext();
	const context = usePinInputContext();

	return (
		// biome-ignore lint/a11y/noAriaHiddenOnFocusable: it is not focusable.
		<input
			type="text"
			tabIndex={-1}
			style={visuallyHiddenStyles}
			name={formControlContext.name()}
			value={context.value().join("")}
			required={formControlContext.isRequired()}
			disabled={formControlContext.isDisabled()}
			readOnly={formControlContext.isReadOnly()}
			aria-hidden="true"
			{...props}
		/>
	);
}
