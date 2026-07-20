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
} from "../index.tsx";
import style from "./stories.module.css";

const meta = preview.meta({
	title: "Components/Select",
	tags: ["autodocs"],
});

export default meta;

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
			class={style.chevronIcon}
		>
			<path d="M6 9l6 6 6-6" />
		</svg>
	);
}

const fruits = [
	"Apple",
	"Banana",
	"Blueberry",
	"Cherry",
	"Grape",
	"Mango",
	"Peach",
	"Strawberry",
];

/** Single-select from a plain string array. */
export const Default = meta.story({
	name: "Default",
	render: () => (
		<Root
			class={style.wrap}
			options={fruits}
			placeholder="Pick a fruit…"
			itemComponent={(props) => (
				<Item item={props.item} class={style.item}>
					<ItemIndicator class={style.itemIndicator}>
						<CheckIcon />
					</ItemIndicator>
					<ItemLabel>{props.item.rawValue as string}</ItemLabel>
				</Item>
			)}
		>
			<Trigger class={style.trigger}>
				<Value<string>>{(state) => state.selectedOption()}</Value>
				<Icon class={style.icon}>
					<ChevronIcon />
				</Icon>
			</Trigger>
			<Portal>
				<Content class={style.content}>
					<Listbox class={style.listbox} />
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
			class={style.wrap}
			options={fruits}
			defaultValue="Cherry"
			placeholder="Pick a fruit…"
			itemComponent={(props) => (
				<Item item={props.item} class={style.item}>
					<ItemIndicator class={style.itemIndicator}>
						<CheckIcon />
					</ItemIndicator>
					<ItemLabel>{props.item.rawValue as string}</ItemLabel>
				</Item>
			)}
		>
			<Trigger class={style.trigger}>
				<Value<string>>{(state) => state.selectedOption()}</Value>
				<Icon class={style.icon}>
					<ChevronIcon />
				</Icon>
			</Trigger>
			<Portal>
				<Content class={style.content}>
					<Listbox class={style.listbox} />
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
			class={style.wrap}
			options={fruits}
			placeholder="Pick a fruit…"
			itemComponent={(props) => (
				<Item item={props.item} class={style.item}>
					<ItemIndicator class={style.itemIndicator}>
						<CheckIcon />
					</ItemIndicator>
					<ItemLabel>{props.item.rawValue as string}</ItemLabel>
				</Item>
			)}
		>
			<Label class={style.label}>Favorite fruit</Label>
			<Trigger class={style.trigger}>
				<Value<string>>{(state) => state.selectedOption()}</Value>
				<Icon class={style.icon}>
					<ChevronIcon />
				</Icon>
			</Trigger>
			<Description class={style.description}>
				We'll use this to personalize your experience.
			</Description>
			<Portal>
				<Content class={style.content}>
					<Listbox class={style.listbox} />
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
			class={style.wrap}
			options={fruits}
			disabled
			defaultValue="Mango"
			placeholder="Pick a fruit…"
			itemComponent={(props) => (
				<Item item={props.item} class={style.item}>
					<ItemLabel>{props.item.rawValue as string}</ItemLabel>
				</Item>
			)}
		>
			<Label class={style.label}>Favorite fruit</Label>
			<Trigger class={style.trigger}>
				<Value<string>>{(state) => state.selectedOption()}</Value>
				<Icon class={style.icon}>
					<ChevronIcon />
				</Icon>
			</Trigger>
			<Portal>
				<Content class={style.content}>
					<Listbox class={style.listbox} />
				</Content>
			</Portal>
		</Root>
	),
});

function ControlledDemo() {
	const [value, setValue] = createSignal<string | null>(null);
	return (
		<div class={style.controlledWrapper}>
			<Root
				class={style.wrap}
				options={fruits}
				value={value()}
				onChange={setValue}
				placeholder="Pick a fruit…"
				itemComponent={(props) => (
					<Item item={props.item} class={style.item}>
						<ItemIndicator class={style.itemIndicator}>
							<CheckIcon />
						</ItemIndicator>
						<ItemLabel>{props.item.rawValue as string}</ItemLabel>
					</Item>
				)}
			>
				<Label class={style.label}>Favorite fruit</Label>
				<Trigger class={style.trigger}>
					<Value<string>>{(state) => state.selectedOption()}</Value>
					<Icon class={style.icon}>
						<ChevronIcon />
					</Icon>
				</Trigger>
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
			class={style.wrap}
			options={people}
			optionValue="id"
			optionTextValue="name"
			placeholder="Select a person…"
			itemComponent={(props) => (
				<Item item={props.item} class={style.item}>
					<ItemIndicator class={style.itemIndicator}>
						<CheckIcon />
					</ItemIndicator>
					<ItemLabel>{(props.item.rawValue as Person).name}</ItemLabel>
				</Item>
			)}
		>
			<Label class={style.label}>Assign to</Label>
			<Trigger class={style.trigger}>
				<Value<Person>>{(state) => state.selectedOption().name}</Value>
				<Icon class={style.icon}>
					<ChevronIcon />
				</Icon>
			</Trigger>
			<Portal>
				<Content class={style.content}>
					<Listbox class={style.listbox} />
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
			class={style.wrap}
			options={people}
			optionValue="id"
			optionTextValue="name"
			placeholder="Select a person…"
			itemComponent={(props) => (
				<Item item={props.item} class={style.item}>
					<ItemIndicator class={style.itemIndicator}>
						<CheckIcon />
					</ItemIndicator>
					<div class={style.itemTextColumn}>
						<ItemLabel>{(props.item.rawValue as Person).name}</ItemLabel>
						<ItemDescription class={style.itemSubtext}>
							{(props.item.rawValue as Person).role}
						</ItemDescription>
					</div>
				</Item>
			)}
		>
			<Label class={style.label}>Assign to</Label>
			<Trigger class={style.trigger}>
				<Value<Person>>{(state) => state.selectedOption().name}</Value>
				<Icon class={style.icon}>
					<ChevronIcon />
				</Icon>
			</Trigger>
			<Portal>
				<Content class={style.content}>
					<Listbox class={style.listbox} />
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
			class={style.wrap}
			options={fruitGroups}
			optionGroupChildren="fruits"
			placeholder="Pick a fruit…"
			sectionComponent={(props) => (
				<Section>
					<span class={style.sectionLabel}>
						{(props.section.rawValue as FruitGroup).label}
					</span>
				</Section>
			)}
			itemComponent={(props) => (
				<Item item={props.item} class={style.item}>
					<ItemIndicator class={style.itemIndicator}>
						<CheckIcon />
					</ItemIndicator>
					<ItemLabel>{props.item.rawValue as string}</ItemLabel>
				</Item>
			)}
		>
			<Label class={style.label}>Favorite fruit</Label>
			<Trigger class={style.trigger}>
				<Value<string>>{(state) => state.selectedOption()}</Value>
				<Icon class={style.icon}>
					<ChevronIcon />
				</Icon>
			</Trigger>
			<Portal>
				<Content class={style.content}>
					<Listbox class={style.listbox} />
				</Content>
			</Portal>
		</Root>
	),
});

function MultipleDemo() {
	const [values, setValues] = createSignal<string[]>([]);
	return (
		<div class={style.multipleWrapper}>
			<Root<string>
				class={style.wrap}
				options={fruits}
				multiple
				value={values()}
				onChange={setValues}
				placeholder="Pick fruits…"
				itemComponent={(props) => (
					<Item item={props.item} class={style.item}>
						<ItemIndicator class={style.itemIndicator}>
							<CheckIcon />
						</ItemIndicator>
						<ItemLabel>{props.item.rawValue as string}</ItemLabel>
					</Item>
				)}
			>
				<Label class={style.label}>Favorite fruits</Label>
				<Trigger class={style.trigger}>
					<Value<string>>
						{(state) =>
							state.selectedOptions().length > 0
								? `${state.selectedOptions().length} selected`
								: null
						}
					</Value>
					<Icon class={style.icon}>
						<ChevronIcon />
					</Icon>
				</Trigger>
				<Portal>
					<Content class={style.content}>
						<Listbox class={style.listbox} />
					</Content>
				</Portal>
			</Root>
			<p class={style.stateText}>
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
			class={style.wrap}
			options={fruits}
			value={value()}
			onChange={setValue}
			validationState={isInvalid() ? "invalid" : "valid"}
			placeholder="Pick a fruit…"
			itemComponent={(props) => (
				<Item item={props.item} class={style.item}>
					<ItemIndicator class={style.itemIndicator}>
						<CheckIcon />
					</ItemIndicator>
					<ItemLabel>{props.item.rawValue as string}</ItemLabel>
				</Item>
			)}
		>
			<Label class={style.label}>Favorite fruit</Label>
			<Trigger class={`${style.trigger} ${style.triggerInvalid}`}>
				<Value<string>>{(state) => state.selectedOption()}</Value>
				<Icon class={style.icon}>
					<ChevronIcon />
				</Icon>
			</Trigger>
			<Description class={style.description}>
				The only correct answer is Apple.
			</Description>
			<ErrorMessage class={style.error}>Please select Apple.</ErrorMessage>
			<Portal>
				<Content class={style.content}>
					<Listbox class={style.listbox} />
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
