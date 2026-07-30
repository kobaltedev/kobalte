import { createSignal } from "solid-js";
import preview from "../../../../../.storybook/preview.js";
import {
	Content,
	Control,
	Indicator,
	Input,
	Item,
	ItemLabel,
	Label,
	Listbox,
	NoResult,
	Portal,
	Root,
} from "../index.tsx";
import style from "./stories.module.css";

const meta = preview.meta({
	title: "Components/Search",
	tags: ["autodocs"],
});

export default meta;

function SearchIcon() {
	return (
		<svg
			class={style.icon}
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			aria-hidden="true"
		>
			<circle cx="11" cy="11" r="8" />
			<path d="m21 21-4.35-4.35" />
		</svg>
	);
}

function SpinnerIcon() {
	return (
		<svg
			class={style.spinnerIcon}
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			aria-hidden="true"
		>
			<path d="M21 12a9 9 0 1 1-6.219-8.56" />
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

function BasicSearch() {
	const [options, setOptions] = createSignal(fruits);

	const onInputChange = (query: string) => {
		setOptions(
			query.length === 0
				? fruits
				: fruits.filter((f) => f.toLowerCase().includes(query.toLowerCase())),
		);
	};

	return (
		<Root
			class={style.wrap}
			options={options()}
			onInputChange={onInputChange}
			itemComponent={(props) => (
				<Item item={props.item} class={style.item}>
					<ItemLabel>{props.item.rawValue as string}</ItemLabel>
				</Item>
			)}
		>
			<Label class={style.label}>Fruit</Label>
			<Control class={style.control}>
				<Indicator class={style.indicator} loadingComponent={<SpinnerIcon />}>
					<SearchIcon />
				</Indicator>
				<Input class={style.input} placeholder="Search fruits…" />
			</Control>
			<Portal>
				<Content class={style.content}>
					<Listbox class={style.listbox} />
					<NoResult class={style.noResult}>No results found.</NoResult>
				</Content>
			</Portal>
		</Root>
	);
}

/** Client-side filtered search — `onInputChange` filters the options array. */
export const Default = meta.story({
	name: "Default",
	render: () => <BasicSearch />,
});

function DebouncedSearch() {
	const [options, setOptions] = createSignal(fruits);

	const onInputChange = async (query: string) => {
		await new Promise((r) => setTimeout(r, 300));
		setOptions(
			query.length === 0
				? fruits
				: fruits.filter((f) => f.toLowerCase().includes(query.toLowerCase())),
		);
	};

	return (
		<Root
			class={style.wrap}
			options={options()}
			onInputChange={onInputChange}
			debounceOptionsMillisecond={300}
			itemComponent={(props) => (
				<Item item={props.item} class={style.item}>
					<ItemLabel>{props.item.rawValue as string}</ItemLabel>
				</Item>
			)}
		>
			<Label class={style.label}>Fruit (debounced 300 ms)</Label>
			<Control class={style.control}>
				<Indicator class={style.indicator} loadingComponent={<SpinnerIcon />}>
					<SearchIcon />
				</Indicator>
				<Input class={style.input} placeholder="Search fruits…" />
			</Control>
			<Portal>
				<Content class={style.content}>
					<Listbox class={style.listbox} />
					<NoResult class={style.noResult}>No results found.</NoResult>
				</Content>
			</Portal>
		</Root>
	);
}

/** `debounceOptionsMillisecond` delays the `onInputChange` call, showing a spinner in the interim. */
export const Debounced = meta.story({
	name: "Debounced",
	render: () => <DebouncedSearch />,
});

function ControlledSearch() {
	const [value, setValue] = createSignal<string | null>(null);
	const [options, setOptions] = createSignal(fruits);

	const onInputChange = (query: string) => {
		setOptions(
			query.length === 0
				? fruits
				: fruits.filter((f) => f.toLowerCase().includes(query.toLowerCase())),
		);
	};

	return (
		<div class={style.controlledWrapper}>
			<Root
				class={style.wrap}
				options={options()}
				value={value()}
				onChange={setValue}
				onInputChange={onInputChange}
				itemComponent={(props) => (
					<Item item={props.item} class={style.item}>
						<ItemLabel>{props.item.rawValue as string}</ItemLabel>
					</Item>
				)}
			>
				<Label class={style.label}>Fruit</Label>
				<Control class={style.control}>
					<Indicator class={style.indicator}>
						<SearchIcon />
					</Indicator>
					<Input class={style.input} placeholder="Search fruits…" />
				</Control>
				<Portal>
					<Content class={style.content}>
						<Listbox class={style.listbox} />
						<NoResult class={style.noResult}>No results found.</NoResult>
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

/** `value` + `onChange` give full external control over the selected option. */
export const Controlled = meta.story({
	name: "Controlled",
	render: () => <ControlledSearch />,
});

type Person = { id: string; name: string; role: string };

const people: Person[] = [
	{ id: "alice", name: "Alice Martin", role: "Engineer" },
	{ id: "bob", name: "Bob Chen", role: "Designer" },
	{ id: "carol", name: "Carol White", role: "Manager" },
	{ id: "dave", name: "Dave Brown", role: "Engineer" },
	{ id: "eve", name: "Eve Johnson", role: "Product" },
];

function ObjectSearch() {
	const [options, setOptions] = createSignal(people);

	const onInputChange = (query: string) => {
		setOptions(
			query.length === 0
				? people
				: people.filter((p) =>
						p.name.toLowerCase().includes(query.toLowerCase()),
					),
		);
	};

	return (
		<Root<Person>
			class={style.wrap}
			options={options()}
			optionValue="id"
			optionTextValue="name"
			onInputChange={onInputChange}
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
				<Indicator>
					<SearchIcon />
				</Indicator>
				<Input class={style.input} placeholder="Search people…" />
			</Control>
			<Portal>
				<Content class={style.content}>
					<Listbox class={style.listbox} />
					<NoResult class={style.noResult}>Nobody found.</NoResult>
				</Content>
			</Portal>
		</Root>
	);
}

/** Object options with `optionValue` + `optionTextValue` — each item shows name and role. */
export const ObjectOptions = meta.story({
	name: "Object Options",
	render: () => <ObjectSearch />,
});
