import type { ComponentProps } from "@solidjs/web";
import { createMemo } from "solid-js";

import { useFormControlContext } from "../form-control";
import { HiddenValueInputsBase } from "../tags-input/hidden-value-inputs-base";
import { useComboboxContext } from "./combobox-context";

export type ComboboxHiddenInputsProps = ComponentProps<"input">;

/**
 * Renders one native `<input type="hidden">` per selected value, as an
 * alternative to `Combobox.HiddenSelect`'s native `<select multiple>` for
 * multi-select comboboxes that want array-style form submission
 * (read with `formData.getAll(name)`).
 */
export function ComboboxHiddenInputs(props: ComboboxHiddenInputsProps) {
	const formControlContext = useFormControlContext();
	const context = useComboboxContext();

	const values = createMemo(() => [
		...context.listState().selectionManager().selectedKeys(),
	]);

	return (
		<HiddenValueInputsBase
			getValues={values}
			getName={formControlContext.name}
			getDisabled={formControlContext.isDisabled}
			{...props}
		/>
	);
}
