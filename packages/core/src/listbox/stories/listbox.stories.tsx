import { createSignal } from "solid-js";
import preview from "../../../../../.storybook/preview.js";
import {
	Item,
	ItemDescription,
	ItemIndicator,
	ItemLabel,
	Root,
	Section,
} from "../index";

const meta = preview.meta({
	title: "Components/Listbox",
	tags: ["autodocs"],
});

export default meta;

const listboxClass =
	"w-64 rounded-md border border-slate-200 bg-white p-1 focus:outline-none font-sans";

const itemClass =
	"relative flex cursor-default select-none items-center gap-2 rounded-sm px-8 py-2 text-sm text-slate-900 outline-none data-[highlighted]:bg-blue-50 data-[highlighted]:text-blue-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50";

const itemIndicatorClass =
	"absolute left-2 flex h-4 w-4 items-center justify-center text-blue-600";

const sectionLabelClass =
	"px-2 py-1 text-xs font-semibold uppercase tracking-wide text-slate-400";

const fruits = ["Apple", "Banana", "Blueberry", "Cherry", "Grape", "Mango", "Peach", "Strawberry"];

function CheckIcon() {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="14"
			height="14"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2.5"
			stroke-linecap="round"
			stroke-linejoin="round"
			aria-hidden="true"
		>
			<polyline points="20 6 9 17 4 12" />
		</svg>
	);
}

/** Single-selection listbox from a plain string array. */
export const Default = meta.story({
	name: "Default",
	render: () => (
		<Root
			class={listboxClass}
			options={fruits}
			renderItem={(item) => (
				<Item item={item} class={itemClass}>
					<ItemIndicator class={itemIndicatorClass}>
						<CheckIcon />
					</ItemIndicator>
					<ItemLabel>{item.rawValue as string}</ItemLabel>
				</Item>
			)}
		/>
	),
});

/** `defaultValue` pre-selects an item without controlling state. */
export const DefaultValue = meta.story({
	name: "Default Value",
	render: () => (
		<Root
			class={listboxClass}
			options={fruits}
			defaultValue={["Cherry"]}
			renderItem={(item) => (
				<Item item={item} class={itemClass}>
					<ItemIndicator class={itemIndicatorClass}>
						<CheckIcon />
					</ItemIndicator>
					<ItemLabel>{item.rawValue as string}</ItemLabel>
				</Item>
			)}
		/>
	),
});

function ControlledDemo() {
	const [value, setValue] = createSignal<Set<string>>(new Set());

	return (
		<div class="flex flex-col gap-3 font-sans">
			<Root
				class={listboxClass}
				options={fruits}
				value={value()}
				onChange={setValue}
				renderItem={(item) => (
					<Item item={item} class={itemClass}>
						<ItemIndicator class={itemIndicatorClass}>
							<CheckIcon />
						</ItemIndicator>
						<ItemLabel>{item.rawValue as string}</ItemLabel>
					</Item>
				)}
			/>
			<p class="text-xs text-slate-500">
				Selected: <strong>{[...value()].join(", ") || "none"}</strong>
			</p>
		</div>
	);
}

/** `value` + `onChange` give full external control over selection. */
export const Controlled = meta.story({
	name: "Controlled",
	render: () => <ControlledDemo />,
});

function MultipleDemo() {
	const [value, setValue] = createSignal<Set<string>>(new Set());

	return (
		<div class="flex flex-col gap-3 font-sans">
			<Root
				class={listboxClass}
				options={fruits}
				selectionMode="multiple"
				value={value()}
				onChange={setValue}
				renderItem={(item) => (
					<Item item={item} class={itemClass}>
						<ItemIndicator class={itemIndicatorClass}>
							<CheckIcon />
						</ItemIndicator>
						<ItemLabel>{item.rawValue as string}</ItemLabel>
					</Item>
				)}
			/>
			<p class="text-xs text-slate-500">
				Selected: <strong>{[...value()].join(", ") || "none"}</strong>
			</p>
		</div>
	);
}

/** `selectionMode="multiple"` lets the user pick any number of items. */
export const Multiple = meta.story({
	name: "Multiple",
	render: () => <MultipleDemo />,
});

type Person = { id: string; name: string; role: string };

const people: Person[] = [
	{ id: "alice", name: "Alice Martin", role: "Engineer" },
	{ id: "bob", name: "Bob Chen", role: "Designer" },
	{ id: "carol", name: "Carol White", role: "Manager" },
	{ id: "dave", name: "Dave Brown", role: "Engineer" },
];

/** Object options with `optionValue` and `optionTextValue` for key/display extraction. */
export const ObjectOptions = meta.story({
	name: "Object Options",
	render: () => (
		<Root<Person>
			class={listboxClass}
			options={people}
			optionValue="id"
			optionTextValue="name"
			renderItem={(item) => (
				<Item item={item} class={itemClass}>
					<ItemIndicator class={itemIndicatorClass}>
						<CheckIcon />
					</ItemIndicator>
					<ItemLabel>{(item.rawValue as Person).name}</ItemLabel>
				</Item>
			)}
		/>
	),
});

/** `ItemDescription` adds a second line of detail below each label. */
export const WithDescriptions = meta.story({
	name: "With Descriptions",
	render: () => (
		<Root<Person>
			class={listboxClass}
			options={people}
			optionValue="id"
			optionTextValue="name"
			renderItem={(item) => (
				<Item item={item} class={itemClass}>
					<ItemIndicator class={itemIndicatorClass}>
						<CheckIcon />
					</ItemIndicator>
					<div class="flex flex-col">
						<ItemLabel>{(item.rawValue as Person).name}</ItemLabel>
						<ItemDescription class="text-xs text-slate-500">
							{(item.rawValue as Person).role}
						</ItemDescription>
					</div>
				</Item>
			)}
		/>
	),
});

type FruitGroup = { label: string; fruits: string[] };

const fruitGroups: FruitGroup[] = [
	{ label: "Berries", fruits: ["Blueberry", "Raspberry", "Strawberry"] },
	{ label: "Citrus", fruits: ["Grapefruit", "Lemon", "Orange"] },
	{ label: "Stone Fruit", fruits: ["Cherry", "Mango", "Peach", "Plum"] },
];

/** `optionGroupChildren` + `renderSection` groups options under labelled headings. */
export const WithGroups = meta.story({
	name: "With Groups",
	render: () => (
		<Root<string, FruitGroup>
			class={listboxClass}
			options={fruitGroups}
			optionGroupChildren="fruits"
			renderSection={(section) => (
				<Section>
					<span class={sectionLabelClass}>
						{(section.rawValue as FruitGroup).label}
					</span>
				</Section>
			)}
			renderItem={(item) => (
				<Item item={item} class={itemClass}>
					<ItemIndicator class={itemIndicatorClass}>
						<CheckIcon />
					</ItemIndicator>
					<ItemLabel>{item.rawValue as string}</ItemLabel>
				</Item>
			)}
		/>
	),
});

/** Individual options can be disabled via `optionDisabled`. */
export const WithDisabledItems = meta.story({
	name: "With Disabled Items",
	render: () => (
		<Root
			class={listboxClass}
			options={fruits}
			optionDisabled={(f) => f === "Banana" || f === "Grape"}
			renderItem={(item) => (
				<Item item={item} class={itemClass}>
					<ItemIndicator class={itemIndicatorClass}>
						<CheckIcon />
					</ItemIndicator>
					<ItemLabel>{item.rawValue as string}</ItemLabel>
				</Item>
			)}
		/>
	),
});
