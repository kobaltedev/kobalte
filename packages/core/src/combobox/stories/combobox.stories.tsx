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
} from "../index.tsx";
import style from "./stories.module.css";

const meta = preview.meta({
	title: "Components/Combobox",
	tags: ["autodocs"],
});

export default meta;

function ChevronDown() {
	return (
		<svg
			class={style.chevronIcon}
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
			class={style.checkIcon}
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

/** Built-in `defaultFilter="contains"` — no `onInputChange` needed. */
export const Default = meta.story({
	name: "Default",
	render: () => (
		<Root
			class={style.wrap}
			options={fruits}
			placeholder="Select a fruit…"
			itemComponent={(props) => (
				<Item item={props.item} class={style.item}>
					<ItemLabel>{props.item.rawValue as string}</ItemLabel>
				</Item>
			)}
		>
			<Label class={style.label}>Fruit</Label>
			<Control class={style.control}>
				<Input class={style.input} />
				<Trigger class={style.trigger}>
					<Icon>
						<ChevronDown />
					</Icon>
				</Trigger>
			</Control>
			<Portal>
				<Content class={style.content}>
					<Listbox class={style.listbox} />
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
			class={style.wrap}
			options={fruits}
			defaultValue="Mango"
			placeholder="Select a fruit…"
			itemComponent={(props) => (
				<Item item={props.item} class={style.item}>
					<ItemLabel>{props.item.rawValue as string}</ItemLabel>
				</Item>
			)}
		>
			<Label class={style.label}>Fruit</Label>
			<Control class={style.control}>
				<Input class={style.input} />
				<Trigger class={style.trigger}>
					<Icon>
						<ChevronDown />
					</Icon>
				</Trigger>
			</Control>
			<Portal>
				<Content class={style.content}>
					<Listbox class={style.listbox} />
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
			<div class={style.controlledWrapper}>
				<Root
					class={style.wrap}
					options={fruits}
					value={value()}
					onChange={setValue}
					placeholder="Select a fruit…"
					itemComponent={(props) => (
						<Item item={props.item} class={style.item}>
							<ItemLabel>{props.item.rawValue as string}</ItemLabel>
						</Item>
					)}
				>
					<Label class={style.label}>Fruit</Label>
					<Control class={style.control}>
						<Input class={style.input} />
						<Trigger class={style.trigger}>
							<Icon>
								<ChevronDown />
							</Icon>
						</Trigger>
					</Control>
					<Portal>
						<Content class={style.content}>
							<Listbox class={style.listbox} />
						</Content>
					</Portal>
				</Root>
				<p class={style.stateText}>
					Selected: <strong>{value() ?? "none"}</strong>
				</p>
				<button
					type="button"
					class={style.resetButton}
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
			class={style.wrap}
			options={people}
			optionValue="id"
			optionTextValue="name"
			optionLabel="name"
			optionDisabled="disabled"
			placeholder="Select a person…"
			itemComponent={(props) => (
				<Item item={props.item} class={style.item}>
					<div class={style.itemTextColumn}>
						<ItemLabel>{(props.item.rawValue as Person).name}</ItemLabel>
						<span class={style.itemSubtext}>
							{(props.item.rawValue as Person).role}
						</span>
					</div>
				</Item>
			)}
		>
			<Label class={style.label}>Assignee</Label>
			<Control class={style.control}>
				<Input class={style.input} />
				<Trigger class={style.trigger}>
					<Icon>
						<ChevronDown />
					</Icon>
				</Trigger>
			</Control>
			<Portal>
				<Content class={style.content}>
					<Listbox class={style.listbox} />
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
			class={style.wrap}
			options={fruits}
			placeholder="Select a fruit…"
			itemComponent={(props) => (
				<Item item={props.item} class={style.item}>
					<ItemIndicator class={style.itemIndicator}>
						<CheckIcon />
					</ItemIndicator>
					<ItemLabel>{props.item.rawValue as string}</ItemLabel>
				</Item>
			)}
		>
			<Label class={style.label}>Fruit</Label>
			<Control class={style.control}>
				<Input class={style.input} />
				<Trigger class={style.trigger}>
					<Icon>
						<ChevronDown />
					</Icon>
				</Trigger>
			</Control>
			<Portal>
				<Content class={style.content}>
					<Listbox class={style.listbox} />
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
			class={style.wrap}
			options={foodGroups}
			optionGroupChildren="options"
			placeholder="Select a food…"
			itemComponent={(props) => (
				<Item item={props.item} class={style.item}>
					<ItemLabel>{props.item.rawValue as string}</ItemLabel>
				</Item>
			)}
			sectionComponent={(props) => (
				<Section>
					<span class={style.sectionLabel}>
						{(props.section.rawValue as FoodGroup).label}
					</span>
				</Section>
			)}
		>
			<Label class={style.label}>Food</Label>
			<Control class={style.control}>
				<Input class={style.input} />
				<Trigger class={style.trigger}>
					<Icon>
						<ChevronDown />
					</Icon>
				</Trigger>
			</Control>
			<Portal>
				<Content class={style.content}>
					<Listbox class={style.listbox} />
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
			<div class={style.multipleWrapper}>
				<Root<string>
					class={style.wrap}
					options={fruits}
					multiple
					value={values()}
					onChange={setValues}
					placeholder="Select fruits…"
					itemComponent={(props) => (
						<Item item={props.item} class={style.item}>
							<ItemIndicator class={style.itemIndicator}>
								<CheckIcon />
							</ItemIndicator>
							<ItemLabel>{props.item.rawValue as string}</ItemLabel>
						</Item>
					)}
				>
					<Label class={style.label}>Fruits</Label>
					<Control class={style.control}>
						<Input class={style.input} placeholder="Select fruits…" />
						<Trigger class={style.trigger}>
							<Icon>
								<ChevronDown />
							</Icon>
						</Trigger>
					</Control>
					<Portal>
						<Content class={style.content}>
							<Listbox class={style.listbox} />
						</Content>
					</Portal>
				</Root>
				<div class={style.multipleTags}>
					<For each={values()}>
						{(v) => (
							<span class={style.tag}>
								{v}
								<button
									type="button"
									class={style.tagRemove}
									onClick={() =>
										setValues((prev) => prev.filter((x) => x !== v))
									}
									aria-label={`Remove ${v}`}
								>
									x
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
			class={style.wrap}
			options={fruits}
			disabled
			defaultValue="Mango"
			placeholder="Select a fruit…"
			itemComponent={(props) => (
				<Item item={props.item} class={style.item}>
					<ItemLabel>{props.item.rawValue as string}</ItemLabel>
				</Item>
			)}
		>
			<Label class={style.label}>Fruit</Label>
			<Control class={style.control}>
				<Input class={style.input} />
				<Trigger class={style.trigger}>
					<Icon>
						<ChevronDown />
					</Icon>
				</Trigger>
			</Control>
			<Portal>
				<Content class={style.content}>
					<Listbox class={style.listbox} />
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
			class={style.wrap}
			options={fruits}
			readOnly
			defaultValue="Mango"
			placeholder="Select a fruit…"
			itemComponent={(props) => (
				<Item item={props.item} class={style.item}>
					<ItemLabel>{props.item.rawValue as string}</ItemLabel>
				</Item>
			)}
		>
			<Label class={style.label}>Fruit</Label>
			<Control class={style.control}>
				<Input class={style.input} />
				<Trigger class={style.trigger}>
					<Icon>
						<ChevronDown />
					</Icon>
				</Trigger>
			</Control>
			<Portal>
				<Content class={style.content}>
					<Listbox class={style.listbox} />
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
				class={style.wrap}
				options={fruits}
				value={value()}
				onChange={setValue}
				validationState={value() == null ? "invalid" : "valid"}
				placeholder="Select a fruit…"
				itemComponent={(props) => (
					<Item item={props.item} class={style.item}>
						<ItemLabel>{props.item.rawValue as string}</ItemLabel>
					</Item>
				)}
			>
				<Label class={style.label}>Fruit</Label>
				<Control class={style.control}>
					<Input class={style.input} />
					<Trigger class={style.trigger}>
						<Icon>
							<ChevronDown />
						</Icon>
					</Trigger>
				</Control>
				<ErrorMessage class={style.error}>Please select a fruit.</ErrorMessage>
				<Portal>
					<Content class={style.content}>
						<Listbox class={style.listbox} />
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
			class={style.wrap}
			options={fruits}
			placeholder="Select a fruit…"
			itemComponent={(props) => (
				<Item item={props.item} class={style.item}>
					<ItemLabel>{props.item.rawValue as string}</ItemLabel>
				</Item>
			)}
		>
			<Label class={style.label}>Fruit</Label>
			<Control class={style.control}>
				<Input class={style.input} />
				<Trigger class={style.trigger}>
					<Icon>
						<ChevronDown />
					</Icon>
				</Trigger>
			</Control>
			<Description class={style.description}>
				Type to filter the list of available fruits.
			</Description>
			<Portal>
				<Content class={style.content}>
					<Listbox class={style.listbox} />
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
			class={style.wrap}
			options={fruits}
			triggerMode="focus"
			placeholder="Select a fruit…"
			itemComponent={(props) => (
				<Item item={props.item} class={style.item}>
					<ItemLabel>{props.item.rawValue as string}</ItemLabel>
				</Item>
			)}
		>
			<Label class={style.label}>Fruit (opens on focus)</Label>
			<Control class={style.control}>
				<Input class={style.input} />
				<Trigger class={style.trigger}>
					<Icon>
						<ChevronDown />
					</Icon>
				</Trigger>
			</Control>
			<Portal>
				<Content class={style.content}>
					<Listbox class={style.listbox} />
				</Content>
			</Portal>
		</Root>
	),
});
