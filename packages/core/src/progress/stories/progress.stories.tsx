import { createSignal } from "solid-js";
import preview from "../../../../../.storybook/preview.js";
import { Fill, Label, Root, Track, ValueLabel } from "../index.tsx";
import style from "./stories.module.css";

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
			class={style.progress__root}
		>
			<div class={style["progress__label-row"]}>
				<Label>{args.label}</Label>
				{!args.indeterminate && <ValueLabel />}
			</div>
			<Track class={[style.progress__track, style["progress__track-relative"]]}>
				{args.indeterminate ? (
					<Fill class={style["progress__fill-animated"]} />
				) : (
					<Fill class={style.progress__fill} />
				)}
			</Track>
		</Root>
	),
});

/** Controlled progress driven by a signal. */
function ControlledDemo() {
	const [value, setValue] = createSignal(0);
	return (
		<div class={style.progress__root}>
			<Root value={value()} class="flex flex-col gap-1.5">
				<div class={style["progress__label-row"]}>
					<Label>Upload</Label>
					<ValueLabel />
				</div>
				<Track class={style.progress__track}>
					<Fill class={style.progress__fill} />
				</Track>
			</Root>
			<div class={style.progress__controls}>
				<button
					type="button"
					class={style["progress__control-btn"]}
					onClick={() => setValue((v) => Math.max(0, v - 10))}
				>
					−10%
				</button>
				<button
					type="button"
					class={style["progress__control-btn"]}
					onClick={() => setValue((v) => Math.min(100, v + 10))}
				>
					+10%
				</button>
				<button
					type="button"
					class={style["progress__control-btn"]}
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
			class={style.progress__root}
		>
			<div class={style["progress__label-row"]}>
				<Label>Setup</Label>
				<ValueLabel />
			</div>
			<Track class={style.progress__track}>
				<Fill class={style.progress__fill} />
			</Track>
		</Root>
	),
});
