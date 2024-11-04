/*
 * Original code by Chakra UI
 * MIT Licensed, Copyright (c) 2019 Segun Adebayo.
 *
 * Credits to the Chakra UI team:
 * https://github.com/chakra-ui/zag/tree/main/packages/utilities/dom-event/src/get-point-value.ts
 */

function clamp(value: number) {
	return Math.max(0, Math.min(1, value));
}

export interface PercentValueOptions {
	inverted?: boolean | { x?: boolean; y?: boolean } | undefined;
	dir?: "ltr" | "rtl" | undefined;
	orientation?: "vertical" | "horizontal" | undefined;
}

export function getRelativePoint(point: number[], element: HTMLElement) {
	const { left, top, width, height } = element.getBoundingClientRect();

	const offset = { x: point[0] - left, y: point[1] - top };
	const percent = { x: clamp(offset.x / width), y: clamp(offset.y / height) };

	function getPercentValue(options: PercentValueOptions = {}) {
		const { dir = "ltr", orientation = "horizontal", inverted } = options;

		const invertX = typeof inverted === "object" ? inverted.x : inverted;
		const invertY = typeof inverted === "object" ? inverted.y : inverted;

		if (orientation === "horizontal") {
			return dir === "rtl" || invertX ? 1 - percent.x : percent.x;
		}

		return invertY ? 1 - percent.y : percent.y;
	}

	return { offset, percent, getPercentValue };
}
