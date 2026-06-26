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
} from "../index";

const meta = preview.meta({
	title: "Components/NumberField",
	tags: ["autodocs"],
});

export default meta;

const rootClass = "flex flex-col gap-1 font-sans w-48";

const labelClass = "text-sm font-medium text-slate-700";

const inputWrapperClass =
	"flex items-center rounded-md border border-slate-200 bg-white overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 data-[invalid]:border-red-400 data-[disabled]:opacity-50";

const inputClass =
	"flex-1 min-w-0 px-2.5 py-1.5 text-sm text-slate-900 bg-transparent outline-none";

const triggerClass =
	"flex items-center justify-center w-7 h-full border-l border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-40 transition-colors text-xs select-none";

const descClass = "text-xs text-slate-500";
const errClass = "text-xs text-red-600";

/** Basic number field with increment/decrement controls. */
export const Default = meta.story({
	name: "Default",
	render: () => (
		<Root class={rootClass}>
			<Label class={labelClass}>Quantity</Label>
			<div class={inputWrapperClass}>
				<Input class={inputClass} />
				<DecrementTrigger class={triggerClass} aria-label="Decrement">
					−
				</DecrementTrigger>
				<IncrementTrigger class={triggerClass} aria-label="Increment">
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
		<Root class={rootClass} defaultValue={5}>
			<Label class={labelClass}>Items</Label>
			<div class={inputWrapperClass}>
				<Input class={inputClass} />
				<DecrementTrigger class={triggerClass} aria-label="Decrement">
					−
				</DecrementTrigger>
				<IncrementTrigger class={triggerClass} aria-label="Increment">
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
		<Root class={rootClass} defaultValue={5} minValue={1} maxValue={10}>
			<Label class={labelClass}>Rating (1–10)</Label>
			<div class={inputWrapperClass}>
				<Input class={inputClass} />
				<DecrementTrigger class={triggerClass} aria-label="Decrement">
					−
				</DecrementTrigger>
				<IncrementTrigger class={triggerClass} aria-label="Increment">
					+
				</IncrementTrigger>
			</div>
			<Description class={descClass}>Between 1 and 10</Description>
			<HiddenInput />
		</Root>
	),
});

/** `step` controls how much each click changes the value. */
export const CustomStep = meta.story({
	name: "Custom Step",
	render: () => (
		<Root
			class={rootClass}
			defaultValue={0}
			step={0.5}
			formatOptions={{ minimumFractionDigits: 1 }}
		>
			<Label class={labelClass}>Price offset</Label>
			<div class={inputWrapperClass}>
				<Input class={inputClass} />
				<DecrementTrigger class={triggerClass} aria-label="Decrement">
					−
				</DecrementTrigger>
				<IncrementTrigger class={triggerClass} aria-label="Increment">
					+
				</IncrementTrigger>
			</div>
			<Description class={descClass}>Steps of 0.5</Description>
			<HiddenInput />
		</Root>
	),
});

/** Currency formatting with `formatOptions`. */
export const Currency = meta.story({
	name: "Currency",
	render: () => (
		<Root
			class={rootClass}
			defaultValue={1200}
			formatOptions={{ style: "currency", currency: "USD" }}
		>
			<Label class={labelClass}>Budget</Label>
			<div class={inputWrapperClass}>
				<Input class={inputClass} />
				<DecrementTrigger class={triggerClass} aria-label="Decrement">
					−
				</DecrementTrigger>
				<IncrementTrigger class={triggerClass} aria-label="Increment">
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
			class={rootClass}
			defaultValue={0}
			minValue={1}
			validationState="invalid"
		>
			<Label class={labelClass}>Seats</Label>
			<div class={inputWrapperClass}>
				<Input class={inputClass} />
				<DecrementTrigger class={triggerClass} aria-label="Decrement">
					−
				</DecrementTrigger>
				<IncrementTrigger class={triggerClass} aria-label="Increment">
					+
				</IncrementTrigger>
			</div>
			<ErrorMessage class={errClass}>Must be at least 1.</ErrorMessage>
			<HiddenInput />
		</Root>
	),
});

/** `disabled` prevents all interaction. */
export const Disabled = meta.story({
	name: "Disabled",
	render: () => (
		<Root class={rootClass} defaultValue={3} disabled>
			<Label class={labelClass}>Count (disabled)</Label>
			<div class={inputWrapperClass}>
				<Input class={inputClass} />
				<DecrementTrigger class={triggerClass} aria-label="Decrement">
					−
				</DecrementTrigger>
				<IncrementTrigger class={triggerClass} aria-label="Increment">
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
		<div class="flex flex-col gap-3 font-sans">
			<Root
				class={rootClass}
				value={value()}
				onChange={(v) => setValue(Number(v))}
			>
				<Label class={labelClass}>Controlled</Label>
				<div class={inputWrapperClass}>
					<Input class={inputClass} />
					<DecrementTrigger class={triggerClass} aria-label="Decrement">
						−
					</DecrementTrigger>
					<IncrementTrigger class={triggerClass} aria-label="Increment">
						+
					</IncrementTrigger>
				</div>
				<HiddenInput />
			</Root>
			<p class="text-xs text-slate-500">
				Raw value: <strong>{value()}</strong>
			</p>
			<button
				type="button"
				class="self-start rounded px-3 py-1.5 text-xs font-medium bg-slate-100 hover:bg-slate-200 transition-colors"
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
