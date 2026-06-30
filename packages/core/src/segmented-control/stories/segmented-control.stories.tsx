import { createSignal } from "solid-js";
import preview from "../../../../../.storybook/preview.js";
import {
	Indicator,
	Item,
	ItemControl,
	ItemInput,
	ItemLabel,
	Label,
	Root,
} from "../index";

const meta = preview.meta({
	title: "Components/SegmentedControl",
	tags: ["autodocs"],
});

export default meta;

const rootClass =
	"relative inline-flex items-center rounded-lg bg-slate-100 p-1 font-sans";

const itemClass =
	"relative z-10 flex cursor-pointer items-center rounded-md px-4 py-1.5 text-sm font-medium transition-colors duration-150 select-none data-[checked]:text-slate-900 text-slate-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-1";

const indicatorClass =
	"absolute inset-0 rounded-md bg-white shadow-sm transition-all duration-200";

/** Three equally-spaced segments with a sliding indicator. */
export const Default = meta.story({
	name: "Default",
	render: () => (
		<Root class={rootClass} defaultValue="month">
			<Indicator class={indicatorClass} />
			{(["Day", "Month", "Year"] as const).map((label) => (
				<Item class={itemClass} value={label.toLowerCase()}>
					<ItemInput />
					<ItemControl class="absolute inset-0 cursor-pointer" />
					<ItemLabel class="pointer-events-none">{label}</ItemLabel>
				</Item>
			))}
		</Root>
	),
});

/** `defaultValue` pre-selects a segment on mount. */
export const DefaultValue = meta.story({
	name: "Default Value",
	render: () => (
		<Root class={rootClass} defaultValue="year">
			<Indicator class={indicatorClass} />
			{(["Day", "Month", "Year"] as const).map((label) => (
				<Item class={itemClass} value={label.toLowerCase()}>
					<ItemInput />
					<ItemControl class="absolute inset-0 cursor-pointer" />
					<ItemLabel class="pointer-events-none">{label}</ItemLabel>
				</Item>
			))}
		</Root>
	),
});

/** A label associates the group with a visible heading. */
export const WithLabel = meta.story({
	name: "With Label",
	render: () => (
		<div class="flex flex-col gap-2 font-sans">
			<Root class={rootClass} defaultValue="grid">
				<Label class="text-sm font-medium text-slate-700 mb-1 block">
					View
				</Label>
				<Indicator class={indicatorClass} />
				{(["List", "Grid", "Kanban"] as const).map((label) => (
					<Item class={itemClass} value={label.toLowerCase()}>
						<ItemInput />
						<ItemControl class="absolute inset-0 cursor-pointer" />
						<ItemLabel class="pointer-events-none">{label}</ItemLabel>
					</Item>
				))}
			</Root>
		</div>
	),
});

/** `disabled` on the root prevents all interaction. */
export const Disabled = meta.story({
	name: "Disabled",
	render: () => (
		<Root
			class={`${rootClass} opacity-50 cursor-not-allowed`}
			defaultValue="month"
			disabled
		>
			<Indicator class={indicatorClass} />
			{(["Day", "Month", "Year"] as const).map((label) => (
				<Item
					class={`${itemClass} pointer-events-none`}
					value={label.toLowerCase()}
				>
					<ItemInput />
					<ItemControl class="absolute inset-0" />
					<ItemLabel class="pointer-events-none">{label}</ItemLabel>
				</Item>
			))}
		</Root>
	),
});

function ControlledDemo() {
	const [value, setValue] = createSignal("month");
	return (
		<div class="flex flex-col gap-3 font-sans">
			<Root class={rootClass} value={value()} onChange={setValue}>
				<Indicator class={indicatorClass} />
				{(["Day", "Month", "Year"] as const).map((label) => (
					<Item class={itemClass} value={label.toLowerCase()}>
						<ItemInput />
						<ItemControl class="absolute inset-0 cursor-pointer" />
						<ItemLabel class="pointer-events-none">{label}</ItemLabel>
					</Item>
				))}
			</Root>
			<p class="text-xs text-slate-500">
				Selected: <strong>{value()}</strong>
			</p>
			<button
				type="button"
				class="self-start rounded px-3 py-1.5 text-xs font-medium bg-slate-100 hover:bg-slate-200 transition-colors"
				onClick={() => setValue("month")}
			>
				Reset to Month
			</button>
		</div>
	);
}

/** `value` + `onChange` give full external control over the active segment. */
export const Controlled = meta.story({
	name: "Controlled",
	render: () => <ControlledDemo />,
});

/** More segments with icon-like text — indicator still slides correctly. */
export const ManySegments = meta.story({
	name: "Many Segments",
	render: () => (
		<Root class={rootClass} defaultValue="1w">
			<Indicator class={indicatorClass} />
			{(["1D", "1W", "1M", "3M", "6M", "1Y", "ALL"] as const).map((label) => (
				<Item class={`${itemClass} px-3`} value={label.toLowerCase()}>
					<ItemInput />
					<ItemControl class="absolute inset-0 cursor-pointer" />
					<ItemLabel class="pointer-events-none font-mono text-xs">
						{label}
					</ItemLabel>
				</Item>
			))}
		</Root>
	),
});
