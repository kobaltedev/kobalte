import { MaybeAccessor, mergeDefaultProps } from "@kobalte/utils";
import { Accessor, createEffect, onCleanup } from "solid-js";

import { useDomCollectionContext } from "./dom-collection-context";
import { DomCollectionItem } from "./types";

export interface CreateDomCollectionItemProps<T extends DomCollectionItem = DomCollectionItem> {
  /** A ref for the element in the collection. */
  ref: Accessor<Element | undefined>;

  /**
   * A function that returns props that will be passed along with the
   * item when it gets registered to the collection.
   */
  getItem: (item: DomCollectionItem) => T;

  /** Whether the item should be registered to the state. */
  shouldRegisterItem?: MaybeAccessor<boolean | undefined>;
}

export function createDomCollectionItem<T extends DomCollectionItem = DomCollectionItem>(
  props: CreateDomCollectionItemProps<T>
) {
  const context = useDomCollectionContext<T>();

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
