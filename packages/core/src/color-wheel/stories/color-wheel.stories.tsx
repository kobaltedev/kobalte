import type { Color } from "@solid-primitives/utils/colors";
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

/** Standard color wheel with controls. */
export const Default = meta.story({
	name: "Default",
	args: { thickness: 28, disabled: false },
	render: (args) => (
		<div class={style.wrapper}>
			<Root
				class={style.root}
				thickness={args.thickness as number}
				defaultValue={parseColor("hsl(200, 100%, 50%)")}
				disabled={args.disabled as boolean}
			>
				<Label class={style.label}>Hue</Label>
				<Track class={style.track}>
					<Thumb
						class={style.thumb}
						style={{ background: "var(--kb-color-current)" }}
					>
						<Input />
					</Thumb>
				</Track>
				<ValueLabel class={style.valueLabel} />
			</Root>
		</div>
	),
});

/** Controlled wheel — hue synced to a signal. */
function ControlledDemo() {
	const [color, setColor] = createSignal<Color>(
		parseColor("hsl(120, 80%, 50%)"),
	);
	return (
		<div class={style.controlledWrapper}>
			<Root
				class={style.root}
				thickness={28}
				value={color()}
				onChange={setColor}
			>
				<Track class={style.track}>
					<Thumb
						class={style.thumb}
						style={{ background: "var(--kb-color-current)" }}
					>
						<Input />
					</Thumb>
				</Track>
			</Root>
			<div
				class={style.previewBox}
				style={{ "background-color": color().toString("css") }}
			/>
			<p class={style.text}>
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
			class={style.rootSans}
			thickness={16}
			defaultValue={parseColor("hsl(300, 100%, 50%)")}
		>
			<Track class={style.track}>
				<Thumb
					class={style.thumb}
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
			class={style.rootSans}
			thickness={50}
			defaultValue={parseColor("hsl(30, 100%, 50%)")}
		>
			<Track class={style.track}>
				<Thumb
					class={style.thumb}
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
			class={style.rootSans}
			thickness={28}
			defaultValue={parseColor("hsl(60, 100%, 50%)")}
			disabled
		>
			<Track class={style.trackDisabled}>
				<Thumb
					class={style.thumbDisabled}
					style={{ background: "var(--kb-color-current)" }}
				>
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
		<div class={style.validationWrapper}>
			<Root
				class={style.root}
				thickness={28}
				defaultValue={parseColor("hsl(45, 100%, 50%)")}
				validationState="invalid"
			>
				<Label class={style.label}>Color hue</Label>
				<Track class={style.trackWithMargin}>
					<Thumb
						class={style.thumbInvalid}
						style={{ background: "var(--kb-color-current)" }}
					>
						<Input />
					</Thumb>
				</Track>
				<Description class={style.description}>
					Select a cool hue (180–270°).
				</Description>
				<ErrorMessage class={style.error}>
					Please select a blue or purple hue.
				</ErrorMessage>
			</Root>
		</div>
	),
});
