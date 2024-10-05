/**
 * Consise implementations by Kamil Kiełczewski
 */

export type CoreColor = [number, number, number];
export type ColorChannel = "hue" | "saturation" | "brightness" | "lightness" | "red" | "green" | "blue" | "alpha" | string;
export type ColorFormat = "rgb" | "hsv" | "hsl" | Color;

abstract class Color {
	/**
	 * Core color will almost certainly be RGB forever.
	 */
	abstract toCoreColor(): CoreColor;
	abstract fromCoreColor(color: CoreColor): void;
	abstract readonly channels: string[];
}

export class RGBColor extends Color {
	constructor(public r: number, public g: number, public b: number) {
		super();
	}

	toCoreColor(): CoreColor {
		return [this.r, this.g, this.b];
	}

	fromCoreColor(color: CoreColor): void {
		[this.r, this.g, this.b] = color;
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
	constructor(public h: number, public s: number, public v: number) {
		super();
	}

	toCoreColor() {
		let f = (n: number, k = (n + this.h / 60) % 6) => this.v - this.v * this.s * Math.max(Math.min(k, 4 - k, 1), 0);
		return [f(5), f(3), f(1)] as CoreColor;
	}

	fromCoreColor([r, g, b]: CoreColor) {
		let v = Math.max(r, g, b), c = v - Math.min(r, g, b);
		let h = c && ((v == r) ? (g - b) / c : ((v == g) ? 2 + (b - r) / c : 4 + (r - g) / c));
		return [60 * (h < 0 ? h + 6 : h), v && c / v, v];
	}

	channels = ["hue", "saturation", "value"];
}

export class HSLColor extends Color {
	/**
	 *
	 * @param h 0-360
	 * @param s 0-1
	 * @param l 0-1
	 */
	constructor(public h: number, public s: number, public l: number) {
		super();
	}

	toCoreColor() {
		let a = this.s * Math.min(this.l, 1 - this.l);
		let f = (n: number, k = (n + this.h / 30) % 12) => this.l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
		return [f(0), f(8), f(4)] as CoreColor;
	}

	fromCoreColor([r, g, b]: CoreColor) {
		let v = Math.max(r, g, b), c = v - Math.min(r, g, b), f = (1 - Math.abs(v + v - c - 1));
		let h = c && ((v == r) ? (g - b) / c : ((v == g) ? 2 + (b - r) / c : 4 + (r - g) / c));
		return [60 * (h < 0 ? h + 6 : h), f ? c / f : 0, (v + v - c) / 2];
	}

	channels = ["hue", "saturation", "lightness"];
}
