import { createRoot, createSignal } from "solid-js";
import { describe, expect, it, vi } from "vitest";

import { createSliderState } from "./create-slider-state";

describe("createSliderState changing bounds during a drag", () => {
	const cases = [
		{ initial: [80], min: 0, max: 60, expected: [60] },
		{ initial: [20], min: 40, max: 100, expected: [40] },
		{ initial: [20, 80], min: 30, max: 60, expected: [30, 60] },
	].flatMap((bounds) =>
		[false, true].map((controlled) => ({ ...bounds, controlled })),
	);

	it.each(cases)(
		"commits current bounds [$min, $max], controlled=$controlled",
		({ initial, min, max, expected, controlled }) => {
			createRoot((dispose) => {
				try {
					const [minValue, setMin] = createSignal(0);
					const [maxValue, setMax] = createSignal(100);
					const onChangeEnd = vi.fn();
					const state = createSliderState({
						value: () => (controlled ? initial : undefined),
						defaultValue: () => initial,
						minValue,
						maxValue,
						step: () => 1,
						minStepsBetweenThumbs: () => 0,
						numberFormatter: new Intl.NumberFormat("en-US"),
						onChangeEnd,
					});
					state.setThumbEditable(0, true);
					state.setThumbDragging(0, true);
					setMin(min);
					setMax(max);
					state.setThumbDragging(0, false);
					expect(onChangeEnd).toHaveBeenCalledExactlyOnceWith(expected);
					expect(state.values()).toEqual(expected);
				} finally {
					dispose();
				}
			});
		},
	);
});
