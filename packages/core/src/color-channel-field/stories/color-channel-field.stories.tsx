import type { Color, ColorChannel } from "@solid-primitives/utils/colors";
import { parseColor } from "@solid-primitives/utils/colors";
import { createSignal } from "solid-js";
import preview from "../../../../../.storybook/preview.js";
import {
	DecrementTrigger,
	Description,
	ErrorMessage,
	IncrementTrigger,
	Input,
	Label,
	Root,
} from "../index.tsx";
import style from "./stories.module.css";

const meta = preview.meta({
	title: "Components/ColorChannelField",
	tags: ["autodocs"],
	argTypes: {
		channel: {
			control: "select",
			options: [
				"hue",
				"saturation",
				"lightness",
				"red",
				"green",
				"blue",
				"alpha",
			],
		},
		disabled: { control: "boolean" },
	},
	args: {
		channel: "hue",
		disabled: false,
	},
});

export default meta;

/** Single channel field driven by the selected channel control. */
export const Default = meta.story({
	name: "Default",
	args: { channel: "hue", disabled: false },
	render: (args) => (
		<Root
			class={style.root}
			channel={args.channel as ColorChannel}
			defaultValue={parseColor("hsl(200, 70%, 50%)")}
			disabled={args.disabled as boolean}
		>
			<Label class={style.label}>{String(args.channel)}</Label>
			<div class={style.inputWrap}>
				<DecrementTrigger class={[style.btn, style.btnFirst]}>
					−
				</DecrementTrigger>
				<Input class={style.input} />
				<IncrementTrigger class={[style.btn, style.btnLast]}>
					+
				</IncrementTrigger>
			</div>
		</Root>
	),
});

/** Controlled — hue channel synced to a signal. */
function ControlledDemo() {
	const [color, setColor] = createSignal<Color>(
		parseColor("hsl(200, 70%, 50%)"),
	);
	return (
		<div class={style.controlledWrapper}>
			<Root
				class={style.root}
				channel="hue"
				value={color()}
				onChange={setColor}
			>
				<Label class={style.label}>Hue</Label>
				<div class={style.inputWrap}>
					<DecrementTrigger class={[style.btn, style.btnFirst]}>
						−
					</DecrementTrigger>
					<Input class={style.input} />
					<IncrementTrigger class={[style.btn, style.btnLast]}>
						+
					</IncrementTrigger>
				</div>
			</Root>
			<p class={style.text}>
				Color: <strong>{color().toString("css")}</strong>
			</p>
		</div>
	);
}

export const Controlled = meta.story({
	name: "Controlled",
	render: () => <ControlledDemo />,
});

/** All HSL channels as a combined editor. */
function HSLEditorDemo() {
	const [color, setColor] = createSignal<Color>(
		parseColor("hsl(200, 70%, 50%)"),
	);
	const channels: ColorChannel[] = ["hue", "saturation", "lightness"];
	return (
		<div class={style.hslEditorWrapper}>
			{channels.map((ch) => (
				<Root
					class={style.root}
					channel={ch}
					value={color()}
					onChange={setColor}
				>
					<Label class={style.label}>
						{ch.charAt(0).toUpperCase() + ch.slice(1)}
					</Label>
					<div class={style.inputWrap}>
						<DecrementTrigger class={[style.btn, style.btnFirst]}>
							−
						</DecrementTrigger>
						<Input class={style.input} />
						<IncrementTrigger class={[style.btn, style.btnLast]}>
							+
						</IncrementTrigger>
					</div>
				</Root>
			))}
			<div
				class={style.previewBox}
				style={{ "background-color": color().toString("css") }}
			/>
		</div>
	);
}

export const HSLEditor = meta.story({
	name: "HSL Editor",
	render: () => <HSLEditorDemo />,
});

/** Disabled channel field. */
export const Disabled = meta.story({
	name: "Disabled",
	render: () => (
		<Root
			class={style.root}
			channel="saturation"
			defaultValue={parseColor("hsl(200, 70%, 50%)")}
			disabled
		>
			<Label class={style.labelDisabled}>Saturation</Label>
			<div class={style.inputWrap}>
				<DecrementTrigger class={[style.btn, style.btnFirst]}>
					−
				</DecrementTrigger>
				<Input class={style.input} />
				<IncrementTrigger class={[style.btn, style.btnLast]}>
					+
				</IncrementTrigger>
			</div>
		</Root>
	),
});

/** Alpha channel field. */
export const Alpha = meta.story({
	name: "Alpha Channel",
	render: () => (
		<Root
			class={style.root}
			channel="alpha"
			defaultValue={parseColor("hsla(200, 70%, 50%, 0.5)")}
		>
			<Label class={style.label}>Opacity</Label>
			<div class={style.inputWrap}>
				<DecrementTrigger class={[style.btn, style.btnFirst]}>
					−
				</DecrementTrigger>
				<Input class={style.input} />
				<IncrementTrigger class={[style.btn, style.btnLast]}>
					+
				</IncrementTrigger>
			</div>
			<Description class={style.description}>
				Adjusts color transparency.
			</Description>
		</Root>
	),
});

/** With validation error. */
export const Invalid = meta.story({
	name: "Invalid",
	render: () => (
		<Root
			class={style.root}
			channel="lightness"
			defaultValue={parseColor("hsl(0, 0%, 5%)")}
			validationState="invalid"
		>
			<Label class={style.label}>Lightness</Label>
			<div class={style.inputWrap}>
				<DecrementTrigger class={[style.btn, style.btnFirst]}>
					−
				</DecrementTrigger>
				<Input class={style.input} />
				<IncrementTrigger class={[style.btn, style.btnLast]}>
					+
				</IncrementTrigger>
			</div>
			<ErrorMessage class={style.error}>
				Value is too dark — choose above 20%.
			</ErrorMessage>
		</Root>
	),
});
