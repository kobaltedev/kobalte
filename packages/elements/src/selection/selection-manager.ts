/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/bfce84fee12a027d9cbc38b43e1747e3e4b4b169/packages/@react-stately/selection/src/SelectionManager.ts
 */

import { Accessor } from "solid-js";

import { Collection, CollectionKey, CollectionNode, PressEvent } from "../primitives";
import { LongPressEvent } from "../primitives/create-long-press/types";
import {
  FocusStrategy,
  MultipleSelectionManager,
  MultipleSelectionState,
  Selection,
  SelectionBehavior,
  SelectionMode,
  SelectionType,
} from "./types";

/**
 * An interface for reading and updating multiple selection state.
 */
export class SelectionManager implements MultipleSelectionManager {
  private collection: Accessor<Collection<CollectionNode>>;
  private state: MultipleSelectionState;

  constructor(collection: Accessor<Collection<CollectionNode>>, state: MultipleSelectionState) {
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
  focusedKey(): CollectionKey | undefined {
    return this.state.focusedKey();
  }

  /** Whether the first or last child of the focused key should receive focus. */
  childFocusStrategy(): FocusStrategy {
    return this.state.childFocusStrategy();
  }

  /** Sets the focused key. */
  setFocusedKey(key?: CollectionKey, childFocusStrategy?: FocusStrategy) {
    if (key == null || this.collection().getItem(key)) {
      this.state.setFocusedKey(key, childFocusStrategy);
    }
  }

  /** The currently selected keys in the collection. */
  selectedKeys(): Set<CollectionKey> {
    const selectedKeys = this.state.selectedKeys();

    return selectedKeys === "all" ? new Set(this.getSelectAllKeys()) : selectedKeys;
  }

  /**
   * The raw selection value for the collection.
   * Either 'all' for select all, or a set of keys.
   */
  rawSelection(): SelectionType {
    return this.state.selectedKeys();
  }

  /** Returns whether a key is selected. */
  isSelected(key: CollectionKey) {
    if (this.state.selectionMode() === "none") {
      return false;
    }

    const retrievedKey = this.getKey(key);

    if (retrievedKey == null) {
      return false;
    }

    const selectedKeys = this.state.selectedKeys();

    return selectedKeys === "all"
      ? this.canSelectItem(retrievedKey)
      : selectedKeys.has(retrievedKey);
  }

  /** Whether the selection is empty. */
  isEmpty(): boolean {
    const selectedKeys = this.state.selectedKeys();
    return selectedKeys !== "all" && selectedKeys.size === 0;
  }

  /** Whether all items in the collection are selected. */
  isSelectAll(): boolean {
    if (this.isEmpty()) {
      return false;
    }

    const selectedKeys = this.state.selectedKeys();

    if (selectedKeys === "all") {
      return true;
    }

    return this.getSelectAllKeys().every(k => selectedKeys.has(k));
  }

  firstSelectedKey(): CollectionKey | undefined {
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

  lastSelectedKey(): CollectionKey | undefined {
    let last: CollectionNode | undefined;

    for (const key of this.state.selectedKeys()) {
      const item = this.collection().getItem(key);

      const isItemAfterLast = item?.index != null && last?.index != null && item.index > last.index;

      if (!last || isItemAfterLast) {
        last = item;
      }
    }

    return last?.key;
  }

  /** Extends the selection to the given key. */
  extendSelection(toKey: CollectionKey) {
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

    let selection: Selection;

    // Only select the one key if coming from a select all.
    if (this.state.selectedKeys() === "all") {
      selection = new Selection([retrievedToKey], retrievedToKey, retrievedToKey);
    } else {
      const selectedKeys = this.state.selectedKeys() as Selection;
      const anchorKey = selectedKeys.anchorKey || retrievedToKey;

      selection = new Selection(selectedKeys, anchorKey, retrievedToKey);

      for (const key of this.getKeyRange(anchorKey, selectedKeys.currentKey || retrievedToKey)) {
        selection.delete(key);
      }

      for (const key of this.getKeyRange(retrievedToKey, anchorKey)) {
        if (this.canSelectItem(key)) {
          selection.add(key);
        }
      }
    }

    this.state.setSelectedKeys(selection);
  }

  private getKeyRange(from: CollectionKey, to: CollectionKey) {
    const fromItem = this.collection().getItem(from);
    const toItem = this.collection().getItem(to);

    if (fromItem && toItem) {
      if (fromItem.index != null && toItem.index != null && fromItem.index <= toItem.index) {
        return this.getKeyRangeInternal(from, to);
      }

      return this.getKeyRangeInternal(to, from);
    }

    return [];
  }

  private getKeyRangeInternal(from: CollectionKey, to: CollectionKey) {
    const keys: CollectionKey[] = [];
    let key: CollectionKey | undefined = from;

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

  private getKey(key: CollectionKey) {
    let item = this.collection().getItem(key);

    if (!item) {
      return key;
    }

    // Find a parent item to select
    while (item && item.type !== "item" && item.parentKey != null) {
      item = this.collection().getItem(item.parentKey);
    }

    if (!item || item.type !== "item") {
      return null;
    }

    return item.key;
  }

  /** Toggles whether the given key is selected. */
  toggleSelection(key: CollectionKey) {
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

    const selectedKeys = this.state.selectedKeys();

    const keys = new Selection(selectedKeys === "all" ? this.getSelectAllKeys() : selectedKeys);

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
  replaceSelection(key: CollectionKey) {
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
  setSelectedKeys(keys: Iterable<CollectionKey>) {
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

  private getSelectAllKeys() {
    const keys: CollectionKey[] = [];
    const addKeys = (key: CollectionKey | undefined) => {
      while (key != null) {
        if (this.canSelectItem(key)) {
          const item = this.collection().getItem(key);

          if (!item) {
            continue;
          }

          if (item.type === "item") {
            keys.push(key);
          }

          // Add child keys.
          const childNodes = [...item.childNodes];
          if (childNodes.length > 0) {
            addKeys(childNodes[0].key);
          }
        }

        key = this.collection().getKeyAfter(key);
      }
    };

    addKeys(this.collection().getFirstKey());
    return keys;
  }

  /** Selects all items in the collection. */
  selectAll() {
    if (this.selectionMode() === "multiple") {
      this.state.setSelectedKeys("all");
    }
  }

  /**
   * Removes all keys from the selection.
   */
  clearSelection() {
    const selectedKeys = this.state.selectedKeys();

    if (!this.disallowEmptySelection && (selectedKeys === "all" || selectedKeys.size > 0)) {
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

  select(key: CollectionKey, e?: PressEvent | LongPressEvent | PointerEvent) {
    if (this.selectionMode() === "none") {
      return;
    }

    if (this.selectionMode() === "single") {
      if (this.isSelected(key) && !this.disallowEmptySelection) {
        this.toggleSelection(key);
      } else {
        this.replaceSelection(key);
      }
    } else if (
      this.selectionBehavior() === "toggle" ||
      (e && (e.pointerType === "touch" || e.pointerType === "virtual"))
    ) {
      // if touch or virtual then we just want to toggle, otherwise it's impossible to multi select because they don't have modifier keys
      this.toggleSelection(key);
    } else {
      this.replaceSelection(key);
    }
  }

  /** Returns whether the current selection is equal to the given selection. */
  isSelectionEqual(selection: Set<CollectionKey>) {
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

  canSelectItem(key: CollectionKey) {
    if (this.state.selectionMode() === "none") {
      return false;
    }

    const item = this.collection().getItem(key);

    return item != null && !item.isDisabled;
  }

  isDisabled(key: CollectionKey) {
    const item = this.collection().getItem(key);

    return !item || item.isDisabled;
  }
}
