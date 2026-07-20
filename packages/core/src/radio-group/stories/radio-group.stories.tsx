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
} from "../index.tsx";
import style from "./stories.module.css";

const meta = preview.meta({
	title: "Components/RadioGroup",
	tags: ["autodocs"],
});

export default meta;

/** A basic radio group with three options. */
export const Default = meta.story({
	name: "Default",
	render: () => (
		<Root class={style.group}>
			<Label class={style.groupLabel}>Plan</Label>
			{(["Starter", "Pro", "Enterprise"] as const).map((plan) => (
				<Item class={style.item} value={plan}>
					<ItemControl class={style.control}>
						<ItemIndicator class={style.indicator} />
						<ItemInput />
					</ItemControl>
					<ItemLabel class={style.label}>{plan}</ItemLabel>
				</Item>
			))}
		</Root>
	),
});

/** `defaultValue` pre-selects an option without controlling state. */
export const DefaultValue = meta.story({
	name: "Default Value",
	render: () => (
		<Root class={style.group} defaultValue="Pro">
			<Label class={style.groupLabel}>Plan</Label>
			{(["Starter", "Pro", "Enterprise"] as const).map((plan) => (
				<Item class={style.item} value={plan}>
					<ItemControl class={style.control}>
						<ItemIndicator class={style.indicator} />
						<ItemInput />
					</ItemControl>
					<ItemLabel class={style.label}>{plan}</ItemLabel>
				</Item>
			))}
		</Root>
	),
});

/** Each item can have a description below its label. */
export const WithDescriptions = meta.story({
	name: "With Descriptions",
	render: () => (
		<Root class={style.group}>
			<Label class={style.groupLabel}>Notification frequency</Label>
			{(
				[
					{ value: "realtime", label: "Real-time", desc: "As events happen." },
					{
						value: "daily",
						label: "Daily digest",
						desc: "Once a day summary.",
					},
					{
						value: "weekly",
						label: "Weekly recap",
						desc: "Every Monday morning.",
					},
				] as const
			).map(({ value, label, desc }) => (
				<Item class={style.item} value={value}>
					<ItemControl class={style.control}>
						<ItemIndicator class={style.indicator} />
						<ItemInput />
					</ItemControl>
					<div class={style.textColumn}>
						<ItemLabel class={style.label}>{label}</ItemLabel>
						<ItemDescription class={style.description}>{desc}</ItemDescription>
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
		<Root class={style.groupHorizontal} orientation="horizontal">
			<Label class={style.groupLabel}>Size</Label>
			{(["S", "M", "L", "XL"] as const).map((size) => (
				<Item class={style.item} value={size}>
					<ItemControl class={style.control}>
						<ItemIndicator class={style.indicator} />
						<ItemInput />
					</ItemControl>
					<ItemLabel class={style.label}>{size}</ItemLabel>
				</Item>
			))}
		</Root>
	),
});

/** `disabled` on the root prevents all interaction. */
export const Disabled = meta.story({
	name: "Disabled",
	render: () => (
		<Root class={style.group} defaultValue="Pro" disabled>
			<Label class={style.groupLabel}>Plan</Label>
			{(["Starter", "Pro", "Enterprise"] as const).map((plan) => (
				<Item class={style.item} value={plan}>
					<ItemControl class={style.control}>
						<ItemIndicator class={style.indicator} />
						<ItemInput />
					</ItemControl>
					<ItemLabel class={`${style.label} ${style.labelDisabled}`}>
						{plan}
					</ItemLabel>
				</Item>
			))}
		</Root>
	),
});

/** A single item can be disabled independently. */
export const DisabledItem = meta.story({
	name: "Disabled Item",
	render: () => (
		<Root class={style.group} defaultValue="Starter">
			<Label class={style.groupLabel}>Plan</Label>
			{(
				[
					{ value: "Starter", disabled: false },
					{ value: "Pro", disabled: false },
					{ value: "Enterprise", disabled: true },
				] as const
			).map(({ value, disabled }) => (
				<Item class={style.item} value={value} disabled={disabled}>
					<ItemControl class={style.control}>
						<ItemIndicator class={style.indicator} />
						<ItemInput />
					</ItemControl>
					<ItemLabel
						class={`${style.label}${disabled ? ` ${style.labelDisabled}` : ""}`}
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
		<Root class={style.group} defaultValue="Pro" readOnly>
			<Label class={style.groupLabel}>Current plan (read only)</Label>
			{(["Starter", "Pro", "Enterprise"] as const).map((plan) => (
				<Item class={style.item} value={plan}>
					<ItemControl class={style.control}>
						<ItemIndicator class={style.indicator} />
						<ItemInput />
					</ItemControl>
					<ItemLabel class={`${style.label} ${style.labelReadOnly}`}>
						{plan}
					</ItemLabel>
				</Item>
			))}
		</Root>
	),
});

function ControlledDemo() {
	const [value, setValue] = createSignal("Pro");
	return (
		<div class={`${style.group} ${style.stateText}`}>
			<Root class={style.group} value={value()} onChange={setValue}>
				<Label class={style.groupLabel}>Plan</Label>
				{(["Starter", "Pro", "Enterprise"] as const).map((plan) => (
					<Item class={style.item} value={plan}>
						<ItemControl class={style.control}>
							<ItemIndicator class={style.indicator} />
							<ItemInput />
						</ItemControl>
						<ItemLabel class={style.label}>{plan}</ItemLabel>
					</Item>
				))}
			</Root>
			<p class={style.stateText}>
				Selected: <strong>{value()}</strong>
			</p>
			<button
				type="button"
				class={style.resetButton}
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
			class={`${style.group} ${style.controlInvalid}`}
			value={value()}
			onChange={setValue}
			validationState={isInvalid() ? "invalid" : "valid"}
			required
		>
			<Label class={style.groupLabel}>Preferred contact method</Label>
			{(
				[
					{ value: "email", label: "Email" },
					{ value: "phone", label: "Phone" },
					{ value: "sms", label: "SMS" },
				] as const
			).map(({ value, label }) => (
				<Item class={style.item} value={value}>
					<ItemControl class={`${style.control} ${style.controlInvalid}`}>
						<ItemIndicator class={style.indicator} />
						<ItemInput />
					</ItemControl>
					<ItemLabel class={style.label}>{label}</ItemLabel>
				</Item>
			))}
			<Description class={style.description}>
				Choose how you'd like to be reached.
			</Description>
			<ErrorMessage class={style.error}>
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
