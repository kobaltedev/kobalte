import { Component, ValidComponent } from "solid-js";
import { ElementOf, PolymorphicProps } from "../polymorphic";
import {
	NumberFieldVaryTrigger,
	NumberFieldVaryTriggerCommonProps,
	NumberFieldVaryTriggerRenderProps,
} from "./number-field-vary-trigger";

export interface NumberFieldDecrementTriggerOptions {}

export interface NumberFieldDecrementTriggerCommonProps<
	T extends HTMLElement = HTMLElement,
> extends NumberFieldVaryTriggerCommonProps<T> {}

export interface NumberFieldDecrementTriggerRenderProps
	extends NumberFieldDecrementTriggerCommonProps,
		NumberFieldVaryTriggerRenderProps {}

export type NumberFieldDecrementTriggerProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = NumberFieldDecrementTriggerOptions &
	Partial<NumberFieldDecrementTriggerCommonProps<ElementOf<T>>>;

export function NumberFieldDecrementTrigger<
	T extends ValidComponent = "button",
>(props: PolymorphicProps<T, NumberFieldDecrementTriggerProps<T>>) {
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
