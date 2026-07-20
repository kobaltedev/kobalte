import { createSignal } from "solid-js";
import preview from "../../../../../.storybook/preview.js";
import { Item, Root } from "../index.tsx";
import style from "./stories.module.css";

const meta = preview.meta({
	title: "Components/ToggleGroup",
	tags: ["autodocs"],
});

export default meta;

/** Single-select: only one item active at a time. */
export const Single = meta.story({
	name: "Single",
	render: () => (
		<Root class={style["toggle-group__root"]} defaultValue="center">
			<Item class={style["toggle-group__item"]} value="left">
				Left
			</Item>
			<Item class={style["toggle-group__item"]} value="center">
				Center
			</Item>
			<Item class={style["toggle-group__item"]} value="right">
				Right
			</Item>
		</Root>
	),
});

/** `multiple` allows any number of items to be active simultaneously. */
export const Multiple = meta.story({
	name: "Multiple",
	render: () => (
		<Root
			class={style["toggle-group__root"]}
			multiple
			defaultValue={["bold", "underline"]}
		>
			<Item class={style["toggle-group__item"]} value="bold">
				B
			</Item>
			<Item class={style["toggle-group__item"]} value="italic">
				I
			</Item>
			<Item class={style["toggle-group__item"]} value="underline">
				U
			</Item>
			<Item class={style["toggle-group__item"]} value="strikethrough">
				S
			</Item>
		</Root>
	),
});

/** `orientation="vertical"` stacks items and wires up up/down arrow-key navigation. */
export const Vertical = meta.story({
	name: "Vertical",
	render: () => (
		<Root
			class={style["toggle-group__root--vertical"]}
			orientation="vertical"
			defaultValue="list"
		>
			{(["grid", "list", "table"] as const).map((v) => (
				<Item class={style["toggle-group__item--vertical"]} value={v}>
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
		<Root class={style["toggle-group__root"]} defaultValue="center" disabled>
			<Item class={style["toggle-group__item"]} value="left">
				Left
			</Item>
			<Item class={style["toggle-group__item"]} value="center">
				Center
			</Item>
			<Item class={style["toggle-group__item"]} value="right">
				Right
			</Item>
		</Root>
	),
});

/** A single item can be disabled independently. */
export const DisabledItem = meta.story({
	name: "Disabled Item",
	render: () => (
		<Root class={style["toggle-group__root"]} defaultValue="left">
			<Item class={style["toggle-group__item"]} value="left">
				Left
			</Item>
			<Item class={style["toggle-group__item"]} value="center" disabled>
				Center
			</Item>
			<Item class={style["toggle-group__item"]} value="right">
				Right
			</Item>
		</Root>
	),
});

/** Controlled single-select with external state. */
function ControlledSingleDemo() {
	const [value, setValue] = createSignal<string | null>("month");
	return (
		<div class={style["toggle-group__demo"]}>
			<Root
				class={style["toggle-group__root"]}
				value={value()}
				onChange={setValue}
			>
				<Item class={style["toggle-group__item"]} value="day">
					Day
				</Item>
				<Item class={style["toggle-group__item"]} value="week">
					Week
				</Item>
				<Item class={style["toggle-group__item"]} value="month">
					Month
				</Item>
				<Item class={style["toggle-group__item"]} value="year">
					Year
				</Item>
			</Root>
			<p class={style["toggle-group__text"]}>
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
		<div class={style["toggle-group__demo"]}>
			<Root
				class={style["toggle-group__root"]}
				multiple
				value={value()}
				onChange={setValue}
			>
				<Item class={style["toggle-group__item"]} value="bold">
					Bold
				</Item>
				<Item class={style["toggle-group__item"]} value="italic">
					Italic
				</Item>
				<Item class={style["toggle-group__item"]} value="underline">
					Underline
				</Item>
			</Root>
			<p class={style["toggle-group__text"]}>
				Active: <strong>{value().join(", ") || "none"}</strong>
			</p>
		</div>
	);
}

export const ControlledMultiple = meta.story({
	name: "Controlled Multiple",
	render: () => <ControlledMultipleDemo />,
});
