import { OverrideComponentProps } from "@kobalte/utils";
import * as Button from "../button";
import { NumberFieldVaryTrigger } from "./number-field-vary-trigger";

export interface NumberFieldIncrementTriggerProps
	extends OverrideComponentProps<"button", Button.ButtonRootOptions> {}

export function NumberFieldIncrementTrigger(
	props: NumberFieldIncrementTriggerProps,
) {
	return <NumberFieldVaryTrigger numberFieldVaryType="increment" {...props} />;
}
