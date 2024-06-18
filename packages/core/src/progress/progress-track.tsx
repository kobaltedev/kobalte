import type { ValidComponent } from "solid-js";
import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";
import { type ProgressDataSet, useProgressContext } from "./progress-context";

export interface ProgressTrackOptions {}

export interface ProgressTrackCommonProps<
	T extends HTMLElement = HTMLElement,
> {}

export interface ProgressTrackRenderProps
	extends ProgressTrackCommonProps,
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
		<Polymorphic<ProgressTrackRenderProps>
			as="div"
			{...context.dataset()}
			{...(props as ProgressTrackProps)}
		/>
	);
}
