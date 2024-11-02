import type { Component, ValidComponent } from "solid-js";
import {
	Meter,
	type MeterTrackCommonProps,
	type MeterTrackOptions,
	type MeterTrackRenderProps,
} from "../meter";
import type { ElementOf, PolymorphicProps } from "../polymorphic";
import { type ProgressDataSet, useProgressContext } from "./progress-context";

export interface ProgressTrackOptions extends MeterTrackOptions {}

export interface ProgressTrackCommonProps<T extends HTMLElement = HTMLElement>
	extends MeterTrackCommonProps {}

export interface ProgressTrackRenderProps
	extends MeterTrackRenderProps,
		ProgressTrackCommonProps,
		ProgressDataSet {}

export type ProgressTrackProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = ProgressTrackOptions & Partial<ProgressTrackCommonProps<ElementOf<T>>>;

/**
 * The component that visually represents the progress track.
 * Act as a container for `Progress.Fill`.
 */
export function ProgressTrack<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, ProgressTrackProps<T>>,
) {
	const context = useProgressContext();

	return (
		<Meter.Track<
			Component<Omit<ProgressTrackRenderProps, keyof MeterTrackRenderProps>>
		>
			{...context.dataset()}
			{...(props as ProgressTrackProps)}
		/>
	);
}
