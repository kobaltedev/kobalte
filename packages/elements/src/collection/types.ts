export interface CollectionItem<T> {
  /** The unique key for the item. */
  key: string;

  /**
   * The raw object value the item was created from.
   * Useful for passing additional data when rendering the item.
   */
  rawValue: T;

  /** A string value for the item, used for features like typeahead. */
  textValue?: string;

  /** Whether the item is disabled. */
  isDisabled?: boolean;
}

export interface CollectionSection<T, U> {
  /** The unique key for the item. */
  key: string;

  /**
   * The raw object value the item was created from.
   * Useful for passing additional data when rendering the item.
   */
  rawValue: T;

  /** A list of child item objects. */
  items: Array<T | U>;
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

  /** The function to render the contents of this node (e.g. JSX). */
  //render: () => JSX.Element;

  /** A string value for this node, used for features like typeahead. */
  textValue?: string;

  /** The index of this node within its parent. */
  index?: number;

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
