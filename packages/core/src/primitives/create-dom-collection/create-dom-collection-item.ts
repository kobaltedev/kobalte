import { MaybeAccessor, mergeDefaultProps } from "@kobalte/utils";
import { createEffect, onCleanup } from "solid-js";

import { useDomCollectionContext } from "./dom-collection-context";
import { DomCollectionItem } from "./types";

export interface CreateDomCollectionItemProps<T extends DomCollectionItem = DomCollectionItem> {
  /** A function to map a data source item to a dom collection item. */
  getItem: () => T;

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

    const unregister = context.registerItem(props.getItem());

    onCleanup(unregister);
  });
}
