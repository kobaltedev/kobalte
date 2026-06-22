import { createSignal } from "solid-js";
import preview from "../../../../../.storybook/preview.js";
import {
	Description,
	ErrorMessage,
	Item,
	ItemControl,
	ItemDescription,
	ItemIndicator,
	ItemInput,
	ItemLabel,
	Label,
	Root,
} from "../index";

const meta = preview.meta({
	title: "Components/RadioGroup",
	tags: ["autodocs"],
});

export default meta;

// ── Shared styles ──────────────────────────────────────────────────────────

const groupClass = "flex flex-col gap-3 font-sans";

const itemClass = "flex items-center gap-3";

const controlClass =
	"relative flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center rounded-full border-2 border-slate-300 bg-white transition-colors duration-150 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 data-[checked]:border-blue-500 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50";

const indicatorClass =
	"h-2.5 w-2.5 rounded-full bg-blue-500";

const labelClass =
	"text-sm font-medium text-slate-700 select-none cursor-pointer";

const groupLabelClass =
	"text-sm font-semibold text-slate-800 mb-1";

const descriptionClass = "text-xs text-slate-500 mt-0.5";
const errorClass = "text-xs text-red-600 mt-0.5";

// ── Stories ────────────────────────────────────────────────────────────────

/** A basic radio group with three options. */
export const Default = meta.story({
	name: "Default",
	render: () => (
		<Root class={groupClass}>
			<Label class={groupLabelClass}>Plan</Label>
			{(["Starter", "Pro", "Enterprise"] as const).map((plan) => (
				<Item class={itemClass} value={plan}>
					<ItemControl class={controlClass}>
						<ItemIndicator class={indicatorClass} />
						<ItemInput />
					</ItemControl>
					<ItemLabel class={labelClass}>{plan}</ItemLabel>
				</Item>
			))}
		</Root>
	),
});

/** `defaultValue` pre-selects an option without controlling state. */
export const DefaultValue = meta.story({
	name: "Default Value",
	render: () => (
		<Root class={groupClass} defaultValue="Pro">
			<Label class={groupLabelClass}>Plan</Label>
			{(["Starter", "Pro", "Enterprise"] as const).map((plan) => (
				<Item class={itemClass} value={plan}>
					<ItemControl class={controlClass}>
						<ItemIndicator class={indicatorClass} />
						<ItemInput />
					</ItemControl>
					<ItemLabel class={labelClass}>{plan}</ItemLabel>
				</Item>
			))}
		</Root>
	),
});

/** Each item can have a description below its label. */
export const WithDescriptions = meta.story({
	name: "With Descriptions",
	render: () => (
		<Root class={groupClass}>
			<Label class={groupLabelClass}>Notification frequency</Label>
			{(
				[
					{ value: "realtime", label: "Real-time", desc: "As events happen." },
					{ value: "daily", label: "Daily digest", desc: "Once a day summary." },
					{ value: "weekly", label: "Weekly recap", desc: "Every Monday morning." },
				] as const
			).map(({ value, label, desc }) => (
				<Item class={itemClass} value={value}>
					<ItemControl class={controlClass}>
						<ItemIndicator class={indicatorClass} />
						<ItemInput />
					</ItemControl>
					<div class="flex flex-col">
						<ItemLabel class={labelClass}>{label}</ItemLabel>
						<ItemDescription class={descriptionClass}>{desc}</ItemDescription>
					</div>
				</Item>
			))}
		</Root>
	),
});

/** `orientation="horizontal"` lays items side by side. */
export const Horizontal = meta.story({
	name: "Horizontal",
	render: () => (
		<Root class="flex flex-row gap-6 font-sans" orientation="horizontal">
			<Label class={groupLabelClass}>Size</Label>
			{(["S", "M", "L", "XL"] as const).map((size) => (
				<Item class={itemClass} value={size}>
					<ItemControl class={controlClass}>
						<ItemIndicator class={indicatorClass} />
						<ItemInput />
					</ItemControl>
					<ItemLabel class={labelClass}>{size}</ItemLabel>
				</Item>
			))}
		</Root>
	),
});

/** `disabled` on the root prevents all interaction. */
export const Disabled = meta.story({
	name: "Disabled",
	render: () => (
		<Root class={groupClass} defaultValue="Pro" disabled>
			<Label class={groupLabelClass}>Plan</Label>
			{(["Starter", "Pro", "Enterprise"] as const).map((plan) => (
				<Item class={itemClass} value={plan}>
					<ItemControl class={controlClass}>
						<ItemIndicator class={indicatorClass} />
						<ItemInput />
					</ItemControl>
					<ItemLabel class={`${labelClass} opacity-50 cursor-not-allowed`}>{plan}</ItemLabel>
				</Item>
			))}
		</Root>
	),
});

/** A single item can be disabled independently. */
export const DisabledItem = meta.story({
	name: "Disabled Item",
	render: () => (
		<Root class={groupClass} defaultValue="Starter">
			<Label class={groupLabelClass}>Plan</Label>
			{(
				[
					{ value: "Starter", disabled: false },
					{ value: "Pro", disabled: false },
					{ value: "Enterprise", disabled: true },
				] as const
			).map(({ value, disabled }) => (
				<Item class={itemClass} value={value} disabled={disabled}>
					<ItemControl class={controlClass}>
						<ItemIndicator class={indicatorClass} />
						<ItemInput />
					</ItemControl>
					<ItemLabel
						class={`${labelClass}${disabled ? " opacity-50 cursor-not-allowed" : ""}`}
					>
						{value}
					</ItemLabel>
				</Item>
			))}
		</Root>
	),
});

/** `readOnly` shows the selected state without allowing changes. */
export const ReadOnly = meta.story({
	name: "Read Only",
	render: () => (
		<Root class={groupClass} defaultValue="Pro" readOnly>
			<Label class={groupLabelClass}>Current plan (read only)</Label>
			{(["Starter", "Pro", "Enterprise"] as const).map((plan) => (
				<Item class={itemClass} value={plan}>
					<ItemControl class={controlClass}>
						<ItemIndicator class={indicatorClass} />
						<ItemInput />
					</ItemControl>
					<ItemLabel class={`${labelClass} cursor-not-allowed`}>{plan}</ItemLabel>
				</Item>
			))}
		</Root>
	),
});

function ControlledDemo() {
	const [value, setValue] = createSignal("Pro");
	return (
		<div class="flex flex-col gap-4 font-sans">
			<Root class={groupClass} value={value()} onChange={setValue}>
				<Label class={groupLabelClass}>Plan</Label>
				{(["Starter", "Pro", "Enterprise"] as const).map((plan) => (
					<Item class={itemClass} value={plan}>
						<ItemControl class={controlClass}>
							<ItemIndicator class={indicatorClass} />
							<ItemInput />
						</ItemControl>
						<ItemLabel class={labelClass}>{plan}</ItemLabel>
					</Item>
				))}
			</Root>
			<p class="text-xs text-slate-500">
				Selected: <strong>{value()}</strong>
			</p>
			<button
				type="button"
				class="self-start rounded px-3 py-1.5 text-xs font-medium bg-slate-100 hover:bg-slate-200 transition-colors"
				onClick={() => setValue("Starter")}
			>
				Reset to Starter
			</button>
		</div>
	);
}

/** `value` + `onChange` give full external control over the selection. */
export const Controlled = meta.story({
	name: "Controlled",
	render: () => <ControlledDemo />,
});

function ValidationDemo() {
	const [value, setValue] = createSignal("");
	const isInvalid = () => value() === "";
	return (
		<Root
			class={`${groupClass} gap-0.5`}
			value={value()}
			onChange={setValue}
			validationState={isInvalid() ? "invalid" : "valid"}
			required
		>
			<Label class={groupLabelClass}>Preferred contact method</Label>
			{(
				[
					{ value: "email", label: "Email" },
					{ value: "phone", label: "Phone" },
					{ value: "sms", label: "SMS" },
				] as const
			).map(({ value, label }) => (
				<Item class={itemClass} value={value}>
					<ItemControl
						class={`${controlClass} data-[invalid]:border-red-400 data-[invalid]:ring-red-500`}
					>
						<ItemIndicator class={indicatorClass} />
						<ItemInput />
					</ItemControl>
					<ItemLabel class={labelClass}>{label}</ItemLabel>
				</Item>
			))}
			<Description class={descriptionClass}>
				Choose how you'd like to be reached.
			</Description>
			<ErrorMessage class={errorClass}>
				Please select a contact method.
			</ErrorMessage>
		</Root>
	);
}

/** `validationState="invalid"` reveals the `ErrorMessage` and applies `data-invalid` to items. */
export const WithValidation = meta.story({
	name: "With Validation",
	render: () => <ValidationDemo />,
});
