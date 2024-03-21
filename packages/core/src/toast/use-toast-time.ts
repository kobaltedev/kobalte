import { clamp } from "@kobalte/utils";
import { Accessor, createEffect, createSignal, onCleanup } from "solid-js";
import { useToastContext } from "./toast-context";
import { useToastRegionContext } from "./toast-region-context";

/**
 * Times and fractions regarding a toast's elapsed and remaining time open.
 */
export interface ToastTime {
	/**
	 * The time this toast has been open in milliseconds, not accounting for paused time.
	 * Range: `0` to `duration` of the toast, increasing over time.
	 */
	elapsedTime: Accessor<number>;
	/**
	 * The fraction of this toast's duration it has been open, not accounting for paused time.
	 * Range: `0` to `1`, increasing over time.
	 */
	elapsedFraction: Accessor<number>;
	/**
	 * The time this toast will been open before it is closed in milliseconds, not accounting for paused time.
	 * Range: `0` to `duration` of the toast, decreasing over time.
	 */
	remainingTime: Accessor<number>;
	/**
	 * The fraction of this toast's duration it will been open before it is closed, not accounting for paused time.
	 * Range: `0` to `1`, decreasing over time.
	 */
	remainingFraction: Accessor<number>;
}

/**
 * Compute times and fractions regarding this toast's elapsed and remaining time open.
 *
 * @example
 *
 * ```js
 * const {
 *   elapsedTime,
 *   elapsedFraction,
 *   remainingTime,
 *   remainingFraction,
 * } = useToastTime();
 * ```
 */
export function useToastTime(): ToastTime {
	const rootContext = useToastRegionContext();
	const context = useToastContext();

	const [elapsedTime, setElapsedTime] = createSignal(0);
	const remainingTime = () => {
		const duration = context.duration();
		return clamp(duration - elapsedTime(), 0, duration);
	};
	const elapsedFraction = () => clamp(elapsedTime() / context.duration(), 0, 1);
	const remainingFraction = () => 1 - elapsedFraction();

	const timeSinceStart = () =>
		new Date().getTime() - context.closeTimerStartTime();

	let totalElapsedTime = 0;

	createEffect(() => {
		if (rootContext.isPaused() || context.isPersistent()) {
			return;
		}

		const intervalId = setInterval(() => {
			setElapsedTime(timeSinceStart() + totalElapsedTime);
		});

		onCleanup(() => {
			totalElapsedTime += timeSinceStart();
			clearInterval(intervalId);
		});
	});

	return {
		elapsedTime,
		elapsedFraction,
		remainingTime,
		remainingFraction,
	};
}
