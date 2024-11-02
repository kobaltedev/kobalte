import { ColorWheel } from "@kobalte/core/color-wheel";
import { parseColor } from "@kobalte/core/colors";
import { createSignal } from "solid-js";
import style from "./color-wheel.module.css";

export function BasicExample() {
	return (
		<ColorWheel class={style.ColorWheelRoot} thickness={24}>
			<ColorWheel.Track class={style.ColorWheelTrack}>
				<ColorWheel.Thumb class={style.ColorWheelThumb}>
					<ColorWheel.Input />
				</ColorWheel.Thumb>
			</ColorWheel.Track>
		</ColorWheel>
	);
}

export function DefaultValueExample() {
	return (
		<ColorWheel
			class={style.ColorWheelRoot}
			defaultValue={parseColor("hsl(80, 100%, 50%)")}
			thickness={24}
		>
			<ColorWheel.Track class={style.ColorWheelTrack}>
				<ColorWheel.Thumb class={style.ColorWheelThumb}>
					<ColorWheel.Input />
				</ColorWheel.Thumb>
			</ColorWheel.Track>
		</ColorWheel>
	);
}

export function ThicknessExample() {
	return (
		<ColorWheel class={style.ColorWheelRoot} thickness={56}>
			<ColorWheel.Track class={style.ColorWheelTrack}>
				<ColorWheel.Thumb class={style.ColorWheelThumb}>
					<ColorWheel.Input />
				</ColorWheel.Thumb>
			</ColorWheel.Track>
		</ColorWheel>
	);
}

export function ControlledValueExample() {
	const [value, setValue] = createSignal(parseColor("hsl(0, 100%, 50%)"));

	return (
		<>
			<ColorWheel
				class={style.ColorWheelRoot}
				value={value()}
				onChange={setValue}
				thickness={24}
			>
				<ColorWheel.Track class={style.ColorWheelTrack}>
					<ColorWheel.Thumb class={style.ColorWheelThumb}>
						<ColorWheel.Input />
					</ColorWheel.Thumb>
				</ColorWheel.Track>
			</ColorWheel>
			<p class="not-prose text-sm mt-4">
				Current color value: {value().toString("hsl")}
			</p>
		</>
	);
}

export function CustomValueLabelExample() {
	return (
		<ColorWheel
			class={style.ColorWheelRoot}
			thickness={24}
			getValueLabel={(color) =>
				color
					.toFormat("hsl")
					.withChannelValue("saturation", 100)
					.withChannelValue("lightness", 50)
					.withChannelValue("alpha", 1)
					.toString()
			}
		>
			<div class={style.ColorWheelLabel}>
				<ColorWheel.ValueLabel />
			</div>
			<ColorWheel.Track class={style.ColorWheelTrack}>
				<ColorWheel.Thumb class={style.ColorWheelThumb}>
					<ColorWheel.Input />
				</ColorWheel.Thumb>
			</ColorWheel.Track>
		</ColorWheel>
	);
}

export function HTMLFormExample() {
	let formRef: HTMLFormElement | undefined;

	const onSubmit = (e: SubmitEvent) => {
		e.preventDefault();
		e.stopPropagation();

		const formData = new FormData(formRef);

		alert(JSON.stringify(Object.fromEntries(formData), null, 2));
	};

	return (
		<form
			ref={formRef}
			onSubmit={onSubmit}
			class="flex flex-col items-center space-y-6"
		>
			<ColorWheel class={style.ColorWheelRoot} name="hue" thickness={24}>
				<ColorWheel.Track class={style.ColorWheelTrack}>
					<ColorWheel.Thumb class={style.ColorWheelThumb}>
						<ColorWheel.Input />
					</ColorWheel.Thumb>
				</ColorWheel.Track>
			</ColorWheel>
			<div class="flex space-x-2">
				<button type="reset" class="kb-button">
					Reset
				</button>
				<button type="submit" class="kb-button-primary">
					Submit
				</button>
			</div>
		</form>
	);
}
