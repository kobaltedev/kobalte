import { createSignal } from "solid-js";
import { parseColor } from "@solid-primitives/utils/colors";
import type { Color } from "@solid-primitives/utils/colors";
import preview from "../../../../../.storybook/preview.js";
import {
	Background,
	Description,
	ErrorMessage,
	HiddenInputX,
	HiddenInputY,
	Label,
	Root,
	Thumb,
} from "../index";

const meta = preview.meta({
	title: "Components/ColorArea",
	tags: ["autodocs"],
	argTypes: {
		disabled: { control: "boolean" },
		readOnly: { control: "boolean" },
	},
	args: {
		disabled: false,
		readOnly: false,
	},
});

export default meta;

const rootClass = "relative inline-flex flex-col gap-2 font-sans select-none";
const backgroundClass =
	"relative w-48 h-48 rounded-md cursor-crosshair touch-none forced-colors:forced-color-adjust-none";
const thumbClass =
	"w-5 h-5 rounded-full border-2 border-white shadow-md cursor-grab focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white forced-colors:forced-color-adjust-none";
const labelClass = "text-sm font-medium text-slate-700";
const errorClass = "text-xs text-red-600";
const descClass = "text-xs text-slate-500";

/** HSL color area with saturation/lightness axes. */
export const Default = meta.story({
	name: "Default",
	args: { disabled: false, readOnly: false },
	render: (args) => (
		<Root
			class={rootClass}
			defaultValue={parseColor("hsl(200, 70%, 50%)")}
			disabled={args.disabled as boolean}
			readOnly={args.readOnly as boolean}
		>
			<Label class={labelClass}>Pick a color</Label>
			<Background class={backgroundClass}>
				<Thumb
					class={thumbClass}
					style={{ background: "var(--kb-color-current)" }}
				>
					<HiddenInputX />
					<HiddenInputY />
				</Thumb>
			</Background>
		</Root>
	),
});

/** Controlled color area with external signal. */
function ControlledDemo() {
	const [color, setColor] = createSignal<Color>(
		parseColor("hsl(120, 60%, 50%)"),
	);
	return (
		<div class="flex flex-col gap-4 font-sans">
			<Root
				class={rootClass}
				value={color()}
				onChange={setColor}
			>
				<Label class={labelClass}>Controlled</Label>
				<Background class={backgroundClass}>
					<Thumb
						class={thumbClass}
						style={{ background: "var(--kb-color-current)" }}
					>
						<HiddenInputX />
						<HiddenInputY />
					</Thumb>
				</Background>
			</Root>
			<p class="text-xs text-slate-500">
				Current: <strong>{color().toString("hex")}</strong>
			</p>
		</div>
	);
}

export const Controlled = meta.story({
	name: "Controlled",
	render: () => <ControlledDemo />,
});

/** Color area starting at an uncontrolled default value. */
export const DefaultValue = meta.story({
	name: "Default Value",
	render: () => (
		<Root
			class={rootClass}
			defaultValue={parseColor("hsl(270, 80%, 60%)")}
		>
			<Label class={labelClass}>Purple tones</Label>
			<Background class={backgroundClass}>
				<Thumb
					class={thumbClass}
					style={{ background: "var(--kb-color-current)" }}
				>
					<HiddenInputX />
					<HiddenInputY />
				</Thumb>
			</Background>
		</Root>
	),
});

/** Disabled color area — not interactive. */
export const Disabled = meta.story({
	name: "Disabled",
	render: () => (
		<Root
			class={rootClass}
			defaultValue={parseColor("hsl(0, 60%, 50%)")}
			disabled
		>
			<Label class={`${labelClass} text-slate-400`}>Locked color</Label>
			<Background class={`${backgroundClass} opacity-50 cursor-not-allowed`}>
				<Thumb
					class={`${thumbClass} border-slate-400 cursor-not-allowed`}
					style={{ background: "var(--kb-color-current)" }}
				>
					<HiddenInputX />
					<HiddenInputY />
				</Thumb>
			</Background>
		</Root>
	),
});

/** RGB color space with red/green axes. */
export const RGBSpace = meta.story({
	name: "RGB Space",
	render: () => (
		<Root
			class={rootClass}
			colorSpace="rgb"
			xChannel="red"
			yChannel="green"
			defaultValue={parseColor("rgb(200, 150, 100)")}
		>
			<Label class={labelClass}>Red / Green</Label>
			<Background class={backgroundClass}>
				<Thumb
					class={thumbClass}
					style={{ background: "var(--kb-color-current)" }}
				>
					<HiddenInputX />
					<HiddenInputY />
				</Thumb>
			</Background>
		</Root>
	),
});

/** With validation state and error message. */
export const WithValidation = meta.story({
	name: "With Validation",
	render: () => (
		<Root
			class={rootClass}
			defaultValue={parseColor("hsl(30, 50%, 50%)")}
			validationState="invalid"
		>
			<Label class={labelClass}>Pick a cool color</Label>
			<Background class={backgroundClass}>
				<Thumb
					class={`${thumbClass} border-red-500`}
					style={{ background: "var(--kb-color-current)" }}
				>
					<HiddenInputX />
					<HiddenInputY />
				</Thumb>
			</Background>
			<Description class={descClass}>Select a hue between 180–260°.</Description>
			<ErrorMessage class={errorClass}>
				Please select a blue or purple hue.
			</ErrorMessage>
		</Root>
	),
});
