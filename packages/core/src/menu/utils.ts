import { Polygon } from "@kobalte/utils";

import { BasePlacement, Placement } from "../popper/utils";

/**
 * Construct a polygon based on pointer clientX/clientY and an element bounding rect.
 */
export function getPointerGracePolygon(
  placement: Placement,
  event: PointerEvent,
  contentEl: Element
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
