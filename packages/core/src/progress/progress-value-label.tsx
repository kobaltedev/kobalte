import type { Component, ValidComponent } from "solid-js";

import {
	Meter,
	type MeterValueLabelCommonProps,
	type MeterValueLabelOptions,
	type MeterValueLabelRenderProps,
} from "../meter";
import type { ElementOf, PolymorphicProps } from "../polymorphic";
import { type ProgressDataSet, useProgressContext } from "./progress-context";

export interface ProgressValueLabelOptions extends MeterValueLabelOptions {}

export interface ProgressValueLabelCommonProps<
	T extends HTMLElement = HTMLElement,
> extends MeterValueLabelCommonProps {}

export interface ProgressValueLabelRenderProps
	extends MeterValueLabelRenderProps,
		ProgressValueLabelCommonProps,
		ProgressDataSet {}

export type ProgressValueLabelProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = ProgressValueLabelOptions &
	Partial<ProgressValueLabelCommonProps<ElementOf<T>>>;

/**
 * The accessible label text representing the current value in a human-readable format.
 */
export function ProgressValueLabel<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, ProgressValueLabelProps<T>>,
) {
	const context = useProgressContext();

	return (
		<Meter.ValueLabel<
			Component<
				Omit<ProgressValueLabelRenderProps, keyof MeterValueLabelRenderProps>
			>
		>
			{...context.dataset()}
			{...(props as ProgressValueLabelProps)}
		/>
	);
}
