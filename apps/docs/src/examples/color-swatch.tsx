import { parseColor } from "../../../../packages/core/src/colors/utils";
import { ColorSwatch } from "../../../../packages/core/src/colors/color-swatch";
import style from "./color-swatch.module.css";

export function BasicExample() {
	return <ColorSwatch class={style.ColorSwatchRoot} value={parseColor("hsl(200, 98%, 39%)")} />;
}

export function ValueExample() {
	return <ColorSwatch class={style.ColorSwatchRoot} value={parseColor("#7f0000")} />;
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
