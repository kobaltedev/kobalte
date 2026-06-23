import { createSignal } from "solid-js";
import { parseColor } from "@solid-primitives/utils/colors";
import type { Color } from "@solid-primitives/utils/colors";
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
	title: "Components/ColorWheel",
	tags: ["autodocs"],
	argTypes: {
		thickness: { control: { type: "range", min: 10, max: 80, step: 5 } },
		disabled: { control: "boolean" },
	},
	args: {
		thickness: 28,
		disabled: false,
	},
});

export default meta;

const thumbClass =
	"w-5 h-5 rounded-full border-2 border-white shadow-md cursor-grab " +
	"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white " +
	"forced-colors:forced-color-adjust-none";
const labelClass = "text-sm font-medium text-slate-700";
const errorClass = "text-xs text-red-600";
const descClass = "text-xs text-slate-500";

/** Standard color wheel with controls. */
export const Default = meta.story({
	name: "Default",
	args: { thickness: 28, disabled: false },
	render: (args) => (
		<div class="flex flex-col items-center gap-3 font-sans">
			<Root
				class="relative inline-block"
				thickness={args.thickness as number}
				defaultValue={parseColor("hsl(200, 100%, 50%)")}
				disabled={args.disabled as boolean}
			>
				<Label class={labelClass}>Hue</Label>
				<Track class="block w-48 h-48">
					<Thumb
						class={thumbClass}
						style={{ background: "var(--kb-color-current)" }}
					>
						<Input />
					</Thumb>
				</Track>
				<ValueLabel class="text-sm text-slate-500 mt-1 text-center" />
			</Root>
		</div>
	),
});

/** Controlled wheel — hue synced to a signal. */
function ControlledDemo() {
	const [color, setColor] = createSignal<Color>(parseColor("hsl(120, 80%, 50%)"));
	return (
		<div class="flex flex-col items-center gap-4 font-sans">
			<Root
				class="relative inline-block"
				thickness={28}
				value={color()}
				onChange={setColor}
			>
				<Track class="block w-48 h-48">
					<Thumb
						class={thumbClass}
						style={{ background: "var(--kb-color-current)" }}
					>
						<Input />
					</Thumb>
				</Track>
			</Root>
			<div
				class="h-8 w-48 rounded-md border border-slate-200"
				style={{ "background-color": color().toString("css") }}
			/>
			<p class="text-xs text-slate-500">
				Hue: <strong>{Math.round(color().getChannelValue("hue"))}°</strong>
			</p>
		</div>
	);
}

export const Controlled = meta.story({
	name: "Controlled",
	render: () => <ControlledDemo />,
});

/** Thin track variant. */
export const ThinTrack = meta.story({
	name: "Thin Track",
	render: () => (
		<Root
			class="relative inline-block font-sans"
			thickness={16}
			defaultValue={parseColor("hsl(300, 100%, 50%)")}
		>
			<Track class="block w-48 h-48">
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

/** Thick track variant. */
export const ThickTrack = meta.story({
	name: "Thick Track",
	render: () => (
		<Root
			class="relative inline-block font-sans"
			thickness={50}
			defaultValue={parseColor("hsl(30, 100%, 50%)")}
		>
			<Track class="block w-48 h-48">
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

/** Disabled wheel — not interactive. */
export const Disabled = meta.story({
	name: "Disabled",
	render: () => (
		<Root
			class="relative inline-block font-sans"
			thickness={28}
			defaultValue={parseColor("hsl(60, 100%, 50%)")}
			disabled
		>
			<Track class="block w-48 h-48 opacity-50 cursor-not-allowed">
				<Thumb class={`${thumbClass} cursor-not-allowed`} style={{ background: "var(--kb-color-current)" }}>
					<Input />
				</Thumb>
			</Track>
		</Root>
	),
});

/** Wheel with label, value label, description and error. */
export const WithValidation = meta.story({
	name: "With Validation",
	render: () => (
		<div class="flex flex-col items-center gap-2 font-sans">
			<Root
				class="relative inline-block"
				thickness={28}
				defaultValue={parseColor("hsl(45, 100%, 50%)")}
				validationState="invalid"
			>
				<Label class={labelClass}>Color hue</Label>
				<Track class="block w-48 h-48 mt-1">
					<Thumb
						class={`${thumbClass} border-red-400`}
						style={{ background: "var(--kb-color-current)" }}
					>
						<Input />
					</Thumb>
				</Track>
				<Description class={descClass}>Select a cool hue (180–270°).</Description>
				<ErrorMessage class={errorClass}>
					Please select a blue or purple hue.
				</ErrorMessage>
			</Root>
		</div>
	),
});
