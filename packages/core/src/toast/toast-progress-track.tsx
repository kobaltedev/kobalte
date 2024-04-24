import { ValidComponent } from "solid-js";

import { Polymorphic, PolymorphicProps } from "../polymorphic";

export interface ToastProgressTrackOptions {}

export interface ToastProgressTrackCommonProps {
}

export interface ToastProgressTrackRenderProps extends ToastProgressTrackCommonProps {
	"aria-hidden": "true";
	role: "presentation";
}

export type ToastProgressTrackProps = ToastProgressTrackOptions & Partial<ToastProgressTrackCommonProps>;

/**
 * The component that visually represents the toast lifetime.
 * Act as a container for `Toast.ProgressFill`.
 */
export function ToastProgressTrack<T extends ValidComponent = "div">(props: PolymorphicProps<T, ToastProgressTrackProps>) {
	return (
		<Polymorphic<ToastProgressTrackRenderProps> as="div" aria-hidden="true" role="presentation" {...props as ToastProgressTrackProps} />
	);
}
