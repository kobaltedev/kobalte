import { Component, ValidComponent } from "solid-js";
import { PolymorphicProps } from "../polymorphic";
import {
	NumberFieldVaryTrigger,
	NumberFieldVaryTriggerCommonProps,
	NumberFieldVaryTriggerRenderProps,
} from "./number-field-vary-trigger";

export interface NumberFieldDecrementTriggerOptions {}

export interface NumberFieldDecrementTriggerCommonProps
	extends NumberFieldVaryTriggerCommonProps {}

export interface NumberFieldDecrementTriggerRenderProps
	extends NumberFieldDecrementTriggerCommonProps,
		NumberFieldVaryTriggerRenderProps {}

export type NumberFieldDecrementTriggerProps =
	NumberFieldDecrementTriggerOptions &
		Partial<NumberFieldDecrementTriggerCommonProps>;

export function NumberFieldDecrementTrigger<
	T extends ValidComponent = "button",
>(props: PolymorphicProps<T, NumberFieldDecrementTriggerProps>) {
	return (
		<NumberFieldVaryTrigger<
			Component<
				Omit<
					NumberFieldDecrementTriggerRenderProps,
					keyof NumberFieldVaryTriggerRenderProps
				>
			>
		>
			numberFieldVaryType="decrement"
			{...(props as NumberFieldDecrementTriggerProps)}
		/>
	);
}
