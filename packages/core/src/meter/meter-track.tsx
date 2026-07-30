import type { ValidComponent } from "@solidjs/web";
import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic/index.tsx";
import { type MeterDataSet, useMeterContext } from "./meter-context.tsx";

export interface MeterTrackOptions {}

export interface MeterTrackCommonProps<_T extends HTMLElement = HTMLElement> {}

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
