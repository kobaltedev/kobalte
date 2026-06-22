import { createSignal } from "solid-js";
import preview from "../../../../../.storybook/preview.js";
import {
	Content,
	Description,
	ErrorMessage,
	Icon,
	Item,
	ItemDescription,
	ItemIndicator,
	ItemLabel,
	Label,
	Listbox,
	Portal,
	Root,
	Section,
	Trigger,
	Value,
} from "../index";

const meta = preview.meta({
	title: "Components/Select",
	tags: ["autodocs"],
});

export default meta;

// ── Shared styles ──────────────────────────────────────────────────────────

const wrapClass = "flex flex-col gap-1.5 font-sans w-64";

const labelClass = "text-sm font-medium text-slate-700";

const triggerClass =
	"inline-flex w-full items-center justify-between gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 data-[expanded]:border-blue-500 data-[expanded]:ring-2 data-[expanded]:ring-blue-500 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50";

const iconClass =
	"text-slate-400 transition-transform duration-200 data-[expanded]:rotate-180";

const contentClass =
	"z-50 min-w-[var(--kb-popper-anchor-width)] rounded-md border border-slate-200 bg-white shadow-md focus:outline-none";

const listboxClass = "max-h-60 overflow-y-auto p-1 focus:outline-none";

const itemClass =
	"relative flex items-center gap-2 rounded-sm px-8 py-2 text-sm text-slate-900 cursor-default select-none outline-none data-[highlighted]:bg-blue-50 data-[highlighted]:text-blue-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50";

const itemIndicatorClass =
	"absolute left-2 flex h-4 w-4 items-center justify-center";

const sectionLabelClass =
	"px-2 py-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wide";

const descriptionClass = "text-xs text-slate-500";
const errorClass = "text-xs text-red-600";

// ── Shared components ──────────────────────────────────────────────────────

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

function ChevronIcon() {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="16"
			height="16"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			aria-hidden="true"
			class="shrink-0"
		>
			<path d="M6 9l6 6 6-6" />
		</svg>
	);
}

// ── Stories ────────────────────────────────────────────────────────────────

const fruits = ["Apple", "Banana", "Blueberry", "Cherry", "Grape", "Mango", "Peach", "Strawberry"];

/** Single-select from a plain string array. */
export const Default = meta.story({
	name: "Default",
	render: () => (
		<Root
			class={wrapClass}
			options={fruits}
			itemComponent={(props) => (
				<Item item={props.item} class={itemClass}>
					<ItemIndicator class={itemIndicatorClass}>
						<CheckIcon />
					</ItemIndicator>
					<ItemLabel>{props.item.rawValue as string}</ItemLabel>
				</Item>
			)}
		>
			<Trigger class={triggerClass}>
				<Value<string> placeholder="Pick a fruit…">
					{(state) => state.selectedOption()}
				</Value>
				<Icon class={iconClass}>
					<ChevronIcon />
				</Icon>
			</Trigger>
			<Portal>
				<Content class={contentClass}>
					<Listbox class={listboxClass} />
				</Content>
			</Portal>
		</Root>
	),
});

/** `defaultValue` pre-selects an option without controlling state. */
export const DefaultValue = meta.story({
	name: "Default Value",
	render: () => (
		<Root
			class={wrapClass}
			options={fruits}
			defaultValue="Cherry"
			itemComponent={(props) => (
				<Item item={props.item} class={itemClass}>
					<ItemIndicator class={itemIndicatorClass}>
						<CheckIcon />
					</ItemIndicator>
					<ItemLabel>{props.item.rawValue as string}</ItemLabel>
				</Item>
			)}
		>
			<Trigger class={triggerClass}>
				<Value<string> placeholder="Pick a fruit…">
					{(state) => state.selectedOption()}
				</Value>
				<Icon class={iconClass}>
					<ChevronIcon />
				</Icon>
			</Trigger>
			<Portal>
				<Content class={contentClass}>
					<Listbox class={listboxClass} />
				</Content>
			</Portal>
		</Root>
	),
});

/** Adds a `Label` and `Description` for full form-field context. */
export const WithLabel = meta.story({
	name: "With Label",
	render: () => (
		<Root
			class={wrapClass}
			options={fruits}
			itemComponent={(props) => (
				<Item item={props.item} class={itemClass}>
					<ItemIndicator class={itemIndicatorClass}>
						<CheckIcon />
					</ItemIndicator>
					<ItemLabel>{props.item.rawValue as string}</ItemLabel>
				</Item>
			)}
		>
			<Label class={labelClass}>Favorite fruit</Label>
			<Trigger class={triggerClass}>
				<Value<string> placeholder="Pick a fruit…">
					{(state) => state.selectedOption()}
				</Value>
				<Icon class={iconClass}>
					<ChevronIcon />
				</Icon>
			</Trigger>
			<Description class={descriptionClass}>
				We'll use this to personalize your experience.
			</Description>
			<Portal>
				<Content class={contentClass}>
					<Listbox class={listboxClass} />
				</Content>
			</Portal>
		</Root>
	),
});

/** `disabled` prevents opening and dims the trigger. */
export const Disabled = meta.story({
	name: "Disabled",
	render: () => (
		<Root
			class={wrapClass}
			options={fruits}
			disabled
			defaultValue="Mango"
			itemComponent={(props) => (
				<Item item={props.item} class={itemClass}>
					<ItemLabel>{props.item.rawValue as string}</ItemLabel>
				</Item>
			)}
		>
			<Label class={labelClass}>Favorite fruit</Label>
			<Trigger class={triggerClass}>
				<Value<string> placeholder="Pick a fruit…">
					{(state) => state.selectedOption()}
				</Value>
				<Icon class={iconClass}>
					<ChevronIcon />
				</Icon>
			</Trigger>
			<Portal>
				<Content class={contentClass}>
					<Listbox class={listboxClass} />
				</Content>
			</Portal>
		</Root>
	),
});

function ControlledDemo() {
	const [value, setValue] = createSignal<string | null>(null);
	return (
		<div class="flex flex-col gap-3 font-sans">
			<Root
				class={wrapClass}
				options={fruits}
				value={value()}
				onChange={setValue}
				itemComponent={(props) => (
					<Item item={props.item} class={itemClass}>
						<ItemIndicator class={itemIndicatorClass}>
							<CheckIcon />
						</ItemIndicator>
						<ItemLabel>{props.item.rawValue as string}</ItemLabel>
					</Item>
				)}
			>
				<Label class={labelClass}>Favorite fruit</Label>
				<Trigger class={triggerClass}>
					<Value<string> placeholder="Pick a fruit…">
						{(state) => state.selectedOption()}
					</Value>
					<Icon class={iconClass}>
						<ChevronIcon />
					</Icon>
				</Trigger>
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
}

/** `value` + `onChange` give full external control over selection. */
export const Controlled = meta.story({
	name: "Controlled",
	render: () => <ControlledDemo />,
});

type Person = { id: string; name: string; role: string };

const people: Person[] = [
	{ id: "alice", name: "Alice Martin", role: "Engineer" },
	{ id: "bob", name: "Bob Chen", role: "Designer" },
	{ id: "carol", name: "Carol White", role: "Manager" },
	{ id: "dave", name: "Dave Brown", role: "Engineer" },
];

/** Object options use `optionValue` + `optionTextValue` to extract the key and display text. */
export const ObjectOptions = meta.story({
	name: "Object Options",
	render: () => (
		<Root<Person>
			class={wrapClass}
			options={people}
			optionValue="id"
			optionTextValue="name"
			itemComponent={(props) => (
				<Item item={props.item} class={itemClass}>
					<ItemIndicator class={itemIndicatorClass}>
						<CheckIcon />
					</ItemIndicator>
					<ItemLabel>{(props.item.rawValue as Person).name}</ItemLabel>
				</Item>
			)}
		>
			<Label class={labelClass}>Assign to</Label>
			<Trigger class={triggerClass}>
				<Value<Person> placeholder="Select a person…">
					{(state) => state.selectedOption().name}
				</Value>
				<Icon class={iconClass}>
					<ChevronIcon />
				</Icon>
			</Trigger>
			<Portal>
				<Content class={contentClass}>
					<Listbox class={listboxClass} />
				</Content>
			</Portal>
		</Root>
	),
});

/** Items can carry a secondary description line below their label. */
export const ItemWithDescription = meta.story({
	name: "Item With Description",
	render: () => (
		<Root<Person>
			class={wrapClass}
			options={people}
			optionValue="id"
			optionTextValue="name"
			itemComponent={(props) => (
				<Item item={props.item} class={itemClass}>
					<ItemIndicator class={itemIndicatorClass}>
						<CheckIcon />
					</ItemIndicator>
					<div class="flex flex-col">
						<ItemLabel>{(props.item.rawValue as Person).name}</ItemLabel>
						<ItemDescription class="text-xs text-slate-500">
							{(props.item.rawValue as Person).role}
						</ItemDescription>
					</div>
				</Item>
			)}
		>
			<Label class={labelClass}>Assign to</Label>
			<Trigger class={triggerClass}>
				<Value<Person> placeholder="Select a person…">
					{(state) => state.selectedOption().name}
				</Value>
				<Icon class={iconClass}>
					<ChevronIcon />
				</Icon>
			</Trigger>
			<Portal>
				<Content class={contentClass}>
					<Listbox class={listboxClass} />
				</Content>
			</Portal>
		</Root>
	),
});

type FruitGroup = { label: string; fruits: string[] };

const fruitGroups: FruitGroup[] = [
	{ label: "Berries", fruits: ["Blueberry", "Raspberry", "Strawberry"] },
	{ label: "Citrus", fruits: ["Grapefruit", "Lemon", "Orange"] },
	{ label: "Stone Fruit", fruits: ["Cherry", "Mango", "Peach", "Plum"] },
];

/** `optionGroupChildren` + `sectionComponent` groups options under headings. */
export const WithGroups = meta.story({
	name: "With Groups",
	render: () => (
		<Root<string, FruitGroup>
			class={wrapClass}
			options={fruitGroups}
			optionGroupChildren="fruits"
			sectionComponent={(props) => (
				<Section section={props.section}>
					<span class={sectionLabelClass}>
						{(props.section.rawValue as FruitGroup).label}
					</span>
				</Section>
			)}
			itemComponent={(props) => (
				<Item item={props.item} class={itemClass}>
					<ItemIndicator class={itemIndicatorClass}>
						<CheckIcon />
					</ItemIndicator>
					<ItemLabel>{props.item.rawValue as string}</ItemLabel>
				</Item>
			)}
		>
			<Label class={labelClass}>Favorite fruit</Label>
			<Trigger class={triggerClass}>
				<Value<string> placeholder="Pick a fruit…">
					{(state) => state.selectedOption()}
				</Value>
				<Icon class={iconClass}>
					<ChevronIcon />
				</Icon>
			</Trigger>
			<Portal>
				<Content class={contentClass}>
					<Listbox class={listboxClass} />
				</Content>
			</Portal>
		</Root>
	),
});

function MultipleDemo() {
	const [values, setValues] = createSignal<string[]>([]);
	return (
		<div class="flex flex-col gap-3 font-sans">
			<Root
				class={wrapClass}
				options={fruits}
				multiple
				value={values()}
				onChange={setValues}
				itemComponent={(props) => (
					<Item item={props.item} class={itemClass}>
						<ItemIndicator class={itemIndicatorClass}>
							<CheckIcon />
						</ItemIndicator>
						<ItemLabel>{props.item.rawValue as string}</ItemLabel>
					</Item>
				)}
			>
				<Label class={labelClass}>Favorite fruits</Label>
				<Trigger class={triggerClass}>
					<Value<string> placeholder="Pick fruits…">
						{(state) =>
							state.selectedOptions().length > 0
								? `${state.selectedOptions().length} selected`
								: null
						}
					</Value>
					<Icon class={iconClass}>
						<ChevronIcon />
					</Icon>
				</Trigger>
				<Portal>
					<Content class={contentClass}>
						<Listbox class={listboxClass} />
					</Content>
				</Portal>
			</Root>
			<p class="text-xs text-slate-500">
				Selected: <strong>{values().join(", ") || "none"}</strong>
			</p>
		</div>
	);
}

/** `multiple` allows selecting any number of options; the listbox stays open after each pick. */
export const Multiple = meta.story({
	name: "Multiple",
	render: () => <MultipleDemo />,
});

function ValidationDemo() {
	const [value, setValue] = createSignal<string | null>(null);
	const isInvalid = () => value() !== null && value() !== "Apple";
	return (
		<Root
			class={wrapClass}
			options={fruits}
			value={value()}
			onChange={setValue}
			validationState={isInvalid() ? "invalid" : "valid"}
			itemComponent={(props) => (
				<Item item={props.item} class={itemClass}>
					<ItemIndicator class={itemIndicatorClass}>
						<CheckIcon />
					</ItemIndicator>
					<ItemLabel>{props.item.rawValue as string}</ItemLabel>
				</Item>
			)}
		>
			<Label class={labelClass}>Favorite fruit</Label>
			<Trigger class={`${triggerClass} data-[invalid]:border-red-500 data-[invalid]:ring-red-500`}>
				<Value<string> placeholder="Pick a fruit…">
					{(state) => state.selectedOption()}
				</Value>
				<Icon class={iconClass}>
					<ChevronIcon />
				</Icon>
			</Trigger>
			<Description class={descriptionClass}>The only correct answer is Apple.</Description>
			<ErrorMessage class={errorClass}>Please select Apple.</ErrorMessage>
			<Portal>
				<Content class={contentClass}>
					<Listbox class={listboxClass} />
				</Content>
			</Portal>
		</Root>
	);
}

/** `validationState="invalid"` reveals the `ErrorMessage` and applies `data-invalid` to parts. */
export const WithValidation = meta.story({
	name: "With Validation",
	render: () => <ValidationDemo />,
});
