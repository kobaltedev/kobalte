/*
 * Portions of this file are based on code from radix-ui-primitives.
 * MIT Licensed, Copyright (c) 2022 WorkOS.
 *
 * Credits to the Radix UI team:
 * https://github.com/radix-ui/primitives/blob/81b25f4b40c54f72aeb106ca0e64e1e09655153e/packages/react/menu/src/Menu.tsx
 */

import { type Polygon, isPointInPolygon } from "@kobalte/utils";

import type { BasePlacement, Placement } from "../popper/utils";

export type Side = "left" | "right";
export type GraceIntent = { area: Polygon; side: Side };

/**
 * Construct a polygon based on pointer clientX/clientY and an element bounding rect.
 */
export function getPointerGraceArea(
	placement: Placement,
	event: PointerEvent,
	contentEl: Element,
) {
	const basePlacement = placement.split("-")[0] as BasePlacement;

	const contentRect = contentEl.getBoundingClientRect();

	const polygon: Polygon = [];

	const pointerX = event.clientX;
	const pointerY = event.clientY;

	switch (basePlacement) {
		case "top":
			polygon.push([pointerX, pointerY + 5]);
			polygon.push([contentRect.left, contentRect.bottom]);
			polygon.push([contentRect.left, contentRect.top]);
			polygon.push([contentRect.right, contentRect.top]);
			polygon.push([contentRect.right, contentRect.bottom]);
			break;
		case "right":
			polygon.push([pointerX - 5, pointerY]);
			polygon.push([contentRect.left, contentRect.top]);
			polygon.push([contentRect.right, contentRect.top]);
			polygon.push([contentRect.right, contentRect.bottom]);
			polygon.push([contentRect.left, contentRect.bottom]);
			break;
		case "bottom":
			polygon.push([pointerX, pointerY - 5]);
			polygon.push([contentRect.right, contentRect.top]);
			polygon.push([contentRect.right, contentRect.bottom]);
			polygon.push([contentRect.left, contentRect.bottom]);
			polygon.push([contentRect.left, contentRect.top]);
			break;
		case "left":
			polygon.push([pointerX + 5, pointerY]);
			polygon.push([contentRect.right, contentRect.bottom]);
			polygon.push([contentRect.left, contentRect.bottom]);
			polygon.push([contentRect.left, contentRect.top]);
			polygon.push([contentRect.right, contentRect.top]);
			break;
	}

	return polygon;
}

export function isPointerInGraceArea(event: PointerEvent, area?: Polygon) {
	if (!area) {
		return false;
	}

	return isPointInPolygon([event.clientX, event.clientY], area);
}
