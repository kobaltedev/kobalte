import { For, Show, createMemo } from "solid-js";

import { usePaginationContext } from "./pagination-context";

export interface PaginationItemsProps {}

export function PaginationItems(props: PaginationItemsProps) {
	const context = usePaginationContext();

	const items = createMemo(() => {
		const { count, siblingCount, page, fixedItems, showFirst, showLast } =
			context;
		// render directly if count is so small that it does not make sense to render an ellipsis
		// this is the case for if count is lower than 2x siblings + 6 for fixedItems and +4 if not fixed items
		const renderItemsDirectly =
			count() < 2 * siblingCount() + (fixedItems() ? 6 : 4);

		//skip the rest of the computation if we can render directly
		if (renderItemsDirectly)
			return {
				renderItemsDirectly,
			};

		const _showFirst = showFirst() && page() - 1 > siblingCount();
		const _showLast = showLast() && count() - page() > siblingCount();

		let showFirstEllipsis = page() - (showFirst() ? 2 : 1) > siblingCount();
		let showLastEllipsis =
			count() - page() - (showLast() ? 1 : 0) > siblingCount();

		let previousSiblingCount = Math.min(page() - 1, siblingCount());
		let nextSiblingCount = Math.min(count() - page(), siblingCount());

		if (fixedItems() !== false) {
			// ref to avoid wrong corretions
			const previousSiblingCountRef = previousSiblingCount;
			const nextSiblingCountRef = nextSiblingCount;

			// Add back the difference between the opposite side and the sibling count
			previousSiblingCount += Math.max(siblingCount() - nextSiblingCountRef, 0);
			nextSiblingCount += Math.max(siblingCount() - previousSiblingCountRef, 0);

			if (!_showFirst) nextSiblingCount++;
			if (!_showLast) previousSiblingCount++;

			// Check specifically if true and not "no-ellipsis"
			if (fixedItems() === true) {
				if (!showFirstEllipsis) nextSiblingCount++;
				if (!showLastEllipsis) previousSiblingCount++;
			}

			//replace ellipsis if it would replace only one item
			if (page() - previousSiblingCount - (showFirst() ? 2 : 1) === 1) {
				showFirstEllipsis = false;
				previousSiblingCount++;
			}
			if (count() - page() - nextSiblingCount - (showLast() ? 1 : 0) === 1) {
				showLastEllipsis = false;
				nextSiblingCount++;
			}
		}

		return {
			showFirst: _showFirst,
			showLast: _showLast,
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
				fallback={
					<>
						<Show when={items().showFirst}>{context.renderItem(1)}</Show>

						<Show when={items().showFirstEllipsis}>
							{context.renderEllipsis()}
						</Show>

						<For
							each={[...Array(items().previousSiblingCount).keys()].reverse()}
						>
							{(offset) => (
								<>{context.renderItem(context.page() - (offset + 1))}</>
							)}
						</For>

						{context.renderItem(context.page())}

						<For each={[...Array(items().nextSiblingCount).keys()]}>
							{(offset) => (
								<>{context.renderItem(context.page() + (offset + 1))}</>
							)}
						</For>

						<Show when={items().showLastEllipsis}>
							{context.renderEllipsis()}
						</Show>

						<Show when={items().showLast}>
							{context.renderItem(context.count())}
						</Show>
					</>
				}
			>
				<For each={[...Array(context.count()).keys()]}>
					{(page) => <>{context.renderItem(page + 1)}</>}
				</For>
			</Show>
		</>
	);
}
