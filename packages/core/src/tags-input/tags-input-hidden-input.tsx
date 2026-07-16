import type { ComponentProps } from "@solidjs/web";
import { For } from "solid-js";
import { useFormControlContext } from "../form-control";
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
		<For each={context.value()}>
			{(tag) => (
				<input
					type="hidden"
					name={formControlContext.name()}
					value={tag}
					disabled={formControlContext.isDisabled()}
					{...props}
				/>
			)}
		</For>
	);
}
