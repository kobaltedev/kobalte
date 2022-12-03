import { Key } from "@kobalte/utils";
import { Accessor, JSX } from "solid-js";

import { CollectionNode } from "./types";

interface ForItemsProps<T> {
  /** The collection to loop on. */
  in: Iterable<CollectionNode<T>>;

  /** Render prop that receives an item and index signals and returns a JSX-Element. */
  children: (item: Accessor<CollectionNode<T>>, index: Accessor<number>) => JSX.Element;

  /** Fallback content to display when the collection is empty. */
  fallback?: JSX.Element;
}

/**
 * Creates a list of elements from the input `in` collection.
 * It takes a map function as its children that receives an item and index signals and returns a JSX-Element.
 * If the collection is empty, an optional fallback is returned.
 */
export function ForItems<T>(props: ForItemsProps<T>) {
  return (
    <Key each={[...props.in]} by="key" fallback={props.fallback}>
      {props.children}
    </Key>
  );
}
