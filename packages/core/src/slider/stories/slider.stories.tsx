import { createSignal } from "solid-js";
import preview from "../../../../../.storybook/preview.js";
import {
	Description,
	ErrorMessage,
	Fill,
	Input,
	Label,
	Root,
	Thumb,
	Track,
	ValueLabel,
} from "../index";

const meta = preview.meta({
	title: "Components/Slider",
	tags: ["autodocs"],
});

export default meta;

const trackClass =
	"relative flex items-center h-2 w-64 rounded-full bg-slate-200 cursor-pointer select-none touch-none";
const fillClass =
	"absolute h-full rounded-full bg-blue-500 data-[disabled]:bg-slate-400";
const thumbClass =
	"block h-5 w-5 rounded-full border-2 border-blue-500 bg-white shadow" +
	" focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2" +
	" data-[disabled]:border-slate-400";

/** Single horizontal thumb at the default value. */
export const Default = meta.story({
	name: "Default",
	render: () => (
		<div class="flex flex-col gap-2 font-sans">
			<Root defaultValue={[40]} class="flex flex-col gap-2 w-64">
				<div class="flex justify-between text-sm text-slate-600">
					<Label>Volume</Label>
					<ValueLabel />
				</div>
				<Track class={trackClass}>
					<Fill class={fillClass} />
					<Thumb class={thumbClass}>
						<Input />
					</Thumb>
				</Track>
			</Root>
		</div>
	),
});

/** Controlled slider driven by a signal. */
function ControlledDemo() {
	const [value, setValue] = createSignal([25]);
	return (
		<div class="flex flex-col gap-3 font-sans">
			<Root
				value={value()}
				onChange={setValue}
				class="flex flex-col gap-2 w-64"
			>
				<div class="flex justify-between text-sm text-slate-600">
					<Label>Brightness</Label>
					<ValueLabel />
				</div>
				<Track class={trackClass}>
					<Fill class={fillClass} />
					<Thumb class={thumbClass}>
						<Input />
					</Thumb>
				</Track>
			</Root>
			<p class="text-xs text-slate-500">
				Signal value: <strong>{value()[0]}</strong>
			</p>
		</div>
	);
}

export const Controlled = meta.story({
	name: "Controlled",
	render: () => <ControlledDemo />,
});

/** Range slider with two thumbs. */
export const RangeSlider = meta.story({
	name: "Range Slider",
	render: () => (
		<Root
			defaultValue={[20, 80]}
			minStepsBetweenThumbs={5}
			class="flex flex-col gap-2 w-64 font-sans"
		>
			<div class="flex justify-between text-sm text-slate-600">
				<Label>Price range</Label>
				<ValueLabel
					getValueLabel={({ values }) => `$${values[0]} – $${values[1]}`}
				/>
			</div>
			<Track class={trackClass}>
				<Fill class={fillClass} />
				<Thumb class={thumbClass}>
					<Input />
				</Thumb>
				<Thumb class={thumbClass}>
					<Input />
				</Thumb>
			</Track>
		</Root>
	),
});

/** Step size of 10. */
export const StepSize = meta.story({
	name: "Step Size",
	render: () => (
		<Root
			defaultValue={[50]}
			step={10}
			class="flex flex-col gap-2 w-64 font-sans"
		>
			<div class="flex justify-between text-sm text-slate-600">
				<Label>Opacity</Label>
				<ValueLabel />
			</div>
			<Track class={trackClass}>
				<Fill class={fillClass} />
				<Thumb class={thumbClass}>
					<Input />
				</Thumb>
			</Track>
		</Root>
	),
});

/** Disabled slider — not interactive. */
export const Disabled = meta.story({
	name: "Disabled",
	render: () => (
		<Root
			defaultValue={[60]}
			disabled
			class="flex flex-col gap-2 w-64 font-sans"
		>
			<div class="flex justify-between text-sm text-slate-600">
				<Label>Locked</Label>
				<ValueLabel />
			</div>
			<Track class="relative flex items-center h-2 w-64 rounded-full bg-slate-100 cursor-not-allowed select-none">
				<Fill class={fillClass} />
				<Thumb class={thumbClass}>
					<Input />
				</Thumb>
			</Track>
		</Root>
	),
});

/** Vertical orientation. */
export const Vertical = meta.story({
	name: "Vertical",
	render: () => (
		<Root
			defaultValue={[60]}
			orientation="vertical"
			class="relative inline-flex flex-col items-center h-48 font-sans"
		>
			<Label class="text-sm text-slate-600 mb-2">Level</Label>
			<Track class="relative flex justify-center w-2 flex-1 rounded-full bg-slate-200 cursor-pointer touch-none">
				<Fill class="absolute w-full rounded-full bg-blue-500 bottom-0 [height:var(--kb-slider-thumb-transform,auto)]" />
				<Thumb class={thumbClass}>
					<Input />
				</Thumb>
			</Track>
			<ValueLabel class="text-xs text-slate-500 mt-2" />
		</Root>
	),
});

/** Validation state — shows error message. */
export const WithValidation = meta.story({
	name: "With Validation",
	render: () => (
		<Root
			defaultValue={[15]}
			validationState="invalid"
			class="flex flex-col gap-2 w-64 font-sans"
		>
			<div class="flex justify-between text-sm text-slate-600">
				<Label>Threshold</Label>
				<ValueLabel />
			</div>
			<Track class={trackClass}>
				<Fill class="absolute h-full rounded-full bg-red-500" />
				<Thumb class="block h-5 w-5 rounded-full border-2 border-red-500 bg-white shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400">
					<Input />
				</Thumb>
			</Track>
			<Description class="text-xs text-slate-500">
				Set a value above 20.
			</Description>
			<ErrorMessage class="text-xs text-red-600">
				Value must be at least 20.
			</ErrorMessage>
		</Root>
	),
});
