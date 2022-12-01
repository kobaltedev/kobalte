/*!
 * Portions of this file are based on code from ariakit.
 * MIT Licensed, Copyright (c) Diego Haz.
 *
 * Credits to the Ariakit team:
 * https://github.com/ariakit/ariakit/blob/84e97943ad637a582c01c9b56d880cd95f595737/packages/ariakit/src/hovercard/__utils/polygon.ts
 */

import { BasePlacement, Placement } from "../popover/utils";

export type Point = [number, number];
export type Polygon = Point[];

export function getEventPoint(event: MouseEvent): Point {
  return [event.clientX, event.clientY];
}

// Based on https://github.com/metafloor/pointinpoly
export function isPointInPolygon(point: Point, polygon: Polygon) {
  const [x, y] = point;
  let inside = false;
  const length = polygon.length;
  for (let l = length, i = 0, j = l - 1; i < l; j = i++) {
    const [xi, yi] = polygon[i] as Point;
    const [xj, yj] = polygon[j] as Point;
    const [, vy] = polygon[j === 0 ? l - 1 : j - 1] || [0, 0];
    const where = (yi - yj) * (x - xi) - (xi - xj) * (y - yi);
    if (yj < yi) {
      if (y >= yj && y < yi) {
        // point on the line
        if (where === 0) return true;
        if (where > 0) {
          if (y === yj) {
            // ray intersects vertex
            if (y > vy) {
              inside = !inside;
            }
          } else {
            inside = !inside;
          }
        }
      }
    } else if (yi < yj) {
      if (y > yi && y <= yj) {
        // point on the line
        if (where === 0) return true;
        if (where < 0) {
          if (y === yj) {
            // ray intersects vertex
            if (y < vy) {
              inside = !inside;
            }
          } else {
            inside = !inside;
          }
        }
      }
    } else if (y == yi && ((x >= xj && x <= xi) || (x >= xi && x <= xj))) {
      // point on horizontal edge
      return true;
    }
  }
  return inside;
}

export function getElementPolygon(panelEl: Element, triggerEl: Element, placement: Placement) {
  const basePlacement = placement.split("-")[0] as BasePlacement;

  const panelRect = panelEl.getBoundingClientRect();
  const triggerRect = triggerEl.getBoundingClientRect();

  const { top, right, bottom, left } = panelRect;

  const x = basePlacement === "left" ? "right" : basePlacement === "right" ? "left" : null;
  const y = basePlacement === "top" ? "bottom" : basePlacement === "bottom" ? "top" : null;

  const polygon: Polygon = [];

  if (x) {
    polygon.push([x === "right" ? triggerRect.left : triggerRect.right, triggerRect.top]);
  }

  if (y) {
    polygon.push([triggerRect.left, y === "top" ? triggerRect.bottom : triggerRect.top]);
  }

  if (x) {
    if (y !== "top") {
      polygon.push([x === "left" ? left : right, top]);
    }

    polygon.push([x === "left" ? right : left, top]);
    polygon.push([x === "left" ? right : left, bottom]);

    if (y !== "bottom") {
      polygon.push([x === "left" ? left : right, bottom]);
    }
  } else if (y === "top") {
    polygon.push([left, top]);
    polygon.push([left, bottom]);
    polygon.push([right, bottom]);
    polygon.push([right, top]);
  } else {
    polygon.push([left, bottom]);
    polygon.push([left, top]);
    polygon.push([right, top]);
    polygon.push([right, bottom]);
  }

  if (x) {
    polygon.push([x === "right" ? triggerRect.left : triggerRect.right, triggerRect.bottom]);
  }

  if (y) {
    polygon.push([triggerRect.right, y === "top" ? triggerRect.bottom : triggerRect.top]);
  }

  return polygon;
}
