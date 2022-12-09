import { MaybeAccessor } from "@kobalte/utils";

export type CollectionKey = string | number;

export interface CollectionItem {
  /** A unique key for the item. */
  key: CollectionKey;

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
  key: CollectionKey;

  /** A label for the section. */
  label: string;

  /** The children items of the section. */
  items: Array<any>;
}

export interface CollectionNode {
  /** The type of item this node represents. */
  type: "item" | "section";

  /** The unique key for the node. */
  key: CollectionKey;

  /** The source object this node was created from. */
  rawValue: any;

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
  parentKey?: CollectionKey;

  /** The key of the node before this node. */
  prevKey?: CollectionKey;

  /** The key of the node after this node. */
  nextKey?: CollectionKey;
}

export type CollectionItemPropertyNames = Record<keyof CollectionItem, string>;
export type CollectionSectionPropertyNames = Record<keyof CollectionSection, string>;

export interface CollectionBase {
  /** The source data to be managed by the collection. */
  dataSource: MaybeAccessor<Array<any>>;

  /** Custom property names used to map an object to a collection item. */
  itemPropertyNames?: MaybeAccessor<Partial<CollectionItemPropertyNames> | undefined>;

  /** Custom property names used to map an object to a collection section. */
  sectionPropertyNames?: MaybeAccessor<Partial<CollectionSectionPropertyNames> | undefined>;
}

/**
 * A generic interface to access a readonly sequential
 * collection of unique keyed items.
 */
export interface Collection<T> extends Iterable<T> {
  /** The number of items in the collection. */
  getSize: () => number;

  /** Iterate over all keys in the collection. */
  getKeys: () => Iterable<CollectionKey>;

  /** Get an item by its key. */
  getItem: (key: CollectionKey) => T | undefined;

  /** Get an item by the index of its key. */
  at: (idx: number) => T | undefined;

  /** Get the key that comes before the given key in the collection. */
  getKeyBefore: (key: CollectionKey) => CollectionKey | undefined;

  /** Get the key that comes after the given key in the collection. */
  getKeyAfter: (key: CollectionKey) => CollectionKey | undefined;

  /** Get the first key in the collection. */
  getFirstKey: () => CollectionKey | undefined;

  /** Get the last key in the collection. */
  getLastKey: () => CollectionKey | undefined;
}
