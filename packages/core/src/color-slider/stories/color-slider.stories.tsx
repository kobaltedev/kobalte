import type { Color, ColorChannel } from "@solid-primitives/utils/colors";
import { parseColor } from "@solid-primitives/utils/colors";
import { createSignal } from "solid-js";
import preview from "../../../../../.storybook/preview.js";
import {
	Description,
	ErrorMessage,
	Input,
	Label,
	Root,
	Thumb,
	Track,
	ValueLabel,
} from "../index.tsx";
import style from "./stories.module.css";

const meta = preview.meta({
	title: "Components/ColorSlider",
	tags: ["autodocs"],
	argTypes: {
		channel: {
			control: "select",
			options: [
				"hue",
				"saturation",
				"lightness",
				"brightness",
				"red",
				"green",
				"blue",
				"alpha",
			],
		},
		orientation: {
			control: "radio",
			options: ["horizontal", "vertical"],
		},
		disabled: { control: "boolean" },
	},
	args: {
		channel: "hue",
		orientation: "horizontal",
		disabled: false,
	},
});

export default meta;

/** Single-channel slider with controls. */
export const Default = meta.story({
	name: "Default",
	args: { channel: "hue", orientation: "horizontal", disabled: false },
	render: (args) => (
		<div class={style.wrapper}>
			<Root
				class={style.root}
				channel={args.channel as ColorChannel}
				orientation={args.orientation as "horizontal" | "vertical"}
				disabled={args.disabled as boolean}
				defaultValue={parseColor("hsl(0, 100%, 50%)")}
			>
				<div class={style.labelRow}>
					<Label class={style.label}>{String(args.channel)}</Label>
					<ValueLabel class={style.valueLabel} />
				</div>
				<Track
					class={style.track}
					style={{ "--kb-color-current": "transparent" }}
				>
					<Thumb class={style.thumb}>
						<Input />
					</Thumb>
				</Track>
			</Root>
		</div>
	),
});

/** Hue slider — the rainbow gradient. */
export const Hue = meta.story({
	name: "Hue",
	render: () => (
		<Root
			class={style.rootSans}
			channel="hue"
			defaultValue={parseColor("hsl(200, 100%, 50%)")}
		>
			<div class={style.labelRow}>
				<Label class={style.label}>Hue</Label>
				<ValueLabel class={style.valueLabel} />
			</div>
			<Track class={style.track}>
				<Thumb class={style.thumb}>
					<Input />
				</Thumb>
			</Track>
		</Root>
	),
});

/** Alpha slider with a checkered background for transparency. */
export const Alpha = meta.story({
	name: "Alpha",
	render: () => (
		<Root
			class={style.rootSans}
			channel="alpha"
			defaultValue={parseColor("hsla(200, 70%, 50%, 0.7)")}
		>
			<div class={style.labelRow}>
				<Label class={style.label}>Opacity</Label>
				<ValueLabel class={style.valueLabel} />
			</div>
			<div class={style.alphaCheckerboard}>
				<Track class={style.track}>
					<Thumb class={style.thumb}>
						<Input />
					</Thumb>
				</Track>
			</div>
		</Root>
	),
});

/** Controlled slider — all changes reflected in a signal. */
function ControlledDemo() {
	const [color, setColor] = createSignal<Color>(
		parseColor("hsl(120, 80%, 50%)"),
	);
	return (
		<div class={style.controlledWrapper}>
			<Root
				class={style.root}
				channel="hue"
				value={color()}
				onChange={setColor}
			>
				<div class={style.labelRow}>
					<Label class={style.label}>Hue</Label>
					<ValueLabel class={style.valueLabel} />
				</div>
				<Track class={style.track}>
					<Thumb class={style.thumb}>
						<Input />
					</Thumb>
				</Track>
			</Root>
			<div
				class={style.previewBox}
				style={{ "background-color": color().toString("css") }}
			/>
			<p class={style.text}>
				Value: <strong>{color().toString("css")}</strong>
			</p>
		</div>
	);
}

export const Controlled = meta.story({
	name: "Controlled",
	render: () => <ControlledDemo />,
});

/** Vertical orientation. */
export const Vertical = meta.story({
	name: "Vertical",
	render: () => (
		<Root
			class={style.verticalContainer}
			channel="hue"
			orientation="vertical"
			defaultValue={parseColor("hsl(60, 100%, 50%)")}
		>
			<Label class={style.label}>Hue</Label>
			<Track class={style.verticalTrack}>
				<Thumb class={style.thumb}>
					<Input />
				</Thumb>
			</Track>
			<ValueLabel class={style.valueLabel} />
		</Root>
	),
});

/** Disabled slider. */
export const Disabled = meta.story({
	name: "Disabled",
	render: () => (
		<Root
			class={style.rootSans}
			channel="saturation"
			defaultValue={parseColor("hsl(200, 50%, 50%)")}
			disabled
		>
			<div class={style.labelRow}>
				<Label class={style.labelDisabled}>Saturation</Label>
				<ValueLabel class={style.valueLabelDisabled} />
			</div>
			<Track class={style.trackDisabled}>
				<Thumb class={style.thumbDisabled}>
					<Input />
				</Thumb>
			</Track>
		</Root>
	),
});

/** With validation and error message. */
export const WithValidation = meta.story({
	name: "With Validation",
	render: () => (
		<Root
			class={style.validationRoot}
			channel="lightness"
			defaultValue={parseColor("hsl(200, 70%, 15%)")}
			validationState="invalid"
		>
			<div class={style.labelRow}>
				<Label class={style.label}>Lightness</Label>
				<ValueLabel class={style.valueLabel} />
			</div>
			<Track class={style.track}>
				<Thumb class={style.thumbInvalid}>
					<Input />
				</Thumb>
			</Track>
			<Description class={style.description}>
				Pick a value above 30% for readability.
			</Description>
			<ErrorMessage class={style.error}>Lightness is too low.</ErrorMessage>
		</Root>
	),
});
