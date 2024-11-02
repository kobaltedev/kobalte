import type { JSX, ValidComponent } from "solid-js";

import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";
import { type MeterDataSet, useMeterContext } from "./meter-context";

export interface MeterValueLabelOptions {}

export interface MeterValueLabelCommonProps<
	T extends HTMLElement = HTMLElement,
> {}

export interface MeterValueLabelRenderProps
	extends MeterValueLabelCommonProps,
		MeterDataSet {
	children: JSX.Element;
}

export type MeterValueLabelProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = MeterValueLabelOptions & Partial<MeterValueLabelCommonProps<ElementOf<T>>>;

/**
 * The accessible label text representing the current value in a human-readable format.
 */
export function MeterValueLabel<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, MeterValueLabelProps<T>>,
) {
	const context = useMeterContext();

	return (
		<Polymorphic<MeterValueLabelRenderProps>
			as="div"
			{...context.dataset()}
			{...(props as MeterValueLabelProps)}
		>
			{context.valueLabel()}
		</Polymorphic>
	);
}
