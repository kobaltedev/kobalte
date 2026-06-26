import { createSignal } from "solid-js";
import preview from "../../../../../.storybook/preview.js";
import { Ellipsis, Item, Items, Next, Previous, Root } from "../index";

const meta = preview.meta({
	title: "Components/Pagination",
	tags: ["autodocs"],
});

export default meta;

const itemClass =
	"inline-flex h-9 w-9 items-center justify-center rounded-md text-sm font-medium transition-colors duration-150 hover:bg-slate-100 data-[current]:bg-blue-500 data-[current]:text-white data-[current]:hover:bg-blue-600 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1";

const navClass =
	"inline-flex h-9 w-9 items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-slate-100 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1";

function ChevronLeft() {
	return (
		<svg
			width="16"
			height="16"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			aria-hidden="true"
		>
			<path d="M15 18l-6-6 6-6" />
		</svg>
	);
}

function ChevronRight() {
	return (
		<svg
			width="16"
			height="16"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			aria-hidden="true"
		>
			<path d="M9 18l6-6-6-6" />
		</svg>
	);
}

function EllipsisIcon() {
	return <span class="text-slate-400 tracking-widest px-1">…</span>;
}

/** Ten pages with a previous/next and a sliding window of items. */
export const Default = meta.story({
	name: "Default",
	render: () => (
		<Root
			class="font-sans"
			count={10}
			itemComponent={(props) => (
				<Item class={itemClass} page={props.page}>
					{props.page}
				</Item>
			)}
			ellipsisComponent={() => (
				<Ellipsis>
					<EllipsisIcon />
				</Ellipsis>
			)}
		>
			<ul class="flex items-center gap-1">
				<Previous class={navClass}>
					<ChevronLeft />
				</Previous>
				<Items />
				<Next class={navClass}>
					<ChevronRight />
				</Next>
			</ul>
		</Root>
	),
});

/** `defaultPage` starts on page 5. */
export const DefaultPage = meta.story({
	name: "Default Page",
	render: () => (
		<Root
			class="font-sans"
			count={10}
			defaultPage={5}
			itemComponent={(props) => (
				<Item class={itemClass} page={props.page}>
					{props.page}
				</Item>
			)}
			ellipsisComponent={() => (
				<Ellipsis>
					<EllipsisIcon />
				</Ellipsis>
			)}
		>
			<ul class="flex items-center gap-1">
				<Previous class={navClass}>
					<ChevronLeft />
				</Previous>
				<Items />
				<Next class={navClass}>
					<ChevronRight />
				</Next>
			</ul>
		</Root>
	),
});

/** `siblingCount={2}` shows two neighbors on each side of the current page. */
export const SiblingCount = meta.story({
	name: "Sibling Count",
	render: () => (
		<Root
			class="font-sans"
			count={20}
			defaultPage={10}
			siblingCount={2}
			itemComponent={(props) => (
				<Item class={itemClass} page={props.page}>
					{props.page}
				</Item>
			)}
			ellipsisComponent={() => (
				<Ellipsis>
					<EllipsisIcon />
				</Ellipsis>
			)}
		>
			<ul class="flex items-center gap-1">
				<Previous class={navClass}>
					<ChevronLeft />
				</Previous>
				<Items />
				<Next class={navClass}>
					<ChevronRight />
				</Next>
			</ul>
		</Root>
	),
});

/** `fixedItems` keeps the row width stable by filling with extra siblings when ellipsis disappear. */
export const FixedItems = meta.story({
	name: "Fixed Items",
	render: () => (
		<Root
			class="font-sans"
			count={15}
			defaultPage={1}
			fixedItems
			itemComponent={(props) => (
				<Item class={itemClass} page={props.page}>
					{props.page}
				</Item>
			)}
			ellipsisComponent={() => (
				<Ellipsis>
					<EllipsisIcon />
				</Ellipsis>
			)}
		>
			<ul class="flex items-center gap-1">
				<Previous class={navClass}>
					<ChevronLeft />
				</Previous>
				<Items />
				<Next class={navClass}>
					<ChevronRight />
				</Next>
			</ul>
		</Root>
	),
});

/** `disabled` disables all navigation. */
export const Disabled = meta.story({
	name: "Disabled",
	render: () => (
		<Root
			class="font-sans opacity-50"
			count={10}
			defaultPage={3}
			disabled
			itemComponent={(props) => (
				<Item class={itemClass} page={props.page}>
					{props.page}
				</Item>
			)}
			ellipsisComponent={() => (
				<Ellipsis>
					<EllipsisIcon />
				</Ellipsis>
			)}
		>
			<ul class="flex items-center gap-1">
				<Previous class={navClass}>
					<ChevronLeft />
				</Previous>
				<Items />
				<Next class={navClass}>
					<ChevronRight />
				</Next>
			</ul>
		</Root>
	),
});

function ControlledDemo() {
	const [page, setPage] = createSignal(1);
	return (
		<div class="flex flex-col gap-3 font-sans">
			<Root
				count={10}
				page={page()}
				onPageChange={setPage}
				itemComponent={(props) => (
					<Item class={itemClass} page={props.page}>
						{props.page}
					</Item>
				)}
				ellipsisComponent={() => (
					<Ellipsis>
						<EllipsisIcon />
					</Ellipsis>
				)}
			>
				<ul class="flex items-center gap-1">
					<Previous class={navClass}>
						<ChevronLeft />
					</Previous>
					<Items />
					<Next class={navClass}>
						<ChevronRight />
					</Next>
				</ul>
			</Root>
			<p class="text-xs text-slate-500">
				Current page: <strong>{page()}</strong>
			</p>
			<button
				type="button"
				class="self-start rounded px-3 py-1.5 text-xs font-medium bg-slate-100 hover:bg-slate-200 transition-colors"
				onClick={() => setPage(1)}
			>
				Reset to page 1
			</button>
		</div>
	);
}

/** `page` + `onPageChange` give full external control over the current page. */
export const Controlled = meta.story({
	name: "Controlled",
	render: () => <ControlledDemo />,
});
