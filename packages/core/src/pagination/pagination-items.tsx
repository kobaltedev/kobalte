import { For, Show, createMemo } from "solid-js";

import { usePaginationContext } from "./pagination-context";

export interface PaginationItemsProps {}

export function PaginationItems(props: PaginationItemsProps) {
	const context = usePaginationContext();

	const items = createMemo(() => {
		const { count, siblingCount, page, fixedItems } = context;
		// render directly if count is so small that it does not make sense to render an ellipsis
		// this is the case for if count is even -> 8, count is odd -> 7, each plus 2x siblingsCount
		const renderItemsDirectly = context.fixedItems()
			? count() < 2 * siblingCount() + 6
			: count() < 2 * siblingCount() + 4; //(count() % 2 === 0 ? 6 : 5);

		//skip the rest of the computation if we can render directly
		if (renderItemsDirectly)
			return {
				renderItemsDirectly,
			};

		let showFirst = context.showFirst() && page() - 1 > siblingCount();
		let showLast = context.showLast() && count() - page() > siblingCount();

		let showFirstEllipsis = page() - (context.showFirst() ? 2 : 1) > siblingCount();
		let showLastEllipsis = count() - page() - (context.showLast() ? 1 : 0) > siblingCount();

		let previousSiblingCount = Math.min(page() - 1, siblingCount());
		let nextSiblingCount = Math.min(count() - page(), siblingCount());

		if (fixedItems() !== false && !renderItemsDirectly) {
			// ref to avoid wrong corretions
			const nextSiblingCountRef = nextSiblingCount;
			const previousSiblingCountRef = previousSiblingCount;

			// Add back the difference between the opposite side and the sibling count
			previousSiblingCount =
				previousSiblingCount + Math.max(siblingCount() - nextSiblingCountRef, 0);
			nextSiblingCount = nextSiblingCount + Math.max(siblingCount() - previousSiblingCountRef, 0);

			if (!showFirst) nextSiblingCount++;
			if (!showLast) previousSiblingCount++;

			// Check specifically if true and not "no-ellipsis"
			if (fixedItems() === true) {
				if (!showFirstEllipsis) nextSiblingCount++;
				if (!showLastEllipsis) previousSiblingCount++;
			}
		}

		return {
			showFirst,
			showLast,
			showFirstEllipsis,
			showLastEllipsis,
			previousSiblingCount,
			nextSiblingCount,
			renderItemsDirectly,
		};
	});

	return (
		<>
			<Show
				when={items().renderItemsDirectly}
				children={
					<For each={[...Array(context.count()).keys()]}>
						{page => <>{context.renderItem(page + 1)}</>}
					</For>
				}
				fallback={
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
				}
			/>
		</>
	);
}
