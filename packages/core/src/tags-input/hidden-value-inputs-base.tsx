import type { ComponentProps } from "@solidjs/web";
import { For, omit } from "solid-js";

export interface HiddenValueInputsBaseProps extends ComponentProps<"input"> {
	/** The values to submit, one hidden input per value. */
	getValues: () => string[];

	/** The name submitted with each hidden input. */
	getName: () => string | undefined;

	/** Whether the hidden inputs are disabled. */
	getDisabled?: () => boolean | undefined;
}

/**
 * Renders one native `<input type="hidden">` per value so an array of
 * strings can be submitted as part of a native HTML form
 * (read with `formData.getAll(name)`).
 */
export function HiddenValueInputsBase(props: HiddenValueInputsBaseProps) {
	const others = omit(props, "getValues", "getName", "getDisabled");

	return (
		<For each={props.getValues()}>
			{(value) => (
				<input
					type="hidden"
					name={props.getName()}
					value={value}
					disabled={props.getDisabled?.()}
					{...others}
				/>
			)}
		</For>
	);
}
