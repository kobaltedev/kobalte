import { ColorSlider } from "@kobalte/core/color-slider";
import { parseColor } from "@kobalte/core/colors";
import { createSignal } from "solid-js";
import style from "./color-slider.module.css";

export function BasicExample() {
	return (
		<ColorSlider
			class={style.ColorSliderRoot}
			defaultValue={parseColor("rgb(2, 132, 197)")}
			channel="blue"
		>
			<div class={style.ColorSliderLabel}>
				<ColorSlider.Label>Blue</ColorSlider.Label>
				<ColorSlider.ValueLabel />
			</div>
			<ColorSlider.Track class={style.ColorSliderTrack}>
				<ColorSlider.Thumb class={style.ColorSliderThumb}>
					<ColorSlider.Input />
				</ColorSlider.Thumb>
			</ColorSlider.Track>
		</ColorSlider>
	);
}

export function DefaultValueExample() {
	return (
		<ColorSlider
			class={style.ColorSliderRoot}
			defaultValue={parseColor("hsl(0, 100%, 50%)")}
			channel="hue"
		>
			<div class={style.ColorSliderLabel}>
				<ColorSlider.Label>Hue</ColorSlider.Label>
				<ColorSlider.ValueLabel />
			</div>
			<ColorSlider.Track class={style.ColorSliderTrack}>
				<ColorSlider.Thumb class={style.ColorSliderThumb}>
					<ColorSlider.Input />
				</ColorSlider.Thumb>
			</ColorSlider.Track>
		</ColorSlider>
	);
}

export function ControlledValueExample() {
	const [value, setValue] = createSignal(parseColor("hsl(0, 100%, 50%)"));
	return (
		<ColorSlider
			class={style.ColorSliderRoot}
			value={value()}
			onChange={setValue}
			channel="hue"
		>
			<div class={style.ColorSliderLabel}>
				<ColorSlider.Label>Hue</ColorSlider.Label>
				<ColorSlider.ValueLabel />
			</div>
			<ColorSlider.Track class={style.ColorSliderTrack}>
				<ColorSlider.Thumb class={style.ColorSliderThumb}>
					<ColorSlider.Input />
				</ColorSlider.Thumb>
			</ColorSlider.Track>
		</ColorSlider>
	);
}

export function VerticalSliderExample() {
	return (
		<ColorSlider
			class={style.ColorSliderRoot}
			defaultValue={parseColor("#ff00ff")}
			channel="red"
			orientation="vertical"
		>
			<div class={style.ColorSliderLabel}>
				<ColorSlider.Label>Red</ColorSlider.Label>
				<ColorSlider.ValueLabel />
			</div>
			<ColorSlider.Track class={style.ColorSliderTrack}>
				<ColorSlider.Thumb class={style.ColorSliderThumb}>
					<ColorSlider.Input />
				</ColorSlider.Thumb>
			</ColorSlider.Track>
		</ColorSlider>
	);
}

export function CustomValueExample() {
	return (
		<ColorSlider
			class={style.ColorSliderRoot}
			defaultValue={parseColor("#ff00ff")}
			channel="green"
			getValueLabel={(param) => `${param.toFormat("rgb")}`}
		>
			<div class={style.ColorSliderLabel}>
				<ColorSlider.ValueLabel />
			</div>
			<ColorSlider.Track class={style.ColorSliderTrack}>
				<ColorSlider.Thumb class={style.ColorSliderThumb}>
					<ColorSlider.Input />
				</ColorSlider.Thumb>
			</ColorSlider.Track>
		</ColorSlider>
	);
}
