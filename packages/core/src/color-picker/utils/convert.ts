/**
 * Consise implementations by Kamil Kiełczewski
 */

export type CoreColor = [number, number, number];
export type ColorChannel = "hue" | "saturation" | "brightness" | "lightness" | "red" | "green" | "blue" | "alpha" | string;
export type ColorFormat = "rgb" | "hsv" | "hsl" | Color;

export abstract class Color {
	/**
	 * Core color will almost certainly be RGB forever.
	 */
	abstract toCoreColor(color: number[]): CoreColor;
	abstract fromCoreColor(color: CoreColor): any[];
	abstract readonly channels: ColorChannel[];
}

export class RGBColor extends Color {
	toCoreColor([r, g, b]: CoreColor): CoreColor {
		return [r, g, b];
	}

	fromCoreColor(color: CoreColor): [number, number, number] {
		return color;
	}

	channels = ["red", "green", "blue"];
}

export class HSVColor extends Color {
	/**
	 *
	 * @param h 0-360
	 * @param s 0-1
	 * @param v 0-1
	 */
	toCoreColor([h, s, v]: [number, number, number]): CoreColor {
		let f = (n: number, k = (n + h / 60) % 6) => v - v * s * Math.max(Math.min(k, 4 - k, 1), 0);
		return [f(5), f(3), f(1)] as CoreColor;
	}

	fromCoreColor([r, g, b]: CoreColor): [number, number, number] {
		let v = Math.max(r, g, b), c = v - Math.min(r, g, b);
		let h = c && ((v == r) ? (g - b) / c : ((v == g) ? 2 + (b - r) / c : 4 + (r - g) / c));
		return [60 * (h < 0 ? h + 6 : h), v && c / v, v];
	}

	channels = ["hue", "saturation", "brightness"];
}

export class HSLColor extends Color {
	/**
	 *
	 * @param h 0-360
	 * @param s 0-1
	 * @param l 0-1
	 */
	toCoreColor([h, s, l]: [number, number, number]): CoreColor {
		let a = s * Math.min(l, 1 - l);
		let f = (n: number, k = (n + h / 30) % 12) => l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
		return [f(0), f(8), f(4)] as CoreColor;
	}

	fromCoreColor([r, g, b]: CoreColor): [number, number, number] {
		let v = Math.max(r, g, b), c = v - Math.min(r, g, b), f = (1 - Math.abs(v + v - c - 1));
		let h = c && ((v == r) ? (g - b) / c : ((v == g) ? 2 + (b - r) / c : 4 + (r - g) / c));
		return [60 * (h < 0 ? h + 6 : h), f ? c / f : 0, (v + v - c) / 2];
	}

	channels = ["hue", "saturation", "lightness"];
}

export function coreColorToHex([r, g, b]: CoreColor, a?: number): string {
	return "#" + [r, g, b]
		.map(c => {
			const value = c <= 1 ? Math.round(c * 255) : c;
			return value.toString(16).padStart(2, "0");
		}).join("") +
		(a !== undefined ? Math.round(a * 255).toString(16).padStart(2, "0") : "");
}
