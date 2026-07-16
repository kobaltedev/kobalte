import { parseColor } from "@kobalte/core/colors";
import style from "./color-swatch.module.css";

import { ColorSwatch } from "@kobalte/core/color-swatch";

export function BasicExample() {
	return (
		<ColorSwatch
			class={style.ColorSwatchRoot}
			value={parseColor("hsl(200, 98%, 39%)")}
		/>
	);
}

export function ValueExample() {
	return (
		<ColorSwatch class={style.ColorSwatchRoot} value={parseColor("#7f0000")} />
	);
}

export function CustomColorNameExample() {
	return (
		<ColorSwatch
			class={style.ColorSwatchRoot}
			value={parseColor("hsl(200, 98%, 39%)")}
			colorName="Kobalte blue"
		/>
	);
}
