import { Show, createEffect } from "solid-js";
import { useTimeFieldContext } from "./time-field-context";

export function TimeFieldValueDescription() {
	const context = useTimeFieldContext();

	const defaultId = context.generateId("value-description");

	const isValid = () => context.value()?.toString() !== undefined;

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
					.selectedTimeDescription(context.formattedValue()!)}
			</div>
		</Show>
	);
}
