import { createSignal } from "solid-js";
import preview from "../../../../../.storybook/preview.js";
import { Ellipsis, Item, Items, Next, Previous, Root } from "../index.tsx";
import style from "./stories.module.css";

const meta = preview.meta({
	title: "Components/Pagination",
	tags: ["autodocs"],
});

export default meta;

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
	return <span class={style.pagination__ellipsis}>…</span>;
}

/** Ten pages with a previous/next and a sliding window of items. */
export const Default = meta.story({
	name: "Default",
	render: () => (
		<Root
			class={style.pagination__root}
			count={10}
			itemComponent={(props) => (
				<Item class={style.pagination__item} page={props.page}>
					{props.page}
				</Item>
			)}
			ellipsisComponent={() => (
				<Ellipsis>
					<EllipsisIcon />
				</Ellipsis>
			)}
		>
			<ul class={style.pagination__list}>
				<Previous class={style.pagination__nav}>
					<ChevronLeft />
				</Previous>
				<Items />
				<Next class={style.pagination__nav}>
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
			class={style.pagination__root}
			count={10}
			defaultPage={5}
			itemComponent={(props) => (
				<Item class={style.pagination__item} page={props.page}>
					{props.page}
				</Item>
			)}
			ellipsisComponent={() => (
				<Ellipsis>
					<EllipsisIcon />
				</Ellipsis>
			)}
		>
			<ul class={style.pagination__list}>
				<Previous class={style.pagination__nav}>
					<ChevronLeft />
				</Previous>
				<Items />
				<Next class={style.pagination__nav}>
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
			class={style.pagination__root}
			count={20}
			defaultPage={10}
			siblingCount={2}
			itemComponent={(props) => (
				<Item class={style.pagination__item} page={props.page}>
					{props.page}
				</Item>
			)}
			ellipsisComponent={() => (
				<Ellipsis>
					<EllipsisIcon />
				</Ellipsis>
			)}
		>
			<ul class={style.pagination__list}>
				<Previous class={style.pagination__nav}>
					<ChevronLeft />
				</Previous>
				<Items />
				<Next class={style.pagination__nav}>
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
			class={style.pagination__root}
			count={15}
			defaultPage={1}
			fixedItems
			itemComponent={(props) => (
				<Item class={style.pagination__item} page={props.page}>
					{props.page}
				</Item>
			)}
			ellipsisComponent={() => (
				<Ellipsis>
					<EllipsisIcon />
				</Ellipsis>
			)}
		>
			<ul class={style.pagination__list}>
				<Previous class={style.pagination__nav}>
					<ChevronLeft />
				</Previous>
				<Items />
				<Next class={style.pagination__nav}>
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
			class={style["pagination__root--disabled"]}
			count={10}
			defaultPage={3}
			disabled
			itemComponent={(props) => (
				<Item class={style.pagination__item} page={props.page}>
					{props.page}
				</Item>
			)}
			ellipsisComponent={() => (
				<Ellipsis>
					<EllipsisIcon />
				</Ellipsis>
			)}
		>
			<ul class={style.pagination__list}>
				<Previous class={style.pagination__nav}>
					<ChevronLeft />
				</Previous>
				<Items />
				<Next class={style.pagination__nav}>
					<ChevronRight />
				</Next>
			</ul>
		</Root>
	),
});

function ControlledDemo() {
	const [page, setPage] = createSignal(1);
	return (
		<div class={style.pagination__demo}>
			<Root
				count={10}
				page={page()}
				onPageChange={setPage}
				itemComponent={(props) => (
					<Item class={style.pagination__item} page={props.page}>
						{props.page}
					</Item>
				)}
				ellipsisComponent={() => (
					<Ellipsis>
						<EllipsisIcon />
					</Ellipsis>
				)}
			>
				<ul class={style.pagination__list}>
					<Previous class={style.pagination__nav}>
						<ChevronLeft />
					</Previous>
					<Items />
					<Next class={style.pagination__nav}>
						<ChevronRight />
					</Next>
				</ul>
			</Root>
			<p class={style.pagination__text}>
				Current page: <strong>{page()}</strong>
			</p>
			<button
				type="button"
				class={style.pagination__button}
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
