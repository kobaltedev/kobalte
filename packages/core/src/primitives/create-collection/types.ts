import type { MaybeAccessor } from "@kobalte/utils";

import type { DomCollectionItem } from "../create-dom-collection";

export interface CollectionItem {
	/** The type of the item. */
	type: "item" | "section";

	/** A unique key for the item. */
	key: string;

	/** A string value for the item, used for features like typeahead. */
	textValue: string;

	/** Whether the item is disabled. */
	disabled: boolean;
}

export interface CollectionItemWithRef
	extends CollectionItem,
		DomCollectionItem {}

export interface CollectionNode<T = any> {
	/** The type of item this node represents. */
	type: "item" | "section";

	/** A unique key for the node. */
	key: string;

	/** The source object this node was created from. */
	rawValue: T;

	/** A string value for the node, used for features like typeahead. */
	textValue: string;

	/** Whether the node is disabled. */
	disabled: boolean;

	/** The level of depth this node is at in the hierarchy. */
	level: number;

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

	/** Property name or getter function to use as the key of an item. */
	getKey?: MaybeAccessor<string | ((data: any) => string) | undefined>;

	/** Property name or getter function to use as the text value of an item for typeahead purpose. */
	getTextValue?: MaybeAccessor<string | ((data: any) => string) | undefined>;

	/** Property name or getter function to use as the disabled flag of an item. */
	getDisabled?: MaybeAccessor<string | ((data: any) => boolean) | undefined>;

	/** Property name or getter function that refers to the children items of a section. */
	getSectionChildren?: MaybeAccessor<
		string | ((section: any) => any[]) | undefined
	>;
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
