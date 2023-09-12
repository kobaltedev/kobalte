import { For, Show, createEffect, createSignal, batch, untrack } from "solid-js";

import { usePaginationContext } from "./pagination-context";

export interface PaginationItemsProps {}

export function PaginationItems(props: PaginationItemsProps) {
  const context = usePaginationContext();

  const [showFirst, setShowFirst] = createSignal(false);
  const [showLast, setShowLast] = createSignal(false);

  const [showFirstEllipsis, setShowFirstEllipsis] = createSignal(false);
  const [showLastEllipsis, setShowLastEllipsis] = createSignal(false);

  const [previousSiblingCount, setPreviousSiblingCount] = createSignal(0);
  const [nextSiblingCount, setNextSiblingCount] = createSignal(0);

  createEffect(() => {
    batch(() => {
      setShowFirst(context.showFirst() && context.page() - 1 > context.siblingCount());
      setShowLast(context.showLast() && context.count() - context.page() > context.siblingCount());

      setShowFirstEllipsis(context.page() - (context.showFirst() ? 2 : 1) > context.siblingCount());
      setShowLastEllipsis(
        context.count() - context.page() - (context.showLast() ? 1 : 0) > context.siblingCount(),
      );

      setPreviousSiblingCount(Math.min(context.page() - 1, context.siblingCount()));
      setNextSiblingCount(Math.min(context.count() - context.page(), context.siblingCount()));

      if (context.fixedItems() !== false) {
        // Untrack to avoid recursion
        untrack(() => {
          // Add back the difference between the opposite side and the sibling count
          setPreviousSiblingCount(
            prev => prev + Math.max(context.siblingCount() - nextSiblingCount(), 0),
          );
          setNextSiblingCount(
            prev => prev + Math.max(context.siblingCount() - previousSiblingCount(), 0),
          );
        });

        if (!showFirst()) setNextSiblingCount(prev => prev + 1);
        if (!showLast()) setPreviousSiblingCount(prev => prev + 1);

        // Check specifically if true and not "no-ellipsis"
        if (context.fixedItems() === true) {
          if (!showFirstEllipsis()) setNextSiblingCount(prev => prev + 1);
          if (!showLastEllipsis()) setPreviousSiblingCount(prev => prev + 1);
        }
      }
    });
  });

  return (
    <>
      <Show when={showFirst()}>{context.renderItem(1)}</Show>

      <Show when={showFirstEllipsis()}>{context.renderEllipsis()}</Show>

      <For each={[...Array(previousSiblingCount()).keys()].reverse()}>
        {offset => <>{context.renderItem(context.page() - (offset + 1))}</>}
      </For>

      {context.renderItem(context.page())}

      <For each={[...Array(nextSiblingCount()).keys()]}>
        {offset => <>{context.renderItem(context.page() + (offset + 1))}</>}
      </For>

      <Show when={showLastEllipsis()}>{context.renderEllipsis()}</Show>

      <Show when={showLast()}>{context.renderItem(context.count())}</Show>
    </>
  );
}
