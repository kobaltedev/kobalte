/*
 * Portions of this file are based on code from ariakit.
 * MIT Licensed, Copyright (c) Diego Haz.
 *
 * Credits to the Ariakit team:
 * https://github.com/ariakit/ariakit/blob/84e97943ad637a582c01c9b56d880cd95f595737/packages/ariakit/src/hovercard/__utils/polygon.ts
 * https://github.com/ariakit/ariakit/blob/f2a96973de523d67e41eec983263936c489ef3e2/packages/ariakit/src/hovercard/__utils/debug-polygon.ts
 */

import type { Polygon } from "@kobalte/utils";

import type { BasePlacement, Placement } from "../popper/utils";

/**
 * Construct a polygon based on the floating element placement relative to the anchor.
 */
export function getHoverCardSafeArea(
	placement: Placement,
	anchorEl: Element,
	floatingEl: Element,
) {
	const basePlacement = placement.split("-")[0] as BasePlacement;

	const anchorRect = anchorEl.getBoundingClientRect();
	const floatingRect = floatingEl.getBoundingClientRect();

	const polygon: Polygon = [];

	const anchorCenterX = anchorRect.left + anchorRect.width / 2;
	const anchorCenterY = anchorRect.top + anchorRect.height / 2;

	switch (basePlacement) {
		case "top":
			polygon.push([anchorRect.left, anchorCenterY]);
			polygon.push([floatingRect.left, floatingRect.bottom]);
			polygon.push([floatingRect.left, floatingRect.top]);
			polygon.push([floatingRect.right, floatingRect.top]);
			polygon.push([floatingRect.right, floatingRect.bottom]);
			polygon.push([anchorRect.right, anchorCenterY]);
			break;
		case "right":
			polygon.push([anchorCenterX, anchorRect.top]);
			polygon.push([floatingRect.left, floatingRect.top]);
			polygon.push([floatingRect.right, floatingRect.top]);
			polygon.push([floatingRect.right, floatingRect.bottom]);
			polygon.push([floatingRect.left, floatingRect.bottom]);
			polygon.push([anchorCenterX, anchorRect.bottom]);
			break;
		case "bottom":
			polygon.push([anchorRect.left, anchorCenterY]);
			polygon.push([floatingRect.left, floatingRect.top]);
			polygon.push([floatingRect.left, floatingRect.bottom]);
			polygon.push([floatingRect.right, floatingRect.bottom]);
			polygon.push([floatingRect.right, floatingRect.top]);
			polygon.push([anchorRect.right, anchorCenterY]);
			break;
		case "left":
			polygon.push([anchorCenterX, anchorRect.top]);
			polygon.push([floatingRect.right, floatingRect.top]);
			polygon.push([floatingRect.left, floatingRect.top]);
			polygon.push([floatingRect.left, floatingRect.bottom]);
			polygon.push([floatingRect.right, floatingRect.bottom]);
			polygon.push([anchorCenterX, anchorRect.bottom]);
			break;
	}

	return polygon;
}
