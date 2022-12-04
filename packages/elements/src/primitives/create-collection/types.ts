import { MaybeAccessor } from "@kobalte/utils";

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

export interface CollectionNode {
  /** The unique key for the node. */
  key: string;

  /** A string value for this node, used for features like typeahead. */
  textValue: string;

  /** Whether the node is disabled. */
  isDisabled: boolean;

  /** The index of this node within its parent. */
  index?: number;

  /** The key of the node before this node. */
  prevKey?: string;

  /** The key of the node after this node. */
  nextKey?: string;
}

export interface CollectionBase {
  /** The data source to be managed by the collection. */
  dataSource: MaybeAccessor<Array<any>>;

  /** A function to map a data source item to a collection node. */
  getNode: (source: any) => CollectionNode;
}
