import { OverrideComponentProps } from "@kobalte/utils";
import * as Button from "../button";
import { NumberFieldVaryTrigger } from "./number-field-vary-trigger";

export interface NumberFieldDecrementTriggerProps
	extends OverrideComponentProps<"button", Button.ButtonRootOptions> {}

export function NumberFieldDecrementTrigger(
	props: NumberFieldDecrementTriggerProps,
) {
	return <NumberFieldVaryTrigger numberFieldVaryType="decrement" {...props} />;
}
