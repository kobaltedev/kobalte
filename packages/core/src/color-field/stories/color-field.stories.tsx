import { isValidColor } from "@solid-primitives/utils/colors";
import { createSignal } from "solid-js";
import preview from "../../../../../.storybook/preview.js";
import { Description, ErrorMessage, Input, Label, Root } from "../index.tsx";
import style from "./stories.module.css";

const meta = preview.meta({
	title: "Components/ColorField",
	tags: ["autodocs"],
	argTypes: {
		disabled: { control: "boolean" },
		readOnly: { control: "boolean" },
		placeholder: { control: "text" },
	},
	args: {
		disabled: false,
		readOnly: false,
		placeholder: "#000000",
	},
});

export default meta;

/** Default hex color field with a color swatch preview. */
export const Default = meta.story({
	name: "Default",
	args: { disabled: false, readOnly: false, placeholder: "#000000" },
	render: (args) => (
		<Root
			class={style.root}
			disabled={args.disabled as boolean}
			readOnly={args.readOnly as boolean}
		>
			<Label class={style.label}>Color</Label>
			<Input class={style.input} placeholder={args.placeholder as string} />
		</Root>
	),
});

/** Controlled color field synced to a signal. */
function ControlledDemo() {
	const [hex, setHex] = createSignal("#3b82f6");
	const valid = () =>
		!hex() || isValidColor(hex().startsWith("#") ? hex() : `#${hex()}`);
	return (
		<div class={style.controlledWrapper}>
			<Root
				class={style.root}
				value={hex()}
				onChange={setHex}
				validationState={valid() ? "valid" : "invalid"}
			>
				<Label class={style.label}>Hex color</Label>
				<div class={style.controlledRow}>
					<div
						class={style.controlledPreview}
						style={{
							"background-color": valid()
								? hex().startsWith("#")
									? hex()
									: `#${hex()}`
								: "transparent",
						}}
					/>
					<Input class={style.input} />
				</div>
				<ErrorMessage class={style.error}>Invalid hex color.</ErrorMessage>
			</Root>
			<p class={style.text}>
				Value: <strong>{hex()}</strong>
			</p>
		</div>
	);
}

export const Controlled = meta.story({
	name: "Controlled",
	render: () => <ControlledDemo />,
});

/** With a default value pre-populated. */
export const DefaultValue = meta.story({
	name: "Default Value",
	render: () => (
		<Root class={style.root} defaultValue="ff6b35">
			<Label class={style.label}>Brand color</Label>
			<Input class={style.input} />
			<Description class={style.description}>
				Enter a hex value without #.
			</Description>
		</Root>
	),
});

/** Disabled field — not editable. */
export const Disabled = meta.story({
	name: "Disabled",
	render: () => (
		<Root class={style.root} defaultValue="94a3b8" disabled>
			<Label class={style.labelDisabled}>Locked</Label>
			<Input class={style.input} />
		</Root>
	),
});

/** Read-only field. */
export const ReadOnly = meta.story({
	name: "Read Only",
	render: () => (
		<Root class={style.root} value="1d4ed8" readOnly>
			<Label class={style.label}>Read only</Label>
			<Input class={style.input} />
		</Root>
	),
});

/** Validation state showing invalid feedback. */
export const Invalid = meta.story({
	name: "Invalid",
	render: () => (
		<Root class={style.root} defaultValue="xyz" validationState="invalid">
			<Label class={style.label}>Color</Label>
			<Input class={style.input} />
			<ErrorMessage class={style.error}>Not a valid hex color.</ErrorMessage>
		</Root>
	),
});
