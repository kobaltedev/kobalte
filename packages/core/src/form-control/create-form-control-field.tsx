import {
	createFormControlInput as _createFormControlInput,
	useFormControl,
} from "@solid-primitives/a11y";
import { access } from "@solid-primitives/utils";
import { isServer } from "@solidjs/web";

export type { CreateFormControlInputProps as CreateFormControlFieldProps } from "@solid-primitives/a11y";

export const FORM_CONTROL_FIELD_PROP_NAMES = [
	"id",
	"aria-label",
	"aria-labelledby",
	"aria-describedby",
] as const;

export function createFormControlField(
	props: Parameters<typeof _createFormControlInput>[0] = {},
) {
	const context = useFormControl();

	// Register the field while rendering instead of leaving it to the
	// primitive's effect: the effect doesn't run on the server, and a field
	// rendered before the label only reaches the label's `for` on the next
	// update. The primitive keeps the registration in sync and unregisters it
	// on unmount. Writing to a signal while rendering is only meaningful in a
	// tracking (client) scope — on the server it is deprecated, so the
	// association falls back to the part's deterministic id (`${rootId}-input`).
	if (!isServer) {
		context.registerField(access(props.id) ?? context.generateId("field"));
	}

	return _createFormControlInput(props);
}
