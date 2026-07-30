import { createSignal } from "solid-js";
import preview from "../../../../../.storybook/preview.js";
import {
	DecrementTrigger,
	Description,
	ErrorMessage,
	HiddenInput,
	IncrementTrigger,
	Input,
	Label,
	Root,
} from "../index.tsx";
import style from "./stories.module.css";

const meta = preview.meta({
	title: "Components/NumberField",
	tags: ["autodocs"],
});

export default meta;

/** Basic number field with increment/decrement controls. */
export const Default = meta.story({
	name: "Default",
	render: () => (
		<Root class={style.root}>
			<Label class={style.label}>Quantity</Label>
			<div class={style.inputWrapper}>
				<Input class={style.input} />
				<DecrementTrigger class={style.trigger} aria-label="Decrement">
					−
				</DecrementTrigger>
				<IncrementTrigger class={style.trigger} aria-label="Increment">
					+
				</IncrementTrigger>
			</div>
			<HiddenInput />
		</Root>
	),
});

/** `defaultValue` pre-fills the field on mount. */
export const DefaultValue = meta.story({
	name: "Default Value",
	render: () => (
		<Root class={style.root} defaultValue={5}>
			<Label class={style.label}>Items</Label>
			<div class={style.inputWrapper}>
				<Input class={style.input} />
				<DecrementTrigger class={style.trigger} aria-label="Decrement">
					−
				</DecrementTrigger>
				<IncrementTrigger class={style.trigger} aria-label="Increment">
					+
				</IncrementTrigger>
			</div>
			<HiddenInput />
		</Root>
	),
});

/** `minValue` and `maxValue` constrain the allowed range. */
export const MinMax = meta.story({
	name: "Min / Max",
	render: () => (
		<Root class={style.root} defaultValue={5} minValue={1} maxValue={10}>
			<Label class={style.label}>Rating (1–10)</Label>
			<div class={style.inputWrapper}>
				<Input class={style.input} />
				<DecrementTrigger class={style.trigger} aria-label="Decrement">
					−
				</DecrementTrigger>
				<IncrementTrigger class={style.trigger} aria-label="Increment">
					+
				</IncrementTrigger>
			</div>
			<Description class={style.description}>Between 1 and 10</Description>
			<HiddenInput />
		</Root>
	),
});

/** `step` controls how much each click changes the value. */
export const CustomStep = meta.story({
	name: "Custom Step",
	render: () => (
		<Root
			class={style.root}
			defaultValue={0}
			step={0.5}
			formatOptions={{ minimumFractionDigits: 1 }}
		>
			<Label class={style.label}>Price offset</Label>
			<div class={style.inputWrapper}>
				<Input class={style.input} />
				<DecrementTrigger class={style.trigger} aria-label="Decrement">
					−
				</DecrementTrigger>
				<IncrementTrigger class={style.trigger} aria-label="Increment">
					+
				</IncrementTrigger>
			</div>
			<Description class={style.description}>Steps of 0.5</Description>
			<HiddenInput />
		</Root>
	),
});

/** Currency formatting with `formatOptions`. */
export const Currency = meta.story({
	name: "Currency",
	render: () => (
		<Root
			class={style.root}
			defaultValue={1200}
			formatOptions={{ style: "currency", currency: "USD" }}
		>
			<Label class={style.label}>Budget</Label>
			<div class={style.inputWrapper}>
				<Input class={style.input} />
				<DecrementTrigger class={style.trigger} aria-label="Decrement">
					−
				</DecrementTrigger>
				<IncrementTrigger class={style.trigger} aria-label="Increment">
					+
				</IncrementTrigger>
			</div>
			<HiddenInput />
		</Root>
	),
});

/** `validationState="invalid"` surfaces an error message. */
export const Invalid = meta.story({
	name: "Invalid",
	render: () => (
		<Root
			class={style.root}
			defaultValue={0}
			minValue={1}
			validationState="invalid"
		>
			<Label class={style.label}>Seats</Label>
			<div class={style.inputWrapper}>
				<Input class={style.input} />
				<DecrementTrigger class={style.trigger} aria-label="Decrement">
					−
				</DecrementTrigger>
				<IncrementTrigger class={style.trigger} aria-label="Increment">
					+
				</IncrementTrigger>
			</div>
			<ErrorMessage class={style.error}>Must be at least 1.</ErrorMessage>
			<HiddenInput />
		</Root>
	),
});

/** `disabled` prevents all interaction. */
export const Disabled = meta.story({
	name: "Disabled",
	render: () => (
		<Root class={style.root} defaultValue={3} disabled>
			<Label class={style.label}>Count (disabled)</Label>
			<div class={style.inputWrapper}>
				<Input class={style.input} />
				<DecrementTrigger class={style.trigger} aria-label="Decrement">
					−
				</DecrementTrigger>
				<IncrementTrigger class={style.trigger} aria-label="Increment">
					+
				</IncrementTrigger>
			</div>
			<HiddenInput />
		</Root>
	),
});

/** Controlled value driven by an external signal. */
function ControlledDemo() {
	const [value, setValue] = createSignal(0);
	return (
		<div class={style.controlledWrapper}>
			<Root
				class={style.root}
				value={value()}
				onChange={(v) => setValue(Number(v))}
			>
				<Label class={style.label}>Controlled</Label>
				<div class={style.inputWrapper}>
					<Input class={style.input} />
					<DecrementTrigger class={style.trigger} aria-label="Decrement">
						−
					</DecrementTrigger>
					<IncrementTrigger class={style.trigger} aria-label="Increment">
						+
					</IncrementTrigger>
				</div>
				<HiddenInput />
			</Root>
			<p class={style.stateText}>
				Raw value: <strong>{value()}</strong>
			</p>
			<button
				type="button"
				class={style.resetButton}
				onClick={() => setValue(0)}
			>
				Reset
			</button>
		</div>
	);
}

export const Controlled = meta.story({
	name: "Controlled",
	render: () => <ControlledDemo />,
});
