import { ValidComponent } from "solid-js";
import { Polymorphic, PolymorphicProps } from "../polymorphic";
import { ProgressDataSet, useProgressContext } from "./progress-context";

export interface ProgressTrackOptions {}

export interface ProgressTrackCommonProps {}

export interface ProgressTrackRenderProps
	extends ProgressTrackCommonProps,
		ProgressDataSet {}

export type ProgressTrackProps = ProgressTrackOptions &
	Partial<ProgressTrackCommonProps>;

/**
 * The component that visually represents the progress track.
 * Act as a container for `Progress.Fill`.
 */
export function ProgressTrack<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, ProgressTrackProps>,
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
