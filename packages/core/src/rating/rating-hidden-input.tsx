import { visuallyHiddenStyles } from "@kobalte/utils";
import type { ComponentProps } from "@solidjs/web";

import { useFormControlContext } from "../form-control";
import { useRatingContext } from "./rating-context";

export interface RatingHiddenInputProps extends ComponentProps<"input"> {}

export function RatingHiddenInput(props: RatingHiddenInputProps) {
	const formControlContext = useFormControlContext();
	const context = useRatingContext();

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
