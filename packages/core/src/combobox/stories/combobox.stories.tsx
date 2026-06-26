import { createSignal, For } from "solid-js";
import preview from "../../../../../.storybook/preview.js";
import {
	Content,
	Control,
	Description,
	ErrorMessage,
	Icon,
	Input,
	Item,
	ItemIndicator,
	ItemLabel,
	Label,
	Listbox,
	Portal,
	Root,
	Section,
	Trigger,
} from "../index";

const meta = preview.meta({
	title: "Components/Combobox",
	tags: ["autodocs"],
});

export default meta;

// ─── shared styles ───────────────────────────────────────────────────────────

const wrapClass = "flex flex-col gap-1.5 font-sans w-72";
const labelClass = "text-sm font-medium text-slate-700";
const descriptionClass = "text-xs text-slate-500";
const errorClass = "text-xs text-red-600";
// Control is the bordered container; Input is borderless inside it
const controlClass =
	"flex items-center rounded-md border border-slate-300 bg-white focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-1 data-[invalid]:border-red-400";
const inputClass =
	"flex-1 py-2 pl-3 pr-1 text-sm bg-transparent text-slate-900 placeholder:text-slate-400 focus:outline-none min-w-0";
const triggerClass =
	"flex items-center pr-2 pl-1 text-slate-400 hover:text-slate-700 focus:outline-none shrink-0";
const contentClass =
	"z-50 min-w-[var(--kb-popper-anchor-width)] rounded-md border border-slate-200 bg-white shadow-md focus:outline-none";
const listboxClass = "max-h-60 overflow-y-auto p-1";
const itemClass =
	"flex items-center rounded-sm px-3 py-2 text-sm text-slate-900 cursor-default select-none outline-none data-[highlighted]:bg-blue-50 data-[highlighted]:text-blue-900 data-[disabled]:opacity-50";
const itemIndicatorClass = "mr-2 flex items-center";
const itemWithIndicatorClass =
	"flex items-center rounded-sm px-3 py-2 text-sm text-slate-900 cursor-default select-none outline-none data-[highlighted]:bg-blue-50 data-[highlighted]:text-blue-900 data-[disabled]:opacity-50";
const sectionClass =
	"px-3 pt-3 pb-1 text-xs font-semibold text-slate-400 uppercase tracking-wider";

function ChevronDown() {
	return (
		<svg
			class="h-4 w-4"
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			aria-hidden="true"
		>
			<path d="m6 9 6 6 6-6" />
		</svg>
	);
}

function CheckIcon() {
	return (
		<svg
			class="h-4 w-4 text-blue-600"
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2.5"
			stroke-linecap="round"
			stroke-linejoin="round"
			aria-hidden="true"
		>
			<path d="M20 6 9 17l-5-5" />
		</svg>
	);
}

// ─── data ────────────────────────────────────────────────────────────────────

const fruits = [
	"Apple",
	"Apricot",
	"Avocado",
	"Banana",
	"Blueberry",
	"Cherry",
	"Grape",
	"Kiwi",
	"Lemon",
	"Mango",
	"Orange",
	"Papaya",
	"Peach",
	"Pear",
	"Pineapple",
	"Plum",
	"Raspberry",
	"Strawberry",
	"Watermelon",
];

type Person = { id: string; name: string; role: string; disabled?: boolean };

const people: Person[] = [
	{ id: "alice", name: "Alice Martin", role: "Engineer" },
	{ id: "bob", name: "Bob Chen", role: "Designer" },
	{ id: "carol", name: "Carol White", role: "Manager" },
	{ id: "dave", name: "Dave Brown", role: "Engineer", disabled: true },
	{ id: "eve", name: "Eve Johnson", role: "Product" },
];

type FoodGroup = { label: string; options: string[] };

const foodGroups: FoodGroup[] = [
	{ label: "Fruits", options: ["Apple", "Banana", "Mango", "Orange"] },
	{ label: "Vegetables", options: ["Broccoli", "Carrot", "Spinach", "Tomato"] },
	{ label: "Grains", options: ["Oats", "Quinoa", "Rice", "Wheat"] },
];

// ─── stories ─────────────────────────────────────────────────────────────────

/** Built-in `defaultFilter="contains"` — no `onInputChange` needed. */
export const Default = meta.story({
	name: "Default",
	render: () => (
		<Root
			class={wrapClass}
			options={fruits}
			placeholder="Select a fruit…"
			itemComponent={(props) => (
				<Item item={props.item} class={itemClass}>
					<ItemLabel>{props.item.rawValue as string}</ItemLabel>
				</Item>
			)}
		>
			<Label class={labelClass}>Fruit</Label>
			<Control class={controlClass}>
				<Input class={inputClass} />
				<Trigger class={triggerClass}>
					<Icon>
						<ChevronDown />
					</Icon>
				</Trigger>
			</Control>
			<Portal>
				<Content class={contentClass}>
					<Listbox class={listboxClass} />
				</Content>
			</Portal>
		</Root>
	),
});

/** `defaultValue` sets an initial selection without controlling it. */
export const DefaultValue = meta.story({
	name: "Default Value",
	render: () => (
		<Root
			class={wrapClass}
			options={fruits}
			defaultValue="Mango"
			placeholder="Select a fruit…"
			itemComponent={(props) => (
				<Item item={props.item} class={itemClass}>
					<ItemLabel>{props.item.rawValue as string}</ItemLabel>
				</Item>
			)}
		>
			<Label class={labelClass}>Fruit</Label>
			<Control class={controlClass}>
				<Input class={inputClass} />
				<Trigger class={triggerClass}>
					<Icon>
						<ChevronDown />
					</Icon>
				</Trigger>
			</Control>
			<Portal>
				<Content class={contentClass}>
					<Listbox class={listboxClass} />
				</Content>
			</Portal>
		</Root>
	),
});

/** `value` + `onChange` give full external control over the selected option. */
export const Controlled = meta.story({
	name: "Controlled",
	render: () => {
		const [value, setValue] = createSignal<string | null>(null);

		return (
			<div class="flex flex-col gap-3 font-sans">
				<Root
					class={wrapClass}
					options={fruits}
					value={value()}
					onChange={setValue}
					placeholder="Select a fruit…"
					itemComponent={(props) => (
						<Item item={props.item} class={itemClass}>
							<ItemLabel>{props.item.rawValue as string}</ItemLabel>
						</Item>
					)}
				>
					<Label class={labelClass}>Fruit</Label>
					<Control class={controlClass}>
						<Input class={inputClass} />
						<Trigger class={triggerClass}>
							<Icon>
								<ChevronDown />
							</Icon>
						</Trigger>
					</Control>
					<Portal>
						<Content class={contentClass}>
							<Listbox class={listboxClass} />
						</Content>
					</Portal>
				</Root>
				<p class="text-xs text-slate-500">
					Selected: <strong>{value() ?? "none"}</strong>
				</p>
				<button
					type="button"
					class="self-start rounded px-3 py-1.5 text-xs font-medium bg-slate-100 hover:bg-slate-200 transition-colors"
					onClick={() => setValue(null)}
				>
					Clear
				</button>
			</div>
		);
	},
});

/** Object options with `optionValue`, `optionTextValue`, and `optionLabel`. */
export const ObjectOptions = meta.story({
	name: "Object Options",
	render: () => (
		<Root<Person>
			class={wrapClass}
			options={people}
			optionValue="id"
			optionTextValue="name"
			optionLabel="name"
			optionDisabled="disabled"
			placeholder="Select a person…"
			itemComponent={(props) => (
				<Item item={props.item} class={itemClass}>
					<div class="flex flex-col">
						<ItemLabel>{(props.item.rawValue as Person).name}</ItemLabel>
						<span class="text-xs text-slate-400">
							{(props.item.rawValue as Person).role}
						</span>
					</div>
				</Item>
			)}
		>
			<Label class={labelClass}>Assignee</Label>
			<Control class={controlClass}>
				<Input class={inputClass} />
				<Trigger class={triggerClass}>
					<Icon>
						<ChevronDown />
					</Icon>
				</Trigger>
			</Control>
			<Portal>
				<Content class={contentClass}>
					<Listbox class={listboxClass} />
				</Content>
			</Portal>
		</Root>
	),
});

/** `ItemIndicator` shows a checkmark next to the selected item. */
export const WithItemIndicator = meta.story({
	name: "With Item Indicator",
	render: () => (
		<Root
			class={wrapClass}
			options={fruits}
			placeholder="Select a fruit…"
			itemComponent={(props) => (
				<Item item={props.item} class={itemWithIndicatorClass}>
					<ItemIndicator class={itemIndicatorClass}>
						<CheckIcon />
					</ItemIndicator>
					<ItemLabel>{props.item.rawValue as string}</ItemLabel>
				</Item>
			)}
		>
			<Label class={labelClass}>Fruit</Label>
			<Control class={controlClass}>
				<Input class={inputClass} />
				<Trigger class={triggerClass}>
					<Icon>
						<ChevronDown />
					</Icon>
				</Trigger>
			</Control>
			<Portal>
				<Content class={contentClass}>
					<Listbox class={listboxClass} />
				</Content>
			</Portal>
		</Root>
	),
});

/** `optionGroupChildren` + `sectionComponent` render grouped options with headers. */
export const WithSections = meta.story({
	name: "With Sections",
	render: () => (
		<Root<string, FoodGroup>
			class={wrapClass}
			options={foodGroups}
			optionGroupChildren="options"
			placeholder="Select a food…"
			itemComponent={(props) => (
				<Item item={props.item} class={itemClass}>
					<ItemLabel>{props.item.rawValue as string}</ItemLabel>
				</Item>
			)}
			sectionComponent={(props) => (
				<Section>
					<span class={sectionClass}>
						{(props.section.rawValue as FoodGroup).label}
					</span>
				</Section>
			)}
		>
			<Label class={labelClass}>Food</Label>
			<Control class={controlClass}>
				<Input class={inputClass} />
				<Trigger class={triggerClass}>
					<Icon>
						<ChevronDown />
					</Icon>
				</Trigger>
			</Control>
			<Portal>
				<Content class={contentClass}>
					<Listbox class={listboxClass} />
				</Content>
			</Portal>
		</Root>
	),
});

/** `multiple` enables multi-selection; `Control` render prop exposes selected options and a clear handler. */
export const MultiSelect = meta.story({
	name: "Multi Select",
	render: () => {
		const [values, setValues] = createSignal<string[]>([]);

		return (
			<div class="flex flex-col gap-3 font-sans">
				<Root
					class={wrapClass}
					options={fruits}
					multiple
					value={values()}
					onChange={setValues}
					placeholder="Select fruits…"
					itemComponent={(props) => (
						<Item item={props.item} class={itemWithIndicatorClass}>
							<ItemIndicator class={itemIndicatorClass}>
								<CheckIcon />
							</ItemIndicator>
							<ItemLabel>{props.item.rawValue as string}</ItemLabel>
						</Item>
					)}
				>
					<Label class={labelClass}>Fruits</Label>
					<Control class={controlClass}>
						<Input class={inputClass} placeholder="Select fruits…" />
						<Trigger class={triggerClass}>
							<Icon>
								<ChevronDown />
							</Icon>
						</Trigger>
					</Control>
					<Portal>
						<Content class={contentClass}>
							<Listbox class={listboxClass} />
						</Content>
					</Portal>
				</Root>
				<div class="flex flex-wrap gap-1.5">
					<For each={values()}>
						{(v) => (
							<span class="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
								{v}
								<button
									type="button"
									class="ml-0.5 text-blue-500 hover:text-blue-700 focus:outline-none"
									onClick={() =>
										setValues((prev) => prev.filter((x) => x !== v))
									}
									aria-label={`Remove ${v}`}
								>
									×
								</button>
							</span>
						)}
					</For>
				</div>
			</div>
		);
	},
});

/** `disabled` on the root makes the entire combobox non-interactive. */
export const Disabled = meta.story({
	name: "Disabled",
	render: () => (
		<Root
			class={wrapClass}
			options={fruits}
			disabled
			defaultValue="Mango"
			placeholder="Select a fruit…"
			itemComponent={(props) => (
				<Item item={props.item} class={itemClass}>
					<ItemLabel>{props.item.rawValue as string}</ItemLabel>
				</Item>
			)}
		>
			<Label class={labelClass}>Fruit</Label>
			<Control class={controlClass}>
				<Input class={inputClass} />
				<Trigger class={triggerClass}>
					<Icon>
						<ChevronDown />
					</Icon>
				</Trigger>
			</Control>
			<Portal>
				<Content class={contentClass}>
					<Listbox class={listboxClass} />
				</Content>
			</Portal>
		</Root>
	),
});

/** `readOnly` allows focus and display but prevents changing the selection. */
export const ReadOnly = meta.story({
	name: "Read Only",
	render: () => (
		<Root
			class={wrapClass}
			options={fruits}
			readOnly
			defaultValue="Mango"
			placeholder="Select a fruit…"
			itemComponent={(props) => (
				<Item item={props.item} class={itemClass}>
					<ItemLabel>{props.item.rawValue as string}</ItemLabel>
				</Item>
			)}
		>
			<Label class={labelClass}>Fruit</Label>
			<Control class={controlClass}>
				<Input class={inputClass} />
				<Trigger class={triggerClass}>
					<Icon>
						<ChevronDown />
					</Icon>
				</Trigger>
			</Control>
			<Portal>
				<Content class={contentClass}>
					<Listbox class={listboxClass} />
				</Content>
			</Portal>
		</Root>
	),
});

/** `validationState="invalid"` + `ErrorMessage` surfaces a field error. */
export const Invalid = meta.story({
	name: "Invalid",
	render: () => {
		const [value, setValue] = createSignal<string | null>(null);

		return (
			<Root
				class={wrapClass}
				options={fruits}
				value={value()}
				onChange={setValue}
				validationState={value() == null ? "invalid" : "valid"}
				placeholder="Select a fruit…"
				itemComponent={(props) => (
					<Item item={props.item} class={itemClass}>
						<ItemLabel>{props.item.rawValue as string}</ItemLabel>
					</Item>
				)}
			>
				<Label class={labelClass}>Fruit</Label>
				<Control class={controlClass}>
					<Input class={inputClass} />
					<Trigger class={triggerClass}>
						<Icon>
							<ChevronDown />
						</Icon>
					</Trigger>
				</Control>
				<ErrorMessage class={errorClass}>Please select a fruit.</ErrorMessage>
				<Portal>
					<Content class={contentClass}>
						<Listbox class={listboxClass} />
					</Content>
				</Portal>
			</Root>
		);
	},
});

/** `Description` provides helper text below the control. */
export const WithDescription = meta.story({
	name: "With Description",
	render: () => (
		<Root
			class={wrapClass}
			options={fruits}
			placeholder="Select a fruit…"
			itemComponent={(props) => (
				<Item item={props.item} class={itemClass}>
					<ItemLabel>{props.item.rawValue as string}</ItemLabel>
				</Item>
			)}
		>
			<Label class={labelClass}>Fruit</Label>
			<Control class={controlClass}>
				<Input class={inputClass} />
				<Trigger class={triggerClass}>
					<Icon>
						<ChevronDown />
					</Icon>
				</Trigger>
			</Control>
			<Description class={descriptionClass}>
				Type to filter the list of available fruits.
			</Description>
			<Portal>
				<Content class={contentClass}>
					<Listbox class={listboxClass} />
				</Content>
			</Portal>
		</Root>
	),
});

/** `triggerMode="focus"` opens the dropdown when the input receives focus. */
export const TriggerOnFocus = meta.story({
	name: "Trigger on Focus",
	render: () => (
		<Root
			class={wrapClass}
			options={fruits}
			triggerMode="focus"
			placeholder="Select a fruit…"
			itemComponent={(props) => (
				<Item item={props.item} class={itemClass}>
					<ItemLabel>{props.item.rawValue as string}</ItemLabel>
				</Item>
			)}
		>
			<Label class={labelClass}>Fruit (opens on focus)</Label>
			<Control class={controlClass}>
				<Input class={inputClass} />
				<Trigger class={triggerClass}>
					<Icon>
						<ChevronDown />
					</Icon>
				</Trigger>
			</Control>
			<Portal>
				<Content class={contentClass}>
					<Listbox class={listboxClass} />
				</Content>
			</Portal>
		</Root>
	),
});
