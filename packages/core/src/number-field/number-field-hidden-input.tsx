import { callHandler, mergeRefs, visuallyHiddenStyles } from "@kobalte/utils";
import { type ComponentProps, batch, splitProps } from "solid-js";

import { useFormControlContext } from "../form-control";
import { useNumberFieldContext } from "./number-field-context";

export interface NumberFieldHiddenInputProps extends ComponentProps<"input"> {}

export function NumberFieldHiddenInput(props: NumberFieldHiddenInputProps) {
	const context = useNumberFieldContext();

	const [local, others] = splitProps(props, ["ref", "onChange"]);

	const formControlContext = useFormControlContext();

	return (
		<div style={visuallyHiddenStyles} aria-hidden="true">
			<input
				ref={mergeRefs(context.setHiddenInputRef, local.ref)}
				type="text"
				tabIndex={-1}
				style={{ "font-size": "16px" }}
				name={formControlContext.name()}
				value={Number.isNaN(context.rawValue()) ? "" : context.rawValue()}
				required={formControlContext.isRequired()}
				disabled={formControlContext.isDisabled()}
				readOnly={formControlContext.isReadOnly()}
				onChange={(e) => {
					callHandler(e, local.onChange);
					// enable form autofill
					batch(() => {
						context.setValue((e.target as HTMLInputElement).value);
						context.format();
					});
				}}
				{...others}
			/>
		</div>
	);
}
