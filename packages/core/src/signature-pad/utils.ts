import { getWindow } from "@kobalte/utils";
import type { DataUrlOptions, Point } from "./types";

const average = (a: number, b: number) => (a + b) / 2;

export const getSvgPathFromStroke = (
	points: number[][],
	closed = true,
): string => {
	const len = points.length;

	if (len < 4) {
		return "";
	}

	let a = points[0];
	let b = points[1];
	const c = points[2];

	let result = `M${a[0].toFixed(2)},${a[1].toFixed(2)} Q${b[0].toFixed(2)},${b[1].toFixed(2)} ${average(b[0], c[0]).toFixed(2)},${average(
		b[1],
		c[1],
	).toFixed(2)} T`;

	for (let i = 2, max = len - 1; i < max; i++) {
		a = points[i];
		b = points[i + 1];
		result += `${average(a[0], b[0]).toFixed(2)},${average(a[1], b[1]).toFixed(2)} `;
	}

	if (closed) {
		result += "Z";
	}

	return result;
};

export const getRelativePoint = (point: Point, element: HTMLElement) => {
	const { left, top } = element.getBoundingClientRect();

	const offset = { x: point.x - left, y: point.y - top };

	return { offset };
};

export const getDataUrl = (
	svg: SVGElement | undefined | null,
	opts?: DataUrlOptions,
): Promise<string> => {
	const { type, quality = 0.9 } = opts ?? {};

	if (!svg) {
		throw new Error("[get-data-url]: could not find the svg element");
	}

	const win = getWindow(svg);
	const doc = win.document;

	const serializer = new XMLSerializer();
	const source = `<?xml version="1.0" standalone="no"?>\r\n${serializer.serializeToString(svg)}`;
	const svgString = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(source)}`;

	if (type === "image/svg+xml") {
		return Promise.resolve(svgString);
	}

	const svgBounds = svg.getBoundingClientRect();
	const dpr = win.devicePixelRatio || 1;

	const canvas = doc.createElement("canvas");
	const image = new Image();
	image.src = svgString;

	canvas.width = svgBounds.width * dpr;
	canvas.height = svgBounds.height * dpr;

	const context = canvas.getContext("2d");
	context!.scale(dpr, dpr);

	return new Promise((resolve) => {
		image.onload = () => {
			context!.drawImage(image, 0, 0);
			resolve(canvas.toDataURL(type, quality));
		};
	});
};
