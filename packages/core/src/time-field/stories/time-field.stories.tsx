import { Time } from "@internationalized/date";
import { createSignal } from "solid-js";
import preview from "../../../../../.storybook/preview.js";
import {
	Description,
	ErrorMessage,
	Field,
	HiddenInput,
	Label,
	Root,
	Segment,
} from "../index";

const meta = preview.meta({
	title: "Components/TimeField",
	tags: ["autodocs"],
});

export default meta;

const rootClass = "flex flex-col gap-1 font-sans w-56";
const labelClass = "text-sm font-medium text-slate-700";
const fieldClass =
	"flex items-center rounded-md border border-slate-200 bg-white px-3 py-1.5 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 data-[invalid]:border-red-400 data-[disabled]:opacity-50";
const segmentClass =
	"rounded px-0.5 text-sm text-slate-900 data-[placeholder]:text-slate-400 focus:bg-blue-500 focus:text-white focus:outline-none";

/** Basic time picker with minute granularity. */
export const Default = meta.story({
	name: "Default",
	render: () => (
		<Root class={rootClass}>
			<Label class={labelClass}>Start time</Label>
			<Field class={fieldClass}>
				{(segment) => <Segment segment={segment()} class={segmentClass} />}
			</Field>
			<HiddenInput />
		</Root>
	),
});

/** `defaultValue` pre-fills the field with a time on mount. */
export const DefaultValue = meta.story({
	name: "Default Value",
	render: () => (
		<Root class={rootClass} defaultValue={new Time(9, 30)}>
			<Label class={labelClass}>Meeting time</Label>
			<Field class={fieldClass}>
				{(segment) => <Segment segment={segment()} class={segmentClass} />}
			</Field>
			<HiddenInput />
		</Root>
	),
});

/** `granularity="second"` adds a seconds segment. */
export const WithSeconds = meta.story({
	name: "With Seconds",
	render: () => (
		<Root
			class={rootClass}
			granularity="second"
			defaultValue={new Time(12, 0, 0)}
		>
			<Label class={labelClass}>Duration</Label>
			<Field class={fieldClass}>
				{(segment) => <Segment segment={segment()} class={segmentClass} />}
			</Field>
			<HiddenInput />
		</Root>
	),
});

/** `hourCycle={24}` switches to 24-hour format. */
export const TwentyFourHour = meta.story({
	name: "24-Hour Format",
	render: () => (
		<Root class={rootClass} hourCycle={24} defaultValue={new Time(14, 45)}>
			<Label class={labelClass}>Departure</Label>
			<Field class={fieldClass}>
				{(segment) => <Segment segment={segment()} class={segmentClass} />}
			</Field>
			<HiddenInput />
		</Root>
	),
});

/** `validationState="invalid"` surfaces an error message. */
export const Invalid = meta.story({
	name: "Invalid",
	render: () => (
		<Root class={rootClass} validationState="invalid" required>
			<Label class={labelClass}>Appointment</Label>
			<Field class={fieldClass}>
				{(segment) => <Segment segment={segment()} class={segmentClass} />}
			</Field>
			<ErrorMessage class="text-xs text-red-600">
				A time is required.
			</ErrorMessage>
			<HiddenInput />
		</Root>
	),
});

/** `disabled` prevents all interaction. */
export const Disabled = meta.story({
	name: "Disabled",
	render: () => (
		<Root class={rootClass} disabled defaultValue={new Time(8, 0)}>
			<Label class={labelClass}>Closed at (disabled)</Label>
			<Field class={fieldClass}>
				{(segment) => <Segment segment={segment()} class={segmentClass} />}
			</Field>
			<HiddenInput />
		</Root>
	),
});

/** `readOnly` displays the value without allowing edits. */
export const ReadOnly = meta.story({
	name: "Read Only",
	render: () => (
		<Root class={rootClass} readOnly defaultValue={new Time(17, 30)}>
			<Label class={labelClass}>Close time</Label>
			<Field class={fieldClass}>
				{(segment) => <Segment segment={segment()} class={segmentClass} />}
			</Field>
			<HiddenInput />
		</Root>
	),
});

/** Controlled value driven by an external signal. */
function ControlledDemo() {
	const [value, setValue] = createSignal<Time | undefined>(new Time(10, 0));
	return (
		<div class="flex flex-col gap-3 font-sans">
			<Root
				class={rootClass}
				value={value()}
				onChange={(v) => setValue(v as Time)}
			>
				<Label class={labelClass}>Event time</Label>
				<Field class={fieldClass}>
					{(segment) => <Segment segment={segment()} class={segmentClass} />}
				</Field>
				<Description class="text-xs text-slate-500">
					Select a time for your event.
				</Description>
				<HiddenInput />
			</Root>
			<p class="text-xs text-slate-500">
				Value:{" "}
				<strong>
					{value()
						? `${value()!.hour}:${String(value()!.minute).padStart(2, "0")}`
						: "—"}
				</strong>
			</p>
			<button
				type="button"
				class="self-start rounded px-3 py-1.5 text-xs font-medium bg-slate-100 hover:bg-slate-200 transition-colors"
				onClick={() => setValue(undefined)}
			>
				Clear
			</button>
		</div>
	);
}

export const Controlled = meta.story({
	name: "Controlled",
	render: () => <ControlledDemo />,
});
