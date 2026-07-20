import { ColorArea } from "@kobalte/core/color-area";
import { parseColor } from "@kobalte/core/colors";
import { createSignal } from "solid-js";
import style from "./color-area.module.css";

export function BasicExample() {
	return (
		<ColorArea class={style.ColorAreaRoot}>
			<ColorArea.Label class={style.ColorAreaLabel}>Label</ColorArea.Label>
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
			defaultValue={parseColor("rgb(2, 132, 197)")}
		>
			<ColorArea.Label class={style.ColorAreaLabel}>Label</ColorArea.Label>
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
				<ColorArea.Label class={style.ColorAreaLabel}>Label</ColorArea.Label>
				<ColorArea.Background class={style.ColorAreaBackground}>
					<ColorArea.Thumb class={style.ColorAreaThumb}>
						<ColorArea.HiddenInputX />
						<ColorArea.HiddenInputY />
					</ColorArea.Thumb>
				</ColorArea.Background>
			</ColorArea>
			<p
				style={{
					"font-size": "14px",
					"margin-top": "16px",
					"margin-bottom": 0,
				}}
			>
				Current color value: {value().toString("hsl")}
			</p>
		</>
	);
}

export function XAndYChannelExample() {
	const [value, setValue] = createSignal(parseColor("rgb(100, 149, 237)"));
	const [_rChannel, gChannel, bChannel] = value().getColorChannels();
	return (
		<ColorArea
			class={style.ColorAreaRoot}
			value={value()}
			onChange={setValue}
			xChannel={gChannel}
			yChannel={bChannel}
		>
			<ColorArea.Label class={style.ColorAreaLabel}>Label</ColorArea.Label>
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
			style={{
				display: "flex",
				"flex-direction": "column",
				"align-items": "center",
				gap: "24px",
			}}
		>
			<ColorArea
				class={style.ColorAreaRoot}
				defaultValue={parseColor("rgb(100, 149, 237)")}
				xName="red"
				yName="green"
			>
				<ColorArea.Label class={style.ColorAreaLabel}>Label</ColorArea.Label>
				<ColorArea.Background class={style.ColorAreaBackground}>
					<ColorArea.Thumb class={style.ColorAreaThumb}>
						<ColorArea.HiddenInputX />
						<ColorArea.HiddenInputY />
					</ColorArea.Thumb>
				</ColorArea.Background>
			</ColorArea>
			<div style={{ display: "flex", gap: "8px" }}>
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
