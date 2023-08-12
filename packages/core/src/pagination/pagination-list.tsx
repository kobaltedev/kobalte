import { For, Show } from "solid-js";

import { usePaginationContext } from "./pagination-context";

export interface PaginationListProps {}

export function PaginationList(props: PaginationListProps) {
  const context = usePaginationContext();

  return (
    <>
      <Show when={context.showFirst() && context.page() - 1 > context.siblingCount()}>
        {context.renderItem(1)}
      </Show>

      <Show when={context.page() - (context.showFirst() ? 2 : 1) > context.siblingCount()}>
        {context.renderEllipsis()}
      </Show>

      <For each={[...Array(Math.min(context.page() - 1, context.siblingCount())).keys()].reverse()}>
        {offset => <>{context.renderItem(context.page() - (offset + 1))}</>}
      </For>

      {context.renderItem(context.page())}

      <For
        each={[...Array(Math.min(context.count() - context.page(), context.siblingCount())).keys()]}
      >
        {offset => <>{context.renderItem(context.page() + (offset + 1))}</>}
      </For>

      <Show
        when={
          context.count() - context.page() - (context.showLast() ? 1 : 0) > context.siblingCount()
        }
      >
        {context.renderEllipsis()}
      </Show>

      <Show when={context.showLast() && context.count() - context.page() > context.siblingCount()}>
        {context.renderItem(context.count())}
      </Show>
    </>
  );
}
