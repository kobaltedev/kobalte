import { Accessor } from "solid-js";

export interface CollectionDataSource<DataItem, DataSection> {
  /** The data to be managed by the collection. */
  data: Accessor<Array<DataItem | DataSection>>;

  /** A function to map a data item to a collection item. */
  getItem?: (dataItem: DataItem) => CollectionItem;

  /** A function to map a data section to a collection section. */
  getSection?: (dataSection: DataSection) => CollectionSection;
}

export interface CollectionItem {
  /** A unique key for the item. */
  id: string;

  /** A label for the item. */
  label: string;

  /**
   * A string value for the item, used for features like typeahead.
   * If not provided, the label will be used.
   */
  textValue?: string;

  /** Whether the item is disabled. */
  disabled?: boolean;
}

export interface CollectionSection {
  /** A unique key for the section. */
  id: string;

  /** A label for the section. */
  label: string;

  /** The items of the section. */
  items: Array<any>;
}

export interface CollectionNode {
  /** The type of item this node represents. */
  type: "item" | "section";

  /** The unique key for the node. */
  key: string;

  /** A label for the node. */
  label: string;

  /**
   * A string value for the item, used for features like typeahead.
   * If not provided, the label will be used.
   */
  textValue: string;

  /** Whether the node is disabled. */
  isDisabled: boolean;

  /** The level of depth this node is at in the hierarchy. */
  level: number;

  /** The index of this node within its parent. */
  index: number;

  /** The children of this node. */
  childNodes: Iterable<CollectionNode>;

  /** The key of the parent node. */
  parentKey?: string;

  /** The key of the node before this node. */
  prevKey?: string;

  /** The key of the node after this node. */
  nextKey?: string;
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
