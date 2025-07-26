import { describe, expect, it } from "vitest";
import type { ColorChannel } from "./types";
import { parseColor } from "./utils";

const hexValues = [{ raw: "#000000", string: "#000000" }];
const hexaValues = [{ raw: "#00000080", string: "#00000080" }];
const rgbValues = [
	{ raw: "rgb(50 100 200)", alpha: false, string: "rgb(50, 100, 200)" },
	{
		raw: "rgb(50 100 200 / 0.2)",
		alpha: true,
		string: "rgb(50, 100, 200 / 0.2)",
	},
	{
		raw: "rgb(50 100 200 / 20%)",
		alpha: true,
		string: "rgb(50, 100, 200 / 0.2)",
	},
	{
		raw: "rgba(50, 100, 200, 0.2)",
		alpha: true,
		string: "rgb(50, 100, 200 / 0.2)",
	},
	{ raw: "rgb(50, 100, 200)", alpha: false, string: "rgb(50, 100, 200)" },
	{ raw: "rgb(50,100,200)", alpha: false, string: "rgb(50, 100, 200)" },
];

describe("parseColor", () => {
	describe("RGBColor", () => {
		it.each(rgbValues)("correct parse string %s to color", (item) => {
			const result = parseColor(item.raw);
			expect(result.getColorSpace()).toBe("rgb");
			expect(result.getColorChannels()).toStrictEqual<
				[ColorChannel, ColorChannel, ColorChannel]
			>(["red", "green", "blue"]);
		});

		it.each(rgbValues)("correct result toString", (item) => {
			const result = parseColor(item.raw);
			expect(result.toString()).toBe(item.string);
		});

		it("correct result toString from rgb to hex", () => {
			const result = parseColor("rgb(0 0 0)");
			expect(result.toString("hex")).toBe("#000000");
		});

		it("correct result toString from rgb to hexa", () => {
			const result = parseColor("rgb(0 0 0 / 0.5)");
			expect(result.toString("hexa")).toBe("#00000080");
		});

		it("correct result toString from rgb to hsl", () => {
			const result = parseColor("rgb(50 100 200)");
			expect(result.toFormat("hsl").toString("hsl")).toBe(
				"hsl(220 60% 49.02%)",
			);
		});

		it("correct result toString from rgb to hsla", () => {
			const result = parseColor("rgb(50 100 200 / 0.5)");
			expect(result.toFormat("hsla").toString("hsla")).toBe(
				"hsla(220 60% 49.02% / 0.5)",
			);
		});

		it.each(rgbValues)(
			"correctly parses and converts to various formats",
			(item) => {
				const result = parseColor(item.raw);

				// Verify initial color space and channels
				expect(result.getColorSpace()).toBe("rgb");
				expect(result.getColorChannels()).toStrictEqual<
					[ColorChannel, ColorChannel, ColorChannel]
				>(["red", "green", "blue"]);

				// Verify string representation
				expect(result.toString()).toBe(item.string);

				// Verify conversion to hex
				if (!item.alpha) {
					expect(result.toString("hex")).toBe("#3264C8");
				}

				// Verify conversion to hexa
				if (item.alpha) {
					expect(result.toString("hexa")).toBe("#3264C833");
				}

				// Verify conversion to HSL
				const hslResult = result.toFormat("hsl");

				// Verify conversion to HSLA
				if (item.alpha) {
					expect(hslResult.toString("hsl")).toBe("hsl(220 60% 49.02% / 0.2)");

					const hslaResult = result.toFormat("hsla");
					expect(hslaResult.toString("hsla")).toBe(
						"hsla(220 60% 49.02% / 0.2)",
					);
				} else {
					expect(hslResult.toString("hsl")).toBe("hsl(220 60% 49.02%)");
				}

				// Verify conversion to HSB
				const hsbResult = result.toFormat("hsb");
				expect(hsbResult.toString("hsb")).toBe("hsb(220 75% 78.43%)");

				// Verify conversion to HSBA
				if (item.alpha) {
					const hsbaResult = result.toFormat("hsba");
					expect(hsbaResult.toString("hsba")).toBe("hsba(220 75% 78.43% 0.2)");
				}
			},
		);

		it("throws an error for invalid color strings", () => {
			const invalidColors = ["invalid", "#zzzzzz"];
			for (const color of invalidColors) {
				expect(() => parseColor(color)).toThrowError(
					`Invalid color value: ${color}`,
				);
			}
		});

		it("handles edge cases for alpha values", () => {
			const result = parseColor("rgb(50 100 200 / 0)");
			expect(result.toFormat("hsba").toString("hsba")).toBe(
				"hsba(220 75% 78.43% 0)",
			);
		});
	});
});
