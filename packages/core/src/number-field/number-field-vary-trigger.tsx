import {
	OverrideComponentProps,
	callHandler,
	mergeRefs,
	visuallyHiddenStyles,
} from "@kobalte/utils";
import { ComponentProps, splitProps } from "solid-js";
import * as Button from "../button";
import { useFormControlContext } from "../form-control";

import { useNumberFieldContext } from "./number-field-context";

export interface NumberFieldVaryTriggerProps
	extends OverrideComponentProps<"button", Button.ButtonRootOptions> {
	numberFieldVaryType: "increment" | "decrement";
}

export function NumberFieldVaryTrigger(props: NumberFieldVaryTriggerProps) {
	const formControlContext = useFormControlContext();
	const context = useNumberFieldContext();

	const [local, others] = splitProps(props, ["numberFieldVaryType", "onClick"]);

	return (
		<Button.Root
			tabIndex={-1}
			disabled={
				formControlContext.isDisabled() ||
				context.rawValue() ===
					(local.numberFieldVaryType === "increment"
						? context.maxValue()
						: context.minValue())
			}
			aria-controls={formControlContext.fieldId()}
			onClick={(e) => {
				callHandler(e, local.onClick);

				context.varyValue(
					context.step() * (local.numberFieldVaryType === "increment" ? 1 : -1),
				);

				context.inputRef()?.focus();
			}}
			{...others}
		/>
	);
}
