import { ColorArea } from "@kobalte/core/color-area";
import { parseColor } from "@kobalte/core/colors";
import { createSignal } from "solid-js";
import style from "./color-area.module.css";

export function BasicExample() {
	return (
		<ColorArea
			class={style.ColorAreaRoot}
			defaultValue={parseColor("rgb(2, 132, 197)")}
		>
			<ColorArea.Background class={style.ColorAreaBackground}>
				<ColorArea.Thumb class={style.ColorAreaThumb}>
					<ColorArea.HiddenInputX />
					<ColorArea.HiddenInputY />
				</ColorArea.Thumb>
			</ColorArea.Background>
		</ColorArea>
	);
}

export function DefaultValueExample() {
	return (
		<ColorArea
			class={style.ColorAreaRoot}
			defaultValue={parseColor("hsb(219, 58%, 93%)")}
		>
			<ColorArea.Background class={style.ColorAreaBackground}>
				<ColorArea.Thumb class={style.ColorAreaThumb}>
					<ColorArea.HiddenInputX />
					<ColorArea.HiddenInputY />
				</ColorArea.Thumb>
			</ColorArea.Background>
		</ColorArea>
	);
}

export function ControlledValueExample() {
	const [value, setValue] = createSignal(parseColor("hsl(0, 100%, 50%)"));
	return (
		<>
			<ColorArea
				class={style.ColorAreaRoot}
				value={value()}
				onChange={setValue}
			>
				<ColorArea.Background class={style.ColorAreaBackground}>
					<ColorArea.Thumb class={style.ColorAreaThumb}>
						<ColorArea.HiddenInputX />
						<ColorArea.HiddenInputY />
					</ColorArea.Thumb>
				</ColorArea.Background>
			</ColorArea>
			<p class="not-prose text-sm mt-4">
				Current color value: {value().toString("hsl")}
			</p>
		</>
	);
}

export function XAndYChannelExample() {
	const [value, setValue] = createSignal(parseColor("rgb(100, 149, 237)"));
	const [rChannel, gChannel, bChannel] = value().getColorChannels();
	return (
		<ColorArea
			class={style.ColorAreaRoot}
			value={value()}
			onChange={setValue}
			xChannel={gChannel}
			yChannel={bChannel}
		>
			<ColorArea.Background class={style.ColorAreaBackground}>
				<ColorArea.Thumb class={style.ColorAreaThumb}>
					<ColorArea.HiddenInputX />
					<ColorArea.HiddenInputY />
				</ColorArea.Thumb>
			</ColorArea.Background>
		</ColorArea>
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
			<ColorArea
				class={style.ColorAreaRoot}
				defaultValue={parseColor("rgb(100, 149, 237)")}
				xName="red"
				yName="green"
			>
				<ColorArea.Background class={style.ColorAreaBackground}>
					<ColorArea.Thumb class={style.ColorAreaThumb}>
						<ColorArea.HiddenInputX />
						<ColorArea.HiddenInputY />
					</ColorArea.Thumb>
				</ColorArea.Background>
			</ColorArea>
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
