import { createSignal } from "solid-js";
import { parseColor } from "@solid-primitives/utils/colors";
import type { Color, ColorChannel } from "@solid-primitives/utils/colors";
import preview from "../../../../../.storybook/preview.js";
import {
	DecrementTrigger,
	Description,
	ErrorMessage,
	IncrementTrigger,
	Input,
	Label,
	Root,
} from "../index";

const meta = preview.meta({
	title: "Components/ColorChannelField",
	tags: ["autodocs"],
	argTypes: {
		channel: {
			control: "select",
			options: ["hue", "saturation", "lightness", "red", "green", "blue", "alpha"],
		},
		disabled: { control: "boolean" },
	},
	args: {
		channel: "hue",
		disabled: false,
	},
});

export default meta;

const rootClass = "flex flex-col gap-1.5 font-sans w-48";
const labelClass = "text-sm font-medium text-slate-700";
const inputWrapClass =
	"flex h-9 items-center rounded-md border border-slate-300 bg-white text-sm text-slate-900 " +
	"focus-within:ring-2 focus-within:ring-blue-500 data-[invalid]:border-red-500 data-[disabled]:bg-slate-100";
const inputClass =
	"h-full w-full min-w-0 rounded-md px-3 bg-transparent outline-none data-[disabled]:cursor-not-allowed";
const btnClass =
	"flex h-full w-7 shrink-0 items-center justify-center border-l border-slate-300 text-slate-500 " +
	"hover:bg-slate-50 first-of-type:rounded-l-md first-of-type:border-l-0 last-of-type:rounded-r-md " +
	"data-[disabled]:opacity-40 data-[disabled]:cursor-not-allowed";
const errorClass = "text-xs text-red-600";
const descClass = "text-xs text-slate-500";

/** Single channel field driven by the selected channel control. */
export const Default = meta.story({
	name: "Default",
	args: { channel: "hue", disabled: false },
	render: (args) => (
		<Root
			class={rootClass}
			channel={args.channel as ColorChannel}
			defaultValue={parseColor("hsl(200, 70%, 50%)")}
			disabled={args.disabled as boolean}
		>
			<Label class={labelClass}>{String(args.channel)}</Label>
			<div class={inputWrapClass}>
				<DecrementTrigger class={btnClass}>−</DecrementTrigger>
				<Input class={inputClass} />
				<IncrementTrigger class={btnClass}>+</IncrementTrigger>
			</div>
		</Root>
	),
});

/** Controlled — hue channel synced to a signal. */
function ControlledDemo() {
	const [color, setColor] = createSignal<Color>(parseColor("hsl(200, 70%, 50%)"));
	return (
		<div class="flex flex-col gap-4 font-sans">
			<Root
				class={rootClass}
				channel="hue"
				value={color()}
				onChange={setColor}
			>
				<Label class={labelClass}>Hue</Label>
				<div class={inputWrapClass}>
					<DecrementTrigger class={btnClass}>−</DecrementTrigger>
					<Input class={inputClass} />
					<IncrementTrigger class={btnClass}>+</IncrementTrigger>
				</div>
			</Root>
			<p class="text-xs text-slate-500">
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
	const [color, setColor] = createSignal<Color>(parseColor("hsl(200, 70%, 50%)"));
	const channels: ColorChannel[] = ["hue", "saturation", "lightness"];
	return (
		<div class="flex flex-col gap-3 font-sans">
			{channels.map((ch) => (
				<Root class={rootClass} channel={ch} value={color()} onChange={setColor}>
					<Label class={labelClass}>{ch.charAt(0).toUpperCase() + ch.slice(1)}</Label>
					<div class={inputWrapClass}>
						<DecrementTrigger class={btnClass}>−</DecrementTrigger>
						<Input class={inputClass} />
						<IncrementTrigger class={btnClass}>+</IncrementTrigger>
					</div>
				</Root>
			))}
			<div
				class="h-8 w-48 rounded-md border border-slate-200"
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
			class={rootClass}
			channel="saturation"
			defaultValue={parseColor("hsl(200, 70%, 50%)")}
			disabled
		>
			<Label class={`${labelClass} text-slate-400`}>Saturation</Label>
			<div class={inputWrapClass}>
				<DecrementTrigger class={btnClass}>−</DecrementTrigger>
				<Input class={inputClass} />
				<IncrementTrigger class={btnClass}>+</IncrementTrigger>
			</div>
		</Root>
	),
});

/** Alpha channel field. */
export const Alpha = meta.story({
	name: "Alpha Channel",
	render: () => (
		<Root
			class={rootClass}
			channel="alpha"
			defaultValue={parseColor("hsla(200, 70%, 50%, 0.5)")}
		>
			<Label class={labelClass}>Opacity</Label>
			<div class={inputWrapClass}>
				<DecrementTrigger class={btnClass}>−</DecrementTrigger>
				<Input class={inputClass} />
				<IncrementTrigger class={btnClass}>+</IncrementTrigger>
			</div>
			<Description class={descClass}>Adjusts color transparency.</Description>
		</Root>
	),
});

/** With validation error. */
export const Invalid = meta.story({
	name: "Invalid",
	render: () => (
		<Root
			class={rootClass}
			channel="lightness"
			defaultValue={parseColor("hsl(0, 0%, 5%)")}
			validationState="invalid"
		>
			<Label class={labelClass}>Lightness</Label>
			<div class={inputWrapClass}>
				<DecrementTrigger class={btnClass}>−</DecrementTrigger>
				<Input class={inputClass} />
				<IncrementTrigger class={btnClass}>+</IncrementTrigger>
			</div>
			<ErrorMessage class={errorClass}>
				Value is too dark — choose above 20%.
			</ErrorMessage>
		</Root>
	),
});
