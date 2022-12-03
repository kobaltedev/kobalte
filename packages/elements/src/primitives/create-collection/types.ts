import { MaybeAccessor } from "@kobalte/utils";

export interface CollectionItem<ItemSource> {
  /** The unique key for the item. */
  key: string;

  /** The raw object value the item was created from. */
  rawValue: ItemSource;

  /** A string value for the item, used for features like typeahead. */
  textValue: string;
}

export interface CollectionSection<SectionSource, ItemSource> {
  /** The unique key for the section. */
  key: string;

  /** A list of child item objects. */
  items: Array<SectionSource | ItemSource>;

  /** The raw object value the section was created from. */
  rawValue: SectionSource;
}

export interface CollectionBase<SectionSource, ItemSource> {
  /** The data source to be managed by the collection. */
  dataSource: MaybeAccessor<Array<SectionSource | ItemSource>>;

  /** A function to map a data source item to a collection item. */
  getItem: (source: ItemSource) => CollectionItem<ItemSource>;

  /** A function to map a data source section to a collection section. */
  getSection?: (source: SectionSource) => CollectionSection<SectionSource, ItemSource>;

  /**
   * The item keys that are disabled.
   * These items cannot be selected, focused, or otherwise interacted with.
   */
  disabledKeys?: MaybeAccessor<Iterable<string> | undefined>;
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

export interface CollectionNode<T> {
  /** The type of item this node represents. */
  type: "item" | "section";

  /** The unique key for the node. */
  key: string;

  /** The raw object value the node was created from. */
  rawValue: T;

  /** The level of depth this node is at in the hierarchy. */
  level: number;

  /** A string value for this node, used for features like typeahead. */
  textValue: string;

  /** The function to render the contents of this node (e.g. JSX). */
  //render: () => JSX.Element;

  /** The index of this node within its parent. */
  index?: number;

  /** The key of the parent node. */
  parentKey?: string;

  /** The key of the node before this node. */
  prevKey?: string;

  /** The key of the node after this node. */
  nextKey?: string;
}
