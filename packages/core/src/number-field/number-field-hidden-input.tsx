import { callHandler, mergeRefs, visuallyHiddenStyles } from "@kobalte/utils";
import type { ComponentProps } from "@solidjs/web";
import { omit } from "solid-js";

import { useFormControlContext } from "../form-control";
import { useNumberFieldContext } from "./number-field-context";

export interface NumberFieldHiddenInputProps extends ComponentProps<"input"> {}

export function NumberFieldHiddenInput(props: NumberFieldHiddenInputProps) {
	const context = useNumberFieldContext();

	const others = omit(props, "ref", "onChange");

	const formControlContext = useFormControlContext();

	return (
		<div style={visuallyHiddenStyles} aria-hidden="true">
			<input
				ref={(el: HTMLInputElement) => {
					context.setHiddenInputRef(el);
					if (typeof props.ref === "function")
						(props.ref as (el: HTMLInputElement) => void)(el);
				}}
				type="text"
				tabindex={-1}
				style={{ "font-size": "16px" }}
				name={formControlContext.name()}
				value={Number.isNaN(context.rawValue()) ? "" : context.rawValue()}
				required={formControlContext.isRequired()}
				disabled={formControlContext.isDisabled()}
				readonly={formControlContext.isReadOnly()}
				onChange={(e) => {
					callHandler(e, props.onChange as any);
					// enable form autofill
					context.setValue((e.target as HTMLInputElement).value);
					context.format();
				}}
				{...others}
			/>
		</div>
	);
}
