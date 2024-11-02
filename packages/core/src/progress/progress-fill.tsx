import { type Component, type ValidComponent, splitProps } from "solid-js";

import { combineStyle } from "@solid-primitives/props";
import {
	Meter,
	type MeterFillCommonProps,
	type MeterFillOptions,
	type MeterFillRenderProps,
} from "../meter";
import type { ElementOf, PolymorphicProps } from "../polymorphic";
import { type ProgressDataSet, useProgressContext } from "./progress-context";

export interface ProgressFillOptions extends MeterFillOptions {}

export interface ProgressFillCommonProps<T extends HTMLElement = HTMLElement>
	extends MeterFillCommonProps {}

export interface ProgressFillRenderProps
	extends ProgressFillCommonProps,
		ProgressDataSet,
		MeterFillRenderProps {}

export type ProgressFillProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = ProgressFillOptions & Partial<ProgressFillCommonProps<ElementOf<T>>>;

/**
 * The component that visually represents the progress value.
 * Used to visually show the fill of `Progress.Track`.
 */
export function ProgressFill<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, ProgressFillProps<T>>,
) {
	const context = useProgressContext();

	const [local, others] = splitProps(props as ProgressFillProps, ["style"]);

	return (
		<Meter.Fill<
			Component<Omit<ProgressFillRenderProps, keyof MeterFillRenderProps>>
		>
			style={combineStyle(
				{
					"--kb-progress-fill-width": context.progressFillWidth(),
				},
				local.style,
			)}
			{...context.dataset()}
			{...others}
		/>
	);
}
