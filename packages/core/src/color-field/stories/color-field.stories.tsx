import { isValidColor } from "@solid-primitives/utils/colors";
import { createSignal } from "solid-js";
import preview from "../../../../../.storybook/preview.js";
import { Description, ErrorMessage, Input, Label, Root } from "../index";

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

const rootClass = "flex flex-col gap-1.5 font-sans w-48";
const labelClass = "text-sm font-medium text-slate-700";
const inputClass =
	"h-9 rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400 " +
	"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 " +
	"data-[invalid]:border-red-500 data-[disabled]:bg-slate-100 data-[disabled]:cursor-not-allowed";
const descClass = "text-xs text-slate-500";
const errorClass = "text-xs text-red-600";

/** Default hex color field with a color swatch preview. */
export const Default = meta.story({
	name: "Default",
	args: { disabled: false, readOnly: false, placeholder: "#000000" },
	render: (args) => (
		<Root
			class={rootClass}
			disabled={args.disabled as boolean}
			readOnly={args.readOnly as boolean}
		>
			<Label class={labelClass}>Color</Label>
			<Input class={inputClass} placeholder={args.placeholder as string} />
		</Root>
	),
});

/** Controlled color field synced to a signal. */
function ControlledDemo() {
	const [hex, setHex] = createSignal("#3b82f6");
	const valid = () =>
		!hex() || isValidColor(hex().startsWith("#") ? hex() : `#${hex()}`);
	return (
		<div class="flex flex-col gap-4 font-sans">
			<Root
				class={rootClass}
				value={hex()}
				onChange={setHex}
				validationState={valid() ? "valid" : "invalid"}
			>
				<Label class={labelClass}>Hex color</Label>
				<div class="flex items-center gap-2">
					<div
						class="h-9 w-9 shrink-0 rounded-md border border-slate-300"
						style={{
							"background-color": valid()
								? hex().startsWith("#")
									? hex()
									: `#${hex()}`
								: "transparent",
						}}
					/>
					<Input class={inputClass} />
				</div>
				<ErrorMessage class={errorClass}>Invalid hex color.</ErrorMessage>
			</Root>
			<p class="text-xs text-slate-500">
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
		<Root class={rootClass} defaultValue="ff6b35">
			<Label class={labelClass}>Brand color</Label>
			<Input class={inputClass} />
			<Description class={descClass}>Enter a hex value without #.</Description>
		</Root>
	),
});

/** Disabled field — not editable. */
export const Disabled = meta.story({
	name: "Disabled",
	render: () => (
		<Root class={rootClass} defaultValue="94a3b8" disabled>
			<Label class={`${labelClass} text-slate-400`}>Locked</Label>
			<Input class={inputClass} />
		</Root>
	),
});

/** Read-only field. */
export const ReadOnly = meta.story({
	name: "Read Only",
	render: () => (
		<Root class={rootClass} value="1d4ed8" readOnly>
			<Label class={labelClass}>Read only</Label>
			<Input class={inputClass} />
		</Root>
	),
});

/** Validation state showing invalid feedback. */
export const Invalid = meta.story({
	name: "Invalid",
	render: () => (
		<Root class={rootClass} defaultValue="xyz" validationState="invalid">
			<Label class={labelClass}>Color</Label>
			<Input class={inputClass} />
			<ErrorMessage class={errorClass}>Not a valid hex color.</ErrorMessage>
		</Root>
	),
});
