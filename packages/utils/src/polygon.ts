/*
 * Portions of this file are based on code from ariakit.
 * MIT Licensed, Copyright (c) Diego Haz.
 *
 * Credits to the Ariakit team:
 * https://github.com/ariakit/ariakit/blob/84e97943ad637a582c01c9b56d880cd95f595737/packages/ariakit/src/hovercard/__utils/polygon.ts
 * https://github.com/ariakit/ariakit/blob/f2a96973de523d67e41eec983263936c489ef3e2/packages/ariakit/src/hovercard/__utils/debug-polygon.ts
 */

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
		} else if (y === yi && ((x >= xj && x <= xi) || (x >= xi && x <= xj))) {
			// point on horizontal edge
			return true;
		}
	}
	return inside;
}

/* -------------------------------------------------------------------------------------------------
 * Debug polygon
 * -----------------------------------------------------------------------------------------------*/

function getPolygon() {
	const id = "debug-polygon";
	const existingPolygon = document.getElementById(id);
	if (existingPolygon) {
		return existingPolygon;
	}
	const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
	svg.style.top = "0";
	svg.style.left = "0";
	svg.style.width = "100%";
	svg.style.height = "100%";
	svg.style.fill = "green";
	svg.style.opacity = "0.2";
	svg.style.position = "fixed";
	svg.style.pointerEvents = "none";
	svg.style.zIndex = "999999";
	const polygon = document.createElementNS(
		"http://www.w3.org/2000/svg",
		"polygon",
	);
	polygon.setAttribute("id", id);
	polygon.setAttribute("points", "0,0 0,0");
	svg.appendChild(polygon);
	document.body.appendChild(svg);
	return polygon;
}

export function debugPolygon(polygon: Polygon) {
	const polygonElement = getPolygon();
	const points = polygon.map((point) => point.join(",")).join(" ");
	polygonElement.setAttribute("points", points);
	// Return SVG element
	return polygonElement.parentElement;
}
