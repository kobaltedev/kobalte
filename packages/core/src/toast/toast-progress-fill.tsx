import {
	type JSX,
	type ValidComponent,
	createEffect,
	createSignal,
	onCleanup,
	splitProps,
} from "solid-js";

import { combineStyle } from "@solid-primitives/props";
import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";
import { useToastContext } from "./toast-context";
import { useToastRegionContext } from "./toast-region-context";

export interface ToastProgressFillOptions {}

export interface ToastProgressFillCommonProps<
	T extends HTMLElement = HTMLElement,
> {
	style?: JSX.CSSProperties | string;
}

export interface ToastProgressFillRenderProps
	extends ToastProgressFillCommonProps {}

export type ToastProgressFillProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = ToastProgressFillOptions &
	Partial<ToastProgressFillCommonProps<ElementOf<T>>>;

/**
 * The component that visually represents the toast remaining lifetime.
 * Used to visually show the fill of `Toast.ProgressTrack`.
 */
export function ToastProgressFill<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, ToastProgressFillProps<T>>,
) {
	const rootContext = useToastRegionContext();
	const context = useToastContext();

	const [local, others] = splitProps(props as ToastProgressFillProps, [
		"style",
	]);

	const [lifeTime, setLifeTime] = createSignal(100);
	let totalElapsedTime = 0;

	createEffect(() => {
		if (rootContext.isPaused() || context.isPersistent()) {
			return;
		}

		const intervalId = setInterval(() => {
			const elapsedTime =
				new Date().getTime() - context.closeTimerStartTime() + totalElapsedTime;

			const life = Math.trunc(100 - (elapsedTime / context.duration()) * 100);
			setLifeTime(life < 0 ? 0 : life);
		});

		onCleanup(() => {
			totalElapsedTime += new Date().getTime() - context.closeTimerStartTime();
			clearInterval(intervalId);
		});
	});

	return (
		<Polymorphic<ToastProgressFillRenderProps>
			as="div"
			style={combineStyle(
				{
					"--kb-toast-progress-fill-width": `${lifeTime()}%`,
				},
				local.style,
			)}
			{...others}
		/>
	);
}
