import { MaybeAccessor } from "@kobalte/utils";

import { DomCollectionItem } from "../create-dom-collection";

export interface CollectionItem extends DomCollectionItem {
  /** A unique key for the item. */
  key: string;

  /** A label for the item. */
  label: string;

  /** A string value for the item, used for features like typeahead. */
  textValue: string;

  /** Whether the item is disabled. */
  isDisabled: boolean;
}

export interface CollectionNode {
  /** A unique key for the node. */
  key: string;

  /** A label for the node. */
  label: string;

  /** A string value for the node, used for features like typeahead. */
  textValue: string;

  /** Whether the node is disabled. */
  isDisabled: boolean;

  /** The index of this node within its parent. */
  index: number;

  /** The key of the node before this node. */
  prevKey?: string;

  /** The key of the node after this node. */
  nextKey?: string;
}

export interface CollectionBase {
  /** The source data to be managed by the collection. */
  dataSource: MaybeAccessor<Array<any>>;
}

/**
 * A generic interface to access a readonly sequential
 * collection of unique keyed items.
 */
export interface Collection<T> extends Iterable<T> {
  /** The number of items in the collection. */
  getSize: () => number;

  /** Iterate over all keys in the collection. */
  getKeys: () => Iterable<string>;

  /** Get an item by its key. */
  getItem: (key: string) => T | undefined;

  /** Get an item by the index of its key. */
  at: (idx: number) => T | undefined;

  /** Get the key that comes before the given key in the collection. */
  getKeyBefore: (key: string) => string | undefined;

  /** Get the key that comes after the given key in the collection. */
  getKeyAfter: (key: string) => string | undefined;

  /** Get the first key in the collection. */
  getFirstKey: () => string | undefined;

  /** Get the last key in the collection. */
  getLastKey: () => string | undefined;
}
