import { createSignal } from "solid-js";
import preview from "../../../../../.storybook/preview.js";
import { Item, Root } from "../index";

const meta = preview.meta({
	title: "Components/ToggleGroup",
	tags: ["autodocs"],
});

export default meta;

const itemClass =
	"inline-flex items-center justify-center px-3 py-1.5 text-sm font-medium text-slate-700 border-y border-r border-slate-200 first:rounded-l-md first:border-l last:rounded-r-md transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-500 data-[pressed]:bg-slate-900 data-[pressed]:text-white data-[pressed]:border-slate-900 data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed";

/** Single-select: only one item active at a time. */
export const Single = meta.story({
	name: "Single",
	render: () => (
		<Root class="inline-flex font-sans" defaultValue="center">
			<Item class={itemClass} value="left">Left</Item>
			<Item class={itemClass} value="center">Center</Item>
			<Item class={itemClass} value="right">Right</Item>
		</Root>
	),
});

/** `multiple` allows any number of items to be active simultaneously. */
export const Multiple = meta.story({
	name: "Multiple",
	render: () => (
		<Root class="inline-flex font-sans" multiple defaultValue={["bold", "underline"]}>
			<Item class={itemClass} value="bold">B</Item>
			<Item class={itemClass} value="italic">I</Item>
			<Item class={itemClass} value="underline">U</Item>
			<Item class={itemClass} value="strikethrough">S</Item>
		</Root>
	),
});

/** `orientation="vertical"` stacks items and wires up up/down arrow-key navigation. */
export const Vertical = meta.story({
	name: "Vertical",
	render: () => (
		<Root
			class="inline-flex flex-col font-sans"
			orientation="vertical"
			defaultValue="list"
		>
			{(["grid", "list", "table"] as const).map((v) => (
				<Item
					class="inline-flex items-center justify-center px-4 py-1.5 text-sm font-medium text-slate-700 border-x border-b border-slate-200 first:rounded-t-md first:border-t last:rounded-b-md transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-500 data-[pressed]:bg-slate-900 data-[pressed]:text-white data-[pressed]:border-slate-900"
					value={v}
				>
					{v.charAt(0).toUpperCase() + v.slice(1)}
				</Item>
			))}
		</Root>
	),
});

/** `disabled` on the root prevents all interaction. */
export const DisabledRoot = meta.story({
	name: "Disabled Root",
	render: () => (
		<Root class="inline-flex font-sans" defaultValue="center" disabled>
			<Item class={itemClass} value="left">Left</Item>
			<Item class={itemClass} value="center">Center</Item>
			<Item class={itemClass} value="right">Right</Item>
		</Root>
	),
});

/** A single item can be disabled independently. */
export const DisabledItem = meta.story({
	name: "Disabled Item",
	render: () => (
		<Root class="inline-flex font-sans" defaultValue="left">
			<Item class={itemClass} value="left">Left</Item>
			<Item class={itemClass} value="center" disabled>Center</Item>
			<Item class={itemClass} value="right">Right</Item>
		</Root>
	),
});

/** Controlled single-select with external state. */
function ControlledSingleDemo() {
	const [value, setValue] = createSignal<string | null>("month");
	return (
		<div class="flex flex-col gap-3 font-sans">
			<Root class="inline-flex" value={value()} onChange={setValue}>
				<Item class={itemClass} value="day">Day</Item>
				<Item class={itemClass} value="week">Week</Item>
				<Item class={itemClass} value="month">Month</Item>
				<Item class={itemClass} value="year">Year</Item>
			</Root>
			<p class="text-xs text-slate-500">
				Selected: <strong>{value() ?? "none"}</strong>
			</p>
		</div>
	);
}

export const ControlledSingle = meta.story({
	name: "Controlled Single",
	render: () => <ControlledSingleDemo />,
});

/** Controlled multi-select with external state. */
function ControlledMultipleDemo() {
	const [value, setValue] = createSignal<string[]>(["bold"]);
	return (
		<div class="flex flex-col gap-3 font-sans">
			<Root class="inline-flex" multiple value={value()} onChange={setValue}>
				<Item class={itemClass} value="bold">Bold</Item>
				<Item class={itemClass} value="italic">Italic</Item>
				<Item class={itemClass} value="underline">Underline</Item>
			</Root>
			<p class="text-xs text-slate-500">
				Active: <strong>{value().join(", ") || "none"}</strong>
			</p>
		</div>
	);
}

export const ControlledMultiple = meta.story({
	name: "Controlled Multiple",
	render: () => <ControlledMultipleDemo />,
});
