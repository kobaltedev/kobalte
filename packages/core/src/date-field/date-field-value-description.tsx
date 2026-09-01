import { createEffect, Show } from "solid-js";
import { useDateFieldContext } from "./date-field-context.tsx";

export function DateFieldValueDescription() {
	const context = useDateFieldContext();

	const defaultId = context.generateId("value-description");

	const isValid = () => context.value() !== undefined;

	createEffect(
		() => isValid(),
		(valid) => {
			if (!valid) return;
			return context.registerValueDescriptionId(defaultId);
		},
	);

	return (
		<Show when={isValid()}>
			<div id={defaultId} style={{ display: "none" }}>
				{context
					.translations()
					.selectedDateDescription(context.formattedValue()!)}
			</div>
		</Show>
	);
}
