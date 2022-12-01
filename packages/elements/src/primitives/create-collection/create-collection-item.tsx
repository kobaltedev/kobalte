import { MaybeAccessor, mergeDefaultProps } from "@kobalte/utils";
import { Accessor, createEffect, onCleanup } from "solid-js";

import { useCollectionContext } from "./collection-context";
import { CollectionItem } from "./types";

export interface CreateCollectionItemProps<T extends CollectionItem = CollectionItem> {
  /** A ref for the element in the collection. */
  ref: Accessor<Element | undefined>;

  /**
   * A function that returns props that will be passed along with the
   * item when it gets registered to the collection.
   */
  getItem: (item: CollectionItem) => T;

  /** Whether the item should be registered to the state. */
  shouldRegisterItem?: MaybeAccessor<boolean | undefined>;
}

export function createCollectionItem<T extends CollectionItem = CollectionItem>(
  props: CreateCollectionItemProps<T>
) {
  const context = useCollectionContext<T>();

  props = mergeDefaultProps({ shouldRegisterItem: true }, props);

  createEffect(() => {
    if (!props.shouldRegisterItem) {
      return;
    }

    const item = props.getItem({ ref: props.ref });

    const unregister = context.registerItem(item);

    onCleanup(unregister);
  });
}
