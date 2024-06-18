import type { Component, ValidComponent } from "solid-js";
import type { ElementOf, PolymorphicProps } from "../polymorphic";
import {
	NumberFieldVaryTrigger,
	type NumberFieldVaryTriggerCommonProps,
	type NumberFieldVaryTriggerRenderProps,
} from "./number-field-vary-trigger";

export interface NumberFieldIncrementTriggerOptions {}

export interface NumberFieldIncrementTriggerCommonProps<
	T extends HTMLElement = HTMLElement,
> extends NumberFieldVaryTriggerCommonProps<T> {}

export interface NumberFieldIncrementTriggerRenderProps
	extends NumberFieldIncrementTriggerCommonProps,
		NumberFieldVaryTriggerRenderProps {}

export type NumberFieldIncrementTriggerProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = NumberFieldIncrementTriggerOptions &
	Partial<NumberFieldIncrementTriggerCommonProps<ElementOf<T>>>;

export function NumberFieldIncrementTrigger<
	T extends ValidComponent = "button",
>(props: PolymorphicProps<T, NumberFieldIncrementTriggerProps<T>>) {
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
