import { visuallyHiddenStyles } from "@kobalte/utils";
import type { ComponentProps } from "@solidjs/web";

import { useFormControlContext } from "../form-control";
import { useRatingGroupContext } from "./rating-group-context";

export interface RatingGroupHiddenInputProps extends ComponentProps<"input"> {}

export function RatingGroupHiddenInput(props: RatingGroupHiddenInputProps) {
	const formControlContext = useFormControlContext();
	const context = useRatingGroupContext();

	return (
		<input
			type="text"
			tabindex={-1}
			style={visuallyHiddenStyles}
			name={formControlContext.name()}
			value={context.value()}
			required={formControlContext.isRequired()}
			disabled={formControlContext.isDisabled()}
			readonly={formControlContext.isReadOnly()}
			{...props}
		/>
	);
}
