import {
	createFormControl as _createFormControl,
	type FormControlContextValue,
} from "@solid-primitives/a11y";
import { access } from "@solid-primitives/utils";
import { isServer } from "@solidjs/web";

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
	const context = _createFormControl(props);

	// The parts register their id in an effect, and effects don't run on the
	// server, so the associations between them (`for`, `aria-labelledby` and
	// `aria-describedby`) are missing from the server-rendered HTML. Fall back
	// to the id every part generates by default (`${id}-label`, `${id}-input`,
	// …) so the whole field is associated in the response a no-JavaScript
	// visitor gets. A registered id always wins, so a custom id passed by the
	// caller is used as soon as its part registers it.
	const defaultId =
		(registered: () => string | undefined, part: string) =>
		(): string | undefined =>
			registered() ?? (isServer ? context.generateId(part) : undefined);

	const labelId = defaultId(context.labelId, "label");
	const fieldId = defaultId(context.fieldId, "input");
	const descriptionId = defaultId(context.descriptionId, "description");
	const errorMessageId = (): string | undefined =>
		context.errorMessageId() ??
		(isServer && access(props.validationState) === "invalid"
			? context.generateId("error-message")
			: undefined);

	const formControlContext: FormControlContextValue = {
		...context,
		labelId,
		fieldId,
		descriptionId,
		errorMessageId,
		getAriaLabelledBy: (
			fieldId: string | undefined,
			fieldAriaLabel: string | undefined,
			fieldAriaLabelledBy: string | undefined,
		) => {
			const hasAriaLabelledBy =
				fieldAriaLabelledBy != null || labelId() != null;

			return (
				[
					fieldAriaLabelledBy,
					labelId(),
					hasAriaLabelledBy && fieldAriaLabel != null ? fieldId : undefined,
				]
					.filter(Boolean)
					.join(" ") || undefined
			);
		},
		getAriaDescribedBy: (fieldAriaDescribedBy: string | undefined) =>
			[descriptionId(), errorMessageId(), fieldAriaDescribedBy]
				.filter(Boolean)
				.join(" ") || undefined,
	};

	return { formControlContext };
}
