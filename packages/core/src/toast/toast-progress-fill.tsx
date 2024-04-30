import {
	JSX,
	ValidComponent,
	createEffect,
	createSignal,
	onCleanup,
	splitProps,
} from "solid-js";

import { Polymorphic, PolymorphicProps } from "../polymorphic";
import { useToastContext } from "./toast-context";
import { useToastRegionContext } from "./toast-region-context";

export interface ToastProgressFillOptions {}

export interface ToastProgressFillCommonProps {
	/** The HTML styles attribute (object form only). */
	style?: JSX.CSSProperties;
}

export interface ToastProgressFillRenderProps
	extends ToastProgressFillCommonProps {}

export type ToastProgressFillProps = ToastProgressFillOptions &
	Partial<ToastProgressFillCommonProps>;

/**
 * The component that visually represents the toast remaining lifetime.
 * Used to visually show the fill of `Toast.ProgressTrack`.
 */
export function ToastProgressFill<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, ToastProgressFillProps>,
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
			style={{
				"--kb-toast-progress-fill-width": `${lifeTime()}%`,
				...local.style,
			}}
			{...others}
		/>
	);
}
