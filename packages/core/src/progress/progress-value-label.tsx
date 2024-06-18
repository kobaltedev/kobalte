import type { JSX, ValidComponent } from "solid-js";

import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";
import { type ProgressDataSet, useProgressContext } from "./progress-context";

export interface ProgressValueLabelOptions {}

export interface ProgressValueLabelCommonProps<
	T extends HTMLElement = HTMLElement,
> {}

export interface ProgressValueLabelRenderProps
	extends ProgressValueLabelCommonProps,
		ProgressDataSet {
	children: JSX.Element;
}

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
		<Polymorphic<ProgressValueLabelRenderProps>
			as="div"
			{...context.dataset()}
			{...(props as ProgressValueLabelProps)}
		>
			{context.valueLabel()}
		</Polymorphic>
	);
}
