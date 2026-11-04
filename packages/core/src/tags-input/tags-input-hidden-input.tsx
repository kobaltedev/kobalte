import type { ComponentProps } from "@solidjs/web";
import { useFormControlContext } from "../form-control";
import { HiddenValueInputsBase } from "./hidden-value-inputs-base";
import { useTagsInputContext } from "./tags-input-context";

export type TagsInputHiddenInputProps = ComponentProps<"input">;

/**
 * Renders one native `<input type="hidden">` per tag so the value can be
 * submitted as part of a native HTML form (read with `formData.getAll(name)`).
 */
export function TagsInputHiddenInput(props: TagsInputHiddenInputProps) {
	const formControlContext = useFormControlContext();
	const context = useTagsInputContext();

	return (
		<HiddenValueInputsBase
			getValues={context.value}
			getName={formControlContext.name}
			getDisabled={formControlContext.isDisabled}
			{...props}
		/>
	);
}
