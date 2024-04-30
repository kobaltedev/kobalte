import { Pagination } from "@kobalte/core/pagination";

import { createSignal } from "solid-js";
import style from "./pagination.module.css";

export function BasicExample() {
	return (
		<Pagination
			class={style.pagination__root}
			count={10}
			itemComponent={(props) => (
				<Pagination.Item class={style.pagination__item} page={props.page}>
					{props.page}
				</Pagination.Item>
			)}
			ellipsisComponent={() => (
				<Pagination.Ellipsis class={style.pagination__ellipsis}>
					...
				</Pagination.Ellipsis>
			)}
		>
			<Pagination.Previous class={style.pagination__item}>
				Previous
			</Pagination.Previous>
			<Pagination.Items />
			<Pagination.Next class={style.pagination__item}>Next</Pagination.Next>
		</Pagination>
	);
}

export function DefaultPageExample() {
	return (
		<Pagination
			class={style.pagination__root}
			count={10}
			defaultPage={4}
			itemComponent={(props) => (
				<Pagination.Item class={style.pagination__item} page={props.page}>
					{props.page}
				</Pagination.Item>
			)}
			ellipsisComponent={() => (
				<Pagination.Ellipsis class={style.pagination__ellipsis}>
					...
				</Pagination.Ellipsis>
			)}
		>
			<Pagination.Previous class={style.pagination__item}>
				Previous
			</Pagination.Previous>
			<Pagination.Items />
			<Pagination.Next class={style.pagination__item}>Next</Pagination.Next>
		</Pagination>
	);
}

export function ControlledExample() {
	const [page, setPage] = createSignal(4);

	return (
		<Pagination
			class={style.pagination__root}
			page={page()}
			onPageChange={setPage}
			count={10}
			itemComponent={(props) => (
				<Pagination.Item class={style.pagination__item} page={props.page}>
					{props.page}
				</Pagination.Item>
			)}
			ellipsisComponent={() => (
				<Pagination.Ellipsis class={style.pagination__ellipsis}>
					...
				</Pagination.Ellipsis>
			)}
		>
			<Pagination.Previous class={style.pagination__item}>
				Previous
			</Pagination.Previous>
			<Pagination.Items />
			<Pagination.Next class={style.pagination__item}>Next</Pagination.Next>
		</Pagination>
	);
}

export function ButtonsExample() {
	return (
		<Pagination
			class={style.pagination__root}
			count={10}
			itemComponent={(props) => (
				<Pagination.Item class={style.pagination__item} page={props.page}>
					{props.page}
				</Pagination.Item>
			)}
			ellipsisComponent={() => (
				<Pagination.Ellipsis class={style.pagination__ellipsis}>
					...
				</Pagination.Ellipsis>
			)}
		>
			<Pagination.Items />
		</Pagination>
	);
}

export function FirstLastExample() {
	return (
		<Pagination
			class={style.pagination__root}
			count={10}
			showFirst={false}
			showLast={false}
			itemComponent={(props) => (
				<Pagination.Item class={style.pagination__item} page={props.page}>
					{props.page}
				</Pagination.Item>
			)}
			ellipsisComponent={() => (
				<Pagination.Ellipsis class={style.pagination__ellipsis}>
					...
				</Pagination.Ellipsis>
			)}
		>
			<Pagination.Previous class={style.pagination__item}>
				Previous
			</Pagination.Previous>
			<Pagination.Items />
			<Pagination.Next class={style.pagination__item}>Next</Pagination.Next>
		</Pagination>
	);
}

export function SiblingsExample() {
	return (
		<Pagination
			class={style.pagination__root}
			count={10}
			siblingCount={2}
			itemComponent={(props) => (
				<Pagination.Item class={style.pagination__item} page={props.page}>
					{props.page}
				</Pagination.Item>
			)}
			ellipsisComponent={() => (
				<Pagination.Ellipsis class={style.pagination__ellipsis}>
					...
				</Pagination.Ellipsis>
			)}
		>
			<Pagination.Previous class={style.pagination__item}>
				Previous
			</Pagination.Previous>
			<Pagination.Items />
			<Pagination.Next class={style.pagination__item}>Next</Pagination.Next>
		</Pagination>
	);
}

export function FixedItemsExample() {
	return (
		<Pagination
			class={style.pagination__root}
			count={10}
			fixedItems
			itemComponent={(props) => (
				<Pagination.Item class={style.pagination__item} page={props.page}>
					{props.page}
				</Pagination.Item>
			)}
			ellipsisComponent={() => (
				<Pagination.Ellipsis class={style.pagination__ellipsis}>
					...
				</Pagination.Ellipsis>
			)}
		>
			<Pagination.Previous class={style.pagination__item}>
				Previous
			</Pagination.Previous>
			<Pagination.Items />
			<Pagination.Next class={style.pagination__item}>Next</Pagination.Next>
		</Pagination>
	);
}
