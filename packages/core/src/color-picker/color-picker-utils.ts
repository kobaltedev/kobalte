/**
 * Consise implementations by Kamil Kiełczewski
 */

/**
 * input: h in [0,360] and s,v in [0,1] - output: r,g,b in [0,1]
 */
export function hsv2rgb(h: number, s: number, v: number) {
	let f = (n: number, k = (n + h / 60) % 6) => v - v * s * Math.max(Math.min(k, 4 - k, 1), 0);
	return [f(5), f(3), f(1)];
}

/**
 * input: r,g,b in [0,1] - output: h in [0,360] and s,v in [0,1]
 */
export function rgb2hsv(r: number, g: number, b: number) {
	let v = Math.max(r, g, b), c = v - Math.min(r, g, b);
	let h = c && ((v == r) ? (g - b) / c : ((v == g) ? 2 + (b - r) / c : 4 + (r - g) / c));
	return [60 * (h < 0 ? h + 6 : h), v && c / v, v];
}
