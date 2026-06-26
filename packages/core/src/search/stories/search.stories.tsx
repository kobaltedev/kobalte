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
} from "../index";

const meta = preview.meta({
	title: "Components/Search",
	tags: ["autodocs"],
});

export default meta;

const wrapClass = "flex flex-col gap-1.5 font-sans w-72";
const labelClass = "text-sm font-medium text-slate-700";
const controlClass = "relative flex items-center";
const inputClass =
	"w-full rounded-md border border-slate-300 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1 data-[invalid]:border-red-400";
const contentClass =
	"z-50 min-w-[var(--kb-popper-anchor-width)] rounded-md border border-slate-200 bg-white shadow-md focus:outline-none";
const listboxClass = "max-h-60 overflow-y-auto p-1";
const itemClass =
	"flex items-center rounded-sm px-3 py-2 text-sm text-slate-900 cursor-default select-none outline-none data-[highlighted]:bg-blue-50 data-[highlighted]:text-blue-900 data-[disabled]:opacity-50";
const noResultClass = "px-3 py-4 text-center text-sm text-slate-400";

function SearchIcon() {
	return (
		<svg
			class="h-4 w-4 text-slate-400"
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
			class="h-4 w-4 text-blue-500 animate-spin"
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
			class={wrapClass}
			options={options()}
			onInputChange={onInputChange}
			itemComponent={(props) => (
				<Item item={props.item} class={itemClass}>
					<ItemLabel>{props.item.rawValue as string}</ItemLabel>
				</Item>
			)}
		>
			<Label class={labelClass}>Fruit</Label>
			<Control class={controlClass}>
				<Indicator
					class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2.5"
					loadingComponent={<SpinnerIcon />}
				>
					<SearchIcon />
				</Indicator>
				<Input class={inputClass} placeholder="Search fruits…" />
			</Control>
			<Portal>
				<Content class={contentClass}>
					<Listbox class={listboxClass} />
					<NoResult class={noResultClass}>No results found.</NoResult>
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
			class={wrapClass}
			options={options()}
			onInputChange={onInputChange}
			debounceOptionsMillisecond={300}
			itemComponent={(props) => (
				<Item item={props.item} class={itemClass}>
					<ItemLabel>{props.item.rawValue as string}</ItemLabel>
				</Item>
			)}
		>
			<Label class={labelClass}>Fruit (debounced 300 ms)</Label>
			<Control class={controlClass}>
				<Indicator
					class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2.5"
					loadingComponent={<SpinnerIcon />}
				>
					<SearchIcon />
				</Indicator>
				<Input class={inputClass} placeholder="Search fruits…" />
			</Control>
			<Portal>
				<Content class={contentClass}>
					<Listbox class={listboxClass} />
					<NoResult class={noResultClass}>No results found.</NoResult>
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
		<div class="flex flex-col gap-3 font-sans">
			<Root
				class={wrapClass}
				options={options()}
				value={value()}
				onChange={setValue}
				onInputChange={onInputChange}
				itemComponent={(props) => (
					<Item item={props.item} class={itemClass}>
						<ItemLabel>{props.item.rawValue as string}</ItemLabel>
					</Item>
				)}
			>
				<Label class={labelClass}>Fruit</Label>
				<Control class={controlClass}>
					<Indicator class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2.5">
						<SearchIcon />
					</Indicator>
					<Input class={inputClass} placeholder="Search fruits…" />
				</Control>
				<Portal>
					<Content class={contentClass}>
						<Listbox class={listboxClass} />
						<NoResult class={noResultClass}>No results found.</NoResult>
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
			class={wrapClass}
			options={options()}
			optionValue="id"
			optionTextValue="name"
			onInputChange={onInputChange}
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
				<Indicator>
					<SearchIcon />
				</Indicator>
				<Input class={inputClass} placeholder="Search people…" />
			</Control>
			<Portal>
				<Content class={contentClass}>
					<Listbox class={listboxClass} />
					<NoResult class={noResultClass}>Nobody found.</NoResult>
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
