import type { ValidComponent } from "solid-js";

import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";

export interface ToastProgressTrackOptions {}

export interface ToastProgressTrackCommonProps<
	T extends HTMLElement = HTMLElement,
> {}

export interface ToastProgressTrackRenderProps
	extends ToastProgressTrackCommonProps {
	"aria-hidden": "true";
	role: "presentation";
}

export type ToastProgressTrackProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = ToastProgressTrackOptions &
	Partial<ToastProgressTrackCommonProps<ElementOf<T>>>;

/**
 * The component that visually represents the toast lifetime.
 * Act as a container for `Toast.ProgressFill`.
 */
export function ToastProgressTrack<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, ToastProgressTrackProps<T>>,
) {
	return (
		<Polymorphic<ToastProgressTrackRenderProps>
			as="div"
			aria-hidden="true"
			role="presentation"
			{...(props as ToastProgressTrackProps)}
		/>
	);
}
