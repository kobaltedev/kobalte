import { Component, ValidComponent } from "solid-js";
import { PolymorphicProps } from "../polymorphic";
import {
	NumberFieldVaryTrigger,
	NumberFieldVaryTriggerCommonProps,
	NumberFieldVaryTriggerRenderProps,
} from "./number-field-vary-trigger";

export interface NumberFieldIncrementTriggerOptions {}

export interface NumberFieldIncrementTriggerCommonProps
	extends NumberFieldVaryTriggerCommonProps {}

export interface NumberFieldIncrementTriggerRenderProps
	extends NumberFieldIncrementTriggerCommonProps,
		NumberFieldVaryTriggerRenderProps {}

export type NumberFieldIncrementTriggerProps =
	NumberFieldIncrementTriggerOptions &
		Partial<NumberFieldIncrementTriggerCommonProps>;

export function NumberFieldIncrementTrigger<
	T extends ValidComponent = "button",
>(props: PolymorphicProps<T, NumberFieldIncrementTriggerProps>) {
	return (
		<NumberFieldVaryTrigger<
			Component<
				Omit<
					NumberFieldIncrementTriggerRenderProps,
					keyof NumberFieldVaryTriggerRenderProps
				>
			>
		>
			numberFieldVaryType="increment"
			{...(props as NumberFieldIncrementTriggerProps)}
		/>
	);
}
