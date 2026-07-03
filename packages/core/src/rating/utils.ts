/*
 * Portions of this file are based on code from zag.
 * MIT License, Copyright 2021 Chakra UI.
 *
 * Credits to the Chakra UI team:
 * https://github.com/chakra-ui/zag/blob/87ebdd171d5e28fffe2cec7d0b0d5f5a68601963/packages/utilities/dom-event/src/get-event-point.ts
 */

type PointType = "page" | "client";
type AnyPointerEvent = MouseEvent | TouchEvent | PointerEvent;
type Point = {
	x: number;
	y: number;
};
type PercentValueOptions = {
	inverted?: boolean | { x?: boolean; y?: boolean } | undefined;
	dir?: "ltr" | "rtl" | undefined;
	orientation?: "vertical" | "horizontal" | undefined;
};

function clamp(value: number) {
	return Math.max(0, Math.min(1, value));
}

function pointFromTouch(e: TouchEvent, type: PointType = "client") {
	const point = e.touches[0] || e.changedTouches[0];
	return { x: point[`${type}X`], y: point[`${type}Y`] };
}

function pointFromMouse(
	point: MouseEvent | PointerEvent,
	type: PointType = "client",
) {
	return { x: point[`${type}X`], y: point[`${type}Y`] };
}

const isTouchEvent = (event: AnyPointerEvent): event is TouchEvent =>
	"touches" in event && event.touches.length > 0;

export function getEventPoint(event: any, type: PointType = "client") {
	return isTouchEvent(event)
		? pointFromTouch(event, type)
		: pointFromMouse(event, type);
}

export function getRelativePoint(point: Point, element: HTMLElement) {
	const { left, top, width, height } = element.getBoundingClientRect();

	const offset = { x: point.x - left, y: point.y - top };
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
