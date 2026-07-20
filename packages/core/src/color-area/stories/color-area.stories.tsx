import type { Color } from "@solid-primitives/utils/colors";
import { parseColor } from "@solid-primitives/utils/colors";
import { createSignal } from "solid-js";
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
} from "../index.tsx";
import style from "./stories.module.css";

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

/** HSL color area with saturation/lightness axes. */
export const Default = meta.story({
	name: "Default",
	args: { disabled: false, readOnly: false },
	render: (args) => (
		<Root
			class={style.root}
			defaultValue={parseColor("hsl(200, 70%, 50%)")}
			disabled={args.disabled as boolean}
			readOnly={args.readOnly as boolean}
		>
			<Label class={style.label}>Pick a color</Label>
			<Background class={style.background}>
				<Thumb class={style.thumb}>
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
		<div class={style.controlledWrapper}>
			<Root class={style.root} value={color()} onChange={setColor}>
				<Label class={style.label}>Controlled</Label>
				<Background class={style.background}>
					<Thumb class={style.thumb}>
						<HiddenInputX />
						<HiddenInputY />
					</Thumb>
				</Background>
			</Root>
			<p class={style.text}>
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
		<Root class={style.root} defaultValue={parseColor("hsl(270, 80%, 60%)")}>
			<Label class={style.label}>Purple tones</Label>
			<Background class={style.background}>
				<Thumb class={style.thumb}>
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
			class={style.root}
			defaultValue={parseColor("hsl(0, 60%, 50%)")}
			disabled
		>
			<Label class={style.labelDisabled}>Locked color</Label>
			<Background class={style.backgroundDisabled}>
				<Thumb class={style.thumbDisabled}>
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
			class={style.root}
			colorSpace="rgb"
			xChannel="red"
			yChannel="green"
			defaultValue={parseColor("rgb(200, 150, 100)")}
		>
			<Label class={style.label}>Red / Green</Label>
			<Background class={style.background}>
				<Thumb class={style.thumb}>
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
			class={style.root}
			defaultValue={parseColor("hsl(30, 50%, 50%)")}
			validationState="invalid"
		>
			<Label class={style.label}>Pick a cool color</Label>
			<Background class={style.background}>
				<Thumb class={style.thumbInvalid}>
					<HiddenInputX />
					<HiddenInputY />
				</Thumb>
			</Background>
			<Description class={style.description}>
				Select a hue between 180–260°.
			</Description>
			<ErrorMessage class={style.error}>
				Please select a blue or purple hue.
			</ErrorMessage>
		</Root>
	),
});
