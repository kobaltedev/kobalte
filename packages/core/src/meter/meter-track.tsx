import type { ValidComponent } from "solid-js";
import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";
import { type MeterDataSet, useMeterContext } from "./meter-context";

export interface MeterTrackOptions {}

export interface MeterTrackCommonProps<T extends HTMLElement = HTMLElement> {}

export interface MeterTrackRenderProps
	extends MeterTrackCommonProps,
		MeterDataSet {}

export type MeterTrackProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = MeterTrackOptions & Partial<MeterTrackCommonProps<ElementOf<T>>>;

/**
 * The component that visually represents the meter track.
 * Act as a container for `Meter.Fill`.
 */
export function MeterTrack<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, MeterTrackProps<T>>,
) {
	const context = useMeterContext();

	return (
		<Polymorphic<MeterTrackRenderProps>
			as="div"
			{...context.dataset()}
			{...(props as MeterTrackProps)}
		/>
	);
}
