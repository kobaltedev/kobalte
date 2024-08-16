import { For, Show, batch, createEffect, createMemo, createSignal, untrack } from "solid-js";

import { usePaginationContext } from "./pagination-context";

export interface PaginationItemsProps {}

export function PaginationItems(props: PaginationItemsProps) {
	const context = usePaginationContext();

	const items = createMemo(() => {
		let showFirst = context.showFirst() && context.page() - 1 > context.siblingCount();
		let showLast = context.showLast() && context.count() - context.page() > context.siblingCount();

		let showFirstEllipsis = context.page() - (context.showFirst() ? 2 : 1) > context.siblingCount();
		let showLastEllipsis =
			context.count() - context.page() - (context.showLast() ? 1 : 0) > context.siblingCount();

		let previousSiblingCount = Math.min(context.page() - 1, context.siblingCount());
		let nextSiblingCount = Math.min(context.count() - context.page(), context.siblingCount());

		if (context.fixedItems() !== false) {
			// Untrack to avoid recursion
			const nextSiblingCountRef = nextSiblingCount;
			const previousSiblingCountRef = previousSiblingCount;
			// Add back the difference between the opposite side and the sibling count
			previousSiblingCount =
				previousSiblingCount + Math.max(context.siblingCount() - nextSiblingCountRef, 0);
			nextSiblingCount =
				nextSiblingCount + Math.max(context.siblingCount() - previousSiblingCountRef, 0);

			if (!showFirst) nextSiblingCount = nextSiblingCount + 1;
			if (!showLast) previousSiblingCount = previousSiblingCount + 1;

			// Check specifically if true and not "no-ellipsis"
			if (context.fixedItems() === true) {
				if (!showFirstEllipsis) nextSiblingCount = nextSiblingCount + 1;
				if (!showLastEllipsis) previousSiblingCount = previousSiblingCount + 1;
			}
		}

		return {
			showFirst,
			showLast,
			showFirstEllipsis,
			showLastEllipsis,
			previousSiblingCount,
			nextSiblingCount,
		};
	});

	return (
		<>
			<Show when={items().showFirst}>{context.renderItem(1)}</Show>

			<Show when={items().showFirstEllipsis}>{context.renderEllipsis()}</Show>

			<For each={[...Array(items().previousSiblingCount).keys()].reverse()}>
				{offset => <>{context.renderItem(context.page() - (offset + 1))}</>}
			</For>

			{context.renderItem(context.page())}

			<For each={[...Array(items().nextSiblingCount).keys()]}>
				{offset => <>{context.renderItem(context.page() + (offset + 1))}</>}
			</For>

			<Show when={items().showLastEllipsis}>{context.renderEllipsis()}</Show>

			<Show when={items().showLast}>{context.renderItem(context.count())}</Show>
		</>
	);
}
