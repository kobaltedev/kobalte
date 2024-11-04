/*
 * Original code by Chakra UI
 * MIT Licensed, Copyright (c) 2019 Segun Adebayo.
 *
 * Credits to the Chakra UI team:
 * https://github.com/chakra-ui/zag/tree/main/packages/utilities/dom-event/src/get-event-point.ts
 */

type PointType = "page" | "client";

function pointFromTouch(e: TouchEvent, type: PointType = "client") {
	const point = e.touches[0] || e.changedTouches[0];
	return [point[`${type}X`], point[`${type}Y`]];
}

function pointFromMouse(
	point: MouseEvent | PointerEvent,
	type: PointType = "client",
) {
	return [point[`${type}X`], point[`${type}Y`]];
}

type AnyPointerEvent = MouseEvent | TouchEvent | PointerEvent;

const isTouchEvent = (event: AnyPointerEvent): event is TouchEvent =>
	"touches" in event && event.touches.length > 0;

export function getEventPoint(event: any, type: PointType = "client") {
	return isTouchEvent(event)
		? pointFromTouch(event, type)
		: pointFromMouse(event, type);
}
