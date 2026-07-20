import { createSignal } from "solid-js";
import preview from "../../../../../.storybook/preview.js";
import {
	Description,
	ErrorMessage,
	HiddenInput,
	Input,
	Label,
	Root,
	Segment,
} from "../index.tsx";
import type { Time } from "../types.ts";
import style from "./stories.module.css";

const meta = preview.meta({
	title: "Components/TimeField",
	tags: ["autodocs"],
});

export default meta;

export const Default = meta.story({
	name: "Default",
	render: () => (
		<Root class={style.timeFieldRoot}>
			<Label class={style.timeFieldLabel}>Start time</Label>
			<Input class={style.timeFieldField}>
				{(segment) => (
					<Segment segment={segment()} class={style.timeFieldSegment} />
				)}
			</Input>
			<HiddenInput />
		</Root>
	),
});

export const DefaultValue = meta.story({
	name: "Default Value",
	render: () => (
		<Root class={style.timeFieldRoot} defaultValue={{ hour: 9, minute: 30 }}>
			<Label class={style.timeFieldLabel}>Meeting time</Label>
			<Input class={style.timeFieldField}>
				{(segment) => (
					<Segment segment={segment()} class={style.timeFieldSegment} />
				)}
			</Input>
			<HiddenInput />
		</Root>
	),
});

export const WithSeconds = meta.story({
	name: "With Seconds",
	render: () => (
		<Root
			class={style.timeFieldRoot}
			granularity="second"
			defaultValue={{ hour: 12, minute: 0, second: 0 }}
		>
			<Label class={style.timeFieldLabel}>Duration</Label>
			<Input class={style.timeFieldField}>
				{(segment) => (
					<Segment segment={segment()} class={style.timeFieldSegment} />
				)}
			</Input>
			<HiddenInput />
		</Root>
	),
});

export const TwentyFourHour = meta.story({
	name: "24-Hour Format",
	render: () => (
		<Root
			class={style.timeFieldRoot}
			hourCycle={24}
			defaultValue={{ hour: 14, minute: 45 }}
		>
			<Label class={style.timeFieldLabel}>Departure</Label>
			<Input class={style.timeFieldField}>
				{(segment) => (
					<Segment segment={segment()} class={style.timeFieldSegment} />
				)}
			</Input>
			<HiddenInput />
		</Root>
	),
});

export const Invalid = meta.story({
	name: "Invalid",
	render: () => (
		<Root class={style.timeFieldRoot} validationState="invalid" required>
			<Label class={style.timeFieldLabel}>Appointment</Label>
			<Input class={style.timeFieldField}>
				{(segment) => (
					<Segment segment={segment()} class={style.timeFieldSegment} />
				)}
			</Input>
			<ErrorMessage class={style.timeFieldError}>
				A time is required.
			</ErrorMessage>
			<HiddenInput />
		</Root>
	),
});

export const Disabled = meta.story({
	name: "Disabled",
	render: () => (
		<Root
			class={style.timeFieldRoot}
			disabled
			defaultValue={{ hour: 8, minute: 0 }}
		>
			<Label class={style.timeFieldLabel}>Closed at (disabled)</Label>
			<Input class={style.timeFieldField}>
				{(segment) => (
					<Segment segment={segment()} class={style.timeFieldSegment} />
				)}
			</Input>
			<HiddenInput />
		</Root>
	),
});

export const ReadOnly = meta.story({
	name: "Read Only",
	render: () => (
		<Root
			class={style.timeFieldRoot}
			readOnly
			defaultValue={{ hour: 17, minute: 30 }}
		>
			<Label class={style.timeFieldLabel}>Close time</Label>
			<Input class={style.timeFieldField}>
				{(segment) => (
					<Segment segment={segment()} class={style.timeFieldSegment} />
				)}
			</Input>
			<HiddenInput />
		</Root>
	),
});

function ControlledDemo() {
	const [value, setValue] = createSignal<Time | undefined>({
		hour: 10,
		minute: 0,
	});
	return (
		<div class={style.timeFieldWrapper}>
			<Root class={style.timeFieldRoot} value={value()} onChange={setValue}>
				<Label class={style.timeFieldLabel}>Event time</Label>
				<Input class={style.timeFieldField}>
					{(segment) => (
						<Segment segment={segment()} class={style.timeFieldSegment} />
					)}
				</Input>
				<Description class={style.timeFieldDescription}>
					Select a time for your event.
				</Description>
				<HiddenInput />
			</Root>
			<p class={style.timeFieldValueText}>
				Value:{" "}
				<strong>
					{value()
						? `${value()!.hour}:${String(value()!.minute).padStart(2, "0")}`
						: "—"}
				</strong>
			</p>
			<button
				type="button"
				class={style.timeFieldClearButton}
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
