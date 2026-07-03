import { createFormControl as _createFormControl } from "@solid-primitives/a11y";

export type { CreateFormControlProps } from "@solid-primitives/a11y";

export const FORM_CONTROL_PROP_NAMES = [
	"id",
	"name",
	"validationState",
	"required",
	"disabled",
	"readOnly",
] as const;

export function createFormControl(
	props: Parameters<typeof _createFormControl>[0],
) {
	return { formControlContext: _createFormControl(props) };
}
