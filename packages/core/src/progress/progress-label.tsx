import { mergeDefaultProps } from "@kobalte/utils";
import type { ValidComponent } from "@solidjs/web";
import { type Component, createEffect, omit } from "solid-js";

import {
	Meter,
	type MeterLabelCommonProps,
	type MeterLabelOptions,
	type MeterLabelRenderProps,
} from "../meter";
import type { ElementOf, PolymorphicProps } from "../polymorphic";
import { type ProgressDataSet, useProgressContext } from "./progress-context";

export interface ProgressLabelOptions extends MeterLabelOptions {}

export interface ProgressLabelCommonProps<T extends HTMLElement = HTMLElement>
	extends MeterLabelCommonProps {}

export interface ProgressLabelRenderProps
	extends MeterLabelRenderProps,
		ProgressLabelCommonProps,
		ProgressDataSet {}

export type ProgressLabelProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = ProgressLabelOptions & Partial<ProgressLabelCommonProps<ElementOf<T>>>;

/**
 * An accessible label that gives the user information on the progress.
 */
export function ProgressLabel<T extends ValidComponent = "span">(
	props: PolymorphicProps<T, ProgressLabelProps<T>>,
) {
	const context = useProgressContext();

	const mergedProps = mergeDefaultProps(
		{
			id: context.generateId("label"),
		},
		props as ProgressLabelProps,
	);
	const others = omit(mergedProps, "id");

	createEffect(
		() => mergedProps.id,
		(id) => context.registerLabelId(id),
	);

	return (
		<Meter.Label<
			Component<Omit<ProgressLabelRenderProps, keyof MeterLabelRenderProps>>
		>
			id={mergedProps.id}
			{...context.dataset()}
			{...others}
		/>
	);
}
