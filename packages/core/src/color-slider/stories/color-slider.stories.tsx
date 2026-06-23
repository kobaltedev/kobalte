import { createSignal } from "solid-js";
import { parseColor } from "@solid-primitives/utils/colors";
import type { Color, ColorChannel } from "@solid-primitives/utils/colors";
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
} from "../index";

const meta = preview.meta({
	title: "Components/ColorSlider",
	tags: ["autodocs"],
	argTypes: {
		channel: {
			control: "select",
			options: ["hue", "saturation", "lightness", "brightness", "red", "green", "blue", "alpha"],
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

const trackClass =
	"relative flex h-3 w-56 items-center rounded-full cursor-pointer select-none touch-none forced-colors:forced-color-adjust-none";
const thumbClass =
	"block h-5 w-5 rounded-full border-2 border-white shadow-md cursor-grab " +
	"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-1 " +
	"forced-colors:forced-color-adjust-none";
const labelClass = "text-sm font-medium text-slate-700";
const errorClass = "text-xs text-red-600";
const descClass = "text-xs text-slate-500";

/** Single-channel slider with controls. */
export const Default = meta.story({
	name: "Default",
	args: { channel: "hue", orientation: "horizontal", disabled: false },
	render: (args) => (
		<div class="flex flex-col gap-2 font-sans">
			<Root
				class="flex flex-col gap-2 w-56"
				channel={args.channel as ColorChannel}
				orientation={args.orientation as "horizontal" | "vertical"}
				disabled={args.disabled as boolean}
				defaultValue={parseColor("hsl(0, 100%, 50%)")}
			>
				<div class="flex justify-between">
					<Label class={labelClass}>{String(args.channel)}</Label>
					<ValueLabel class="text-sm text-slate-500" />
				</div>
				<Track class={trackClass} style={{ "--kb-color-current": "transparent" }}>
					<Thumb
						class={thumbClass}
						style={{ background: "var(--kb-color-current)" }}
					>
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
			class="flex flex-col gap-2 w-56 font-sans"
			channel="hue"
			defaultValue={parseColor("hsl(200, 100%, 50%)")}
		>
			<div class="flex justify-between">
				<Label class={labelClass}>Hue</Label>
				<ValueLabel class="text-sm text-slate-500" />
			</div>
			<Track class={trackClass}>
				<Thumb
					class={thumbClass}
					style={{ background: "var(--kb-color-current)" }}
				>
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
			class="flex flex-col gap-2 w-56 font-sans"
			channel="alpha"
			defaultValue={parseColor("hsla(200, 70%, 50%, 0.7)")}
		>
			<div class="flex justify-between">
				<Label class={labelClass}>Opacity</Label>
				<ValueLabel class="text-sm text-slate-500" />
			</div>
			<div
				class="rounded-full"
				style={{
					background:
						"repeating-conic-gradient(#ccc 0% 25%, #fff 0% 50%) 0 0 / 10px 10px",
				}}
			>
				<Track class={trackClass}>
					<Thumb
						class={thumbClass}
						style={{ background: "var(--kb-color-current)" }}
					>
						<Input />
					</Thumb>
				</Track>
			</div>
		</Root>
	),
});

/** Controlled slider — all changes reflected in a signal. */
function ControlledDemo() {
	const [color, setColor] = createSignal<Color>(parseColor("hsl(120, 80%, 50%)"));
	return (
		<div class="flex flex-col gap-4 font-sans">
			<Root
				class="flex flex-col gap-2 w-56"
				channel="hue"
				value={color()}
				onChange={setColor}
			>
				<div class="flex justify-between">
					<Label class={labelClass}>Hue</Label>
					<ValueLabel class="text-sm text-slate-500" />
				</div>
				<Track class={trackClass}>
					<Thumb
						class={thumbClass}
						style={{ background: "var(--kb-color-current)" }}
					>
						<Input />
					</Thumb>
				</Track>
			</Root>
			<div
				class="h-6 w-56 rounded-md border border-slate-200"
				style={{ "background-color": color().toString("css") }}
			/>
			<p class="text-xs text-slate-500">
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
			class="inline-flex flex-col items-center gap-2 h-48 font-sans"
			channel="hue"
			orientation="vertical"
			defaultValue={parseColor("hsl(60, 100%, 50%)")}
		>
			<Label class={labelClass}>Hue</Label>
			<Track class="relative flex w-3 flex-1 justify-center items-center rounded-full cursor-pointer touch-none forced-colors:forced-color-adjust-none">
				<Thumb
					class={thumbClass}
					style={{ background: "var(--kb-color-current)" }}
				>
					<Input />
				</Thumb>
			</Track>
			<ValueLabel class="text-sm text-slate-500" />
		</Root>
	),
});

/** Disabled slider. */
export const Disabled = meta.story({
	name: "Disabled",
	render: () => (
		<Root
			class="flex flex-col gap-2 w-56 font-sans"
			channel="saturation"
			defaultValue={parseColor("hsl(200, 50%, 50%)")}
			disabled
		>
			<div class="flex justify-between">
				<Label class={`${labelClass} text-slate-400`}>Saturation</Label>
				<ValueLabel class="text-sm text-slate-400" />
			</div>
			<Track class={`${trackClass} opacity-50 cursor-not-allowed`}>
				<Thumb class={`${thumbClass} cursor-not-allowed`} style={{ background: "var(--kb-color-current)" }}>
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
			class="flex flex-col gap-2 w-56 font-sans"
			channel="lightness"
			defaultValue={parseColor("hsl(200, 70%, 15%)")}
			validationState="invalid"
		>
			<div class="flex justify-between">
				<Label class={labelClass}>Lightness</Label>
				<ValueLabel class="text-sm text-slate-500" />
			</div>
			<Track class={trackClass}>
				<Thumb class={`${thumbClass} border-red-400`} style={{ background: "var(--kb-color-current)" }}>
					<Input />
				</Thumb>
			</Track>
			<Description class={descClass}>Pick a value above 30% for readability.</Description>
			<ErrorMessage class={errorClass}>Lightness is too low.</ErrorMessage>
		</Root>
	),
});
