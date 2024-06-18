/*
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/bfce84fee12a027d9cbc38b43e1747e3e4b4b169/packages/@react-stately/selection/src/SelectionManager.ts
 */

import type { Accessor } from "solid-js";

import type { Collection, CollectionNode } from "../primitives";
import {
	type MultipleSelectionManager,
	type MultipleSelectionState,
	Selection,
	type SelectionBehavior,
	type SelectionMode,
} from "./types";

/**
 * An interface for reading and updating multiple selection state.
 */
export class SelectionManager implements MultipleSelectionManager {
	private collection: Accessor<Collection<CollectionNode>>;
	private state: MultipleSelectionState;

	constructor(
		collection: Accessor<Collection<CollectionNode>>,
		state: MultipleSelectionState,
	) {
		this.collection = collection;
		this.state = state;
	}

	/** The type of selection that is allowed in the collection. */
	selectionMode(): SelectionMode {
		return this.state.selectionMode();
	}

	/** Whether the collection allows empty selection. */
	disallowEmptySelection(): boolean {
		return this.state.disallowEmptySelection();
	}

	/** The selection behavior for the collection. */
	selectionBehavior(): SelectionBehavior {
		return this.state.selectionBehavior();
	}

	/** Sets the selection behavior for the collection. */
	setSelectionBehavior(selectionBehavior: SelectionBehavior) {
		this.state.setSelectionBehavior(selectionBehavior);
	}

	/** Whether the collection is currently focused. */
	isFocused(): boolean {
		return this.state.isFocused();
	}

	/** Sets whether the collection is focused. */
	setFocused(isFocused: boolean) {
		this.state.setFocused(isFocused);
	}

	/** The current focused key in the collection. */
	focusedKey(): string | undefined {
		return this.state.focusedKey();
	}

	/** Sets the focused key. */
	setFocusedKey(key?: string) {
		if (key == null || this.collection().getItem(key)) {
			this.state.setFocusedKey(key);
		}
	}

	/** The currently selected keys in the collection. */
	selectedKeys(): Set<string> {
		return this.state.selectedKeys();
	}

	/** Returns whether a key is selected. */
	isSelected(key: string) {
		if (this.state.selectionMode() === "none") {
			return false;
		}

		const retrievedKey = this.getKey(key);

		if (retrievedKey == null) {
			return false;
		}

		return this.state.selectedKeys().has(retrievedKey);
	}

	/** Whether the selection is empty. */
	isEmpty(): boolean {
		return this.state.selectedKeys().size === 0;
	}

	/** Whether all items in the collection are selected. */
	isSelectAll(): boolean {
		if (this.isEmpty()) {
			return false;
		}

		const selectedKeys = this.state.selectedKeys();

		return this.getAllSelectableKeys().every((k) => selectedKeys.has(k));
	}

	firstSelectedKey(): string | undefined {
		let first: CollectionNode | undefined;

		for (const key of this.state.selectedKeys()) {
			const item = this.collection().getItem(key);

			const isItemBeforeFirst =
				item?.index != null && first?.index != null && item.index < first.index;

			if (!first || isItemBeforeFirst) {
				first = item;
			}
		}

		return first?.key;
	}

	lastSelectedKey(): string | undefined {
		let last: CollectionNode | undefined;

		for (const key of this.state.selectedKeys()) {
			const item = this.collection().getItem(key);

			const isItemAfterLast =
				item?.index != null && last?.index != null && item.index > last.index;

			if (!last || isItemAfterLast) {
				last = item;
			}
		}

		return last?.key;
	}

	/** Extends the selection to the given key. */
	extendSelection(toKey: string) {
		if (this.selectionMode() === "none") {
			return;
		}

		if (this.selectionMode() === "single") {
			this.replaceSelection(toKey);
			return;
		}

		const retrievedToKey = this.getKey(toKey);

		if (retrievedToKey == null) {
			return;
		}

		const selectedKeys = this.state.selectedKeys() as Selection;
		const anchorKey = selectedKeys.anchorKey || retrievedToKey;

		const selection = new Selection(selectedKeys, anchorKey, retrievedToKey);

		for (const key of this.getKeyRange(
			anchorKey,
			selectedKeys.currentKey || retrievedToKey,
		)) {
			selection.delete(key);
		}

		for (const key of this.getKeyRange(retrievedToKey, anchorKey)) {
			if (this.canSelectItem(key)) {
				selection.add(key);
			}
		}

		this.state.setSelectedKeys(selection);
	}

	private getKeyRange(from: string, to: string) {
		const fromItem = this.collection().getItem(from);
		const toItem = this.collection().getItem(to);

		if (fromItem && toItem) {
			if (
				fromItem.index != null &&
				toItem.index != null &&
				fromItem.index <= toItem.index
			) {
				return this.getKeyRangeInternal(from, to);
			}

			return this.getKeyRangeInternal(to, from);
		}

		return [];
	}

	private getKeyRangeInternal(from: string, to: string) {
		const keys: string[] = [];
		let key: string | undefined = from;

		while (key != null) {
			const item = this.collection().getItem(key);

			if (item && item.type === "item") {
				keys.push(key);
			}

			if (key === to) {
				return keys;
			}

			key = this.collection().getKeyAfter(key);
		}

		return [];
	}

	private getKey(key: string) {
		const item = this.collection().getItem(key);

		if (!item) {
			return key;
		}

		if (!item || item.type !== "item") {
			return null;
		}

		return item.key;
	}

	/** Toggles whether the given key is selected. */
	toggleSelection(key: string) {
		if (this.selectionMode() === "none") {
			return;
		}

		if (this.selectionMode() === "single" && !this.isSelected(key)) {
			this.replaceSelection(key);
			return;
		}

		const retrievedKey = this.getKey(key);

		if (retrievedKey == null) {
			return;
		}

		const keys = new Selection(this.state.selectedKeys());

		if (keys.has(retrievedKey)) {
			keys.delete(retrievedKey);
		} else if (this.canSelectItem(retrievedKey)) {
			keys.add(retrievedKey);
			keys.anchorKey = retrievedKey;
			keys.currentKey = retrievedKey;
		}

		if (this.disallowEmptySelection() && keys.size === 0) {
			return;
		}

		this.state.setSelectedKeys(keys);
	}

	/** Replaces the selection with only the given key. */
	replaceSelection(key: string) {
		if (this.selectionMode() === "none") {
			return;
		}

		const retrievedKey = this.getKey(key);

		if (retrievedKey == null) {
			return;
		}

		const selection = this.canSelectItem(retrievedKey)
			? new Selection([retrievedKey], retrievedKey, retrievedKey)
			: new Selection();

		this.state.setSelectedKeys(selection);
	}

	/** Replaces the selection with the given keys. */
	setSelectedKeys(keys: Iterable<string>) {
		if (this.selectionMode() === "none") {
			return;
		}

		const selection = new Selection();

		for (const key of keys) {
			const retrievedKey = this.getKey(key);

			if (retrievedKey != null) {
				selection.add(retrievedKey);

				if (this.selectionMode() === "single") {
					break;
				}
			}
		}

		this.state.setSelectedKeys(selection);
	}

	/** Selects all items in the collection. */
	selectAll() {
		if (this.selectionMode() === "multiple") {
			this.state.setSelectedKeys(new Set(this.getAllSelectableKeys()));
		}
	}

	/**
	 * Removes all keys from the selection.
	 */
	clearSelection() {
		const selectedKeys = this.state.selectedKeys();

		if (!this.disallowEmptySelection() && selectedKeys.size > 0) {
			this.state.setSelectedKeys(new Selection());
		}
	}

	/**
	 * Toggles between select all and an empty selection.
	 */
	toggleSelectAll() {
		if (this.isSelectAll()) {
			this.clearSelection();
		} else {
			this.selectAll();
		}
	}

	select(key: string, e?: PointerEvent) {
		if (this.selectionMode() === "none") {
			return;
		}

		if (this.selectionMode() === "single") {
			if (this.isSelected(key) && !this.disallowEmptySelection()) {
				this.toggleSelection(key);
			} else {
				this.replaceSelection(key);
			}
		} else if (
			this.selectionBehavior() === "toggle" ||
			(e && e.pointerType === "touch")
		) {
			// if touch then we just want to toggle, otherwise it's impossible to multi select because they don't have modifier keys
			this.toggleSelection(key);
		} else {
			this.replaceSelection(key);
		}
	}

	/** Returns whether the current selection is equal to the given selection. */
	isSelectionEqual(selection: Set<string>) {
		if (selection === this.state.selectedKeys()) {
			return true;
		}

		// Check if the set of keys match.
		const selectedKeys = this.selectedKeys();
		if (selection.size !== selectedKeys.size) {
			return false;
		}

		for (const key of selection) {
			if (!selectedKeys.has(key)) {
				return false;
			}
		}

		for (const key of selectedKeys) {
			if (!selection.has(key)) {
				return false;
			}
		}

		return true;
	}

	canSelectItem(key: string) {
		if (this.state.selectionMode() === "none") {
			return false;
		}

		const item = this.collection().getItem(key);

		return item != null && !item.disabled;
	}

	isDisabled(key: string) {
		const item = this.collection().getItem(key);

		return !item || item.disabled;
	}

	private getAllSelectableKeys() {
		const keys: string[] = [];

		const addKeys = (key: string | undefined) => {
			while (key != null) {
				if (this.canSelectItem(key)) {
					const item = this.collection().getItem(key);

					if (!item) {
						continue;
					}

					if (item.type === "item") {
						keys.push(key);
					}
				}

				// biome-ignore lint/style/noParameterAssign: used in loop
				key = this.collection().getKeyAfter(key);
			}
		};

		addKeys(this.collection().getFirstKey());

		return keys;
	}
}
