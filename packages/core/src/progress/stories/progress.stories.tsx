import { createSignal } from "solid-js";
import preview from "../../../../../.storybook/preview.js";
import { Fill, Label, Root, Track, ValueLabel } from "../index";

const meta = preview.meta({
	title: "Components/Progress",
	tags: ["autodocs"],
});

export default meta;

/** Interactive playground — use the controls to set value or toggle indeterminate. */
export const Playground = meta.story({
	name: "Playground",
	args: {
		value: 40,
		indeterminate: false,
		label: "Uploading…",
	},
	argTypes: {
		value: {
			control: { type: "range", min: 0, max: 100, step: 1 },
			description: "Progress value (0–100). Ignored when indeterminate.",
		},
		indeterminate: {
			control: "boolean",
			description: "Show an indeterminate (unknown-duration) state.",
		},
		label: {
			control: "text",
			description: "Accessible label shown above the bar.",
		},
	},
	render: (args) => (
		<Root
			value={args.indeterminate ? undefined : args.value}
			indeterminate={args.indeterminate}
			class="flex flex-col gap-1.5 w-72 font-sans"
		>
			<div class="flex justify-between text-sm text-slate-600">
				<Label>{args.label}</Label>
				{!args.indeterminate && <ValueLabel />}
			</div>
			<Track class="h-2 w-full rounded-full bg-slate-200 overflow-hidden relative">
				{args.indeterminate ? (
					<Fill class="absolute inset-y-0 w-1/3 bg-blue-500 rounded-full animate-[indeterminate_1.5s_ease-in-out_infinite]" />
				) : (
					<Fill class="h-full bg-blue-500 rounded-full transition-all duration-300 [width:var(--kb-progress-fill-width)]" />
				)}
			</Track>
		</Root>
	),
});

/** Controlled progress driven by a signal. */
function ControlledDemo() {
	const [value, setValue] = createSignal(0);
	return (
		<div class="flex flex-col gap-3 font-sans w-72">
			<Root value={value()} class="flex flex-col gap-1.5">
				<div class="flex justify-between text-sm text-slate-600">
					<Label>Upload</Label>
					<ValueLabel />
				</div>
				<Track class="h-2 rounded-full bg-slate-200 overflow-hidden">
					<Fill class="h-full bg-blue-500 rounded-full transition-all duration-300 [width:var(--kb-progress-fill-width)]" />
				</Track>
			</Root>
			<div class="flex gap-2">
				<button
					type="button"
					class="px-3 py-1 text-xs rounded border border-slate-200 bg-white hover:bg-slate-50"
					onClick={() => setValue((v) => Math.max(0, v - 10))}
				>
					−10%
				</button>
				<button
					type="button"
					class="px-3 py-1 text-xs rounded border border-slate-200 bg-white hover:bg-slate-50"
					onClick={() => setValue((v) => Math.min(100, v + 10))}
				>
					+10%
				</button>
				<button
					type="button"
					class="px-3 py-1 text-xs rounded border border-slate-200 bg-white hover:bg-slate-50"
					onClick={() => setValue(0)}
				>
					Reset
				</button>
			</div>
		</div>
	);
}

export const Controlled = meta.story({
	name: "Controlled",
	render: () => <ControlledDemo />,
});

/** Custom step label using `getValueLabel`. */
export const CustomLabel = meta.story({
	name: "Custom Label",
	args: { step: 3 },
	argTypes: {
		step: {
			control: { type: "range", min: 0, max: 5, step: 1 },
			description: "Current step (0–5)",
		},
	},
	render: (args) => (
		<Root
			value={args.step}
			minValue={0}
			maxValue={5}
			getValueLabel={({ value, max }) => `Step ${value} of ${max}`}
			class="flex flex-col gap-1.5 w-72 font-sans"
		>
			<div class="flex justify-between text-sm text-slate-600">
				<Label>Setup</Label>
				<ValueLabel />
			</div>
			<Track class="h-2 rounded-full bg-slate-200 overflow-hidden">
				<Fill class="h-full bg-blue-500 rounded-full transition-all duration-300 [width:var(--kb-progress-fill-width)]" />
			</Track>
		</Root>
	),
});
