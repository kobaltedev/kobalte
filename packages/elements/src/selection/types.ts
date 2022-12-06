/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/bfce84fee12a027d9cbc38b43e1747e3e4b4b169/packages/@react-stately/selection/src/Selection.ts
 * https://github.com/adobe/react-spectrum/blob/bfce84fee12a027d9cbc38b43e1747e3e4b4b169/packages/@react-stately/selection/src/types.ts
 * https://github.com/adobe/react-spectrum/blob/bfce84fee12a027d9cbc38b43e1747e3e4b4b169/packages/@react-types/shared/src/selection.d.ts
 */

import { MaybeAccessor } from "@kobalte/utils";
import { Accessor } from "solid-js";

import { Key, PressEvent } from "../primitives";

export type SelectionMode = "none" | "single" | "multiple";
export type SelectionBehavior = "toggle" | "replace";
export type FocusStrategy = "first" | "last";
export type SelectionType = "all" | Set<Key>;

export interface MultipleSelection {
  /** The type of selection that is allowed in the collection. */
  selectionMode?: MaybeAccessor<SelectionMode | undefined>;

  /** Whether the collection allows empty selection. */
  disallowEmptySelection?: MaybeAccessor<boolean | undefined>;

  /** The currently selected keys in the collection (controlled). */
  selectedKeys?: MaybeAccessor<"all" | Iterable<Key> | undefined>;

  /** The initial selected keys in the collection (uncontrolled). */
  defaultSelectedKeys?: MaybeAccessor<"all" | Iterable<Key> | undefined>;

  /** Handler that is called when the selection changes. */
  onSelectionChange?: (keys: SelectionType) => any;
}

/**
 * A Selection is a special Set containing Keys, which also has an anchor
 * and current selected key for use when range selecting.
 */
export class Selection extends Set<Key> {
  anchorKey?: Key;
  currentKey?: Key;

  constructor(keys?: Iterable<Key> | Selection, anchorKey?: Key, currentKey?: Key) {
    super(keys);
    if (keys instanceof Selection) {
      this.anchorKey = anchorKey || keys.anchorKey;
      this.currentKey = currentKey || keys.currentKey;
    } else {
      this.anchorKey = anchorKey;
      this.currentKey = currentKey;
    }
  }
}

export interface FocusState {
  /** Whether the collection is currently focused. */
  isFocused: Accessor<boolean>;

  /** The current focused key in the collection. */
  focusedKey: Accessor<Key | undefined>;

  /** Whether the first or last child of the focused key should receive focus. */
  childFocusStrategy: Accessor<FocusStrategy>;

  /** Sets whether the collection is focused. */
  setFocused(isFocused: boolean): void;

  /**
   * Sets the focused key, and optionally,
   * whether the first or last child of that key should receive focus.
   */
  setFocusedKey(key?: Key, child?: FocusStrategy): void;
}

export interface MultipleSelectionState extends FocusState {
  /** The type of selection that is allowed in the collection. */
  selectionMode: Accessor<SelectionMode>;

  /** The selection behavior for the collection. */
  selectionBehavior: Accessor<SelectionBehavior>;

  /** Sets the selection behavior for the collection. */
  setSelectionBehavior(selectionBehavior: SelectionBehavior): void;

  /** Whether the collection allows empty selection. */
  disallowEmptySelection: Accessor<boolean>;

  /** The currently selected keys in the collection. */
  selectedKeys: Accessor<SelectionType>;

  /** Sets the selected keys in the collection. */
  setSelectedKeys(keys: SelectionType): void;
}

export interface MultipleSelectionManager extends FocusState {
  /** The type of selection that is allowed in the collection. */
  selectionMode: Accessor<SelectionMode>;

  /** The selection behavior for the collection. */
  selectionBehavior: Accessor<SelectionBehavior>;

  /** Whether the collection allows empty selection. */
  disallowEmptySelection: Accessor<boolean | undefined>;

  /** The currently selected keys in the collection. */
  selectedKeys: Accessor<Set<Key>>;

  /** Whether the selection is empty. */
  isEmpty: Accessor<boolean>;

  /** Whether all items in the collection are selected. */
  isSelectAll: Accessor<boolean>;

  /** The first selected key in the collection. */
  firstSelectedKey: Accessor<Key | undefined>;

  /** The last selected key in the collection. */
  lastSelectedKey: Accessor<Key | undefined>;

  /** Returns whether a key is selected. */
  isSelected: (key: Key) => boolean;

  /** Returns whether the current selection is equal to the given selection. */
  isSelectionEqual(selection: Set<Key>): boolean;

  /** Extends the selection to the given key. */
  extendSelection(toKey: Key): void;

  /** Toggles whether the given key is selected. */
  toggleSelection: (key: Key) => void;

  /** Replaces the selection with only the given key. */
  replaceSelection: (key: Key) => void;

  /** Replaces the selection with the given keys. */
  setSelectedKeys(keys: Iterable<Key>): void;

  /** Selects all items in the collection. */
  selectAll(): void;

  /** Removes all keys from the selection. */
  clearSelection(): void;

  /** Toggles between select all and an empty selection. */
  toggleSelectAll(): void;

  /**
   * Toggles, replaces, or extends selection to the given key depending
   * on the pointer event and collection's selection mode.
   */
  select(key: Key, e?: PressEvent | PointerEvent): void;

  /** Returns whether the given key can be selected. */
  canSelectItem: (key: Key) => boolean;

  /**
   * Returns whether the given key is non-interactive,
   * i.e. both selection and actions are disabled.
   */
  isDisabled: (key: Key) => boolean;

  /** Sets the selection behavior for the collection. */
  setSelectionBehavior: (selectionBehavior: SelectionBehavior) => void;
}

export interface KeyboardDelegate {
  /** Returns the key visually below the given one, or `undefined` for none. */
  getKeyBelow?: (key: Key) => Key | undefined;

  /** Returns the key visually above the given one, or `undefined` for none. */
  getKeyAbove?: (key: Key) => Key | undefined;

  /** Returns the key visually to the left of the given one, or `undefined` for none. */
  getKeyLeftOf?: (key: Key) => Key | undefined;

  /** Returns the key visually to the right of the given one, or `undefined` for none. */
  getKeyRightOf?: (key: Key) => Key | undefined;

  /** Returns the key visually one page below the given one, or `undefined` for none. */
  getKeyPageBelow?: (key: Key) => Key | undefined;

  /** Returns the key visually one page above the given one, or `undefined` for none. */
  getKeyPageAbove?: (key: Key) => Key | undefined;

  /** Returns the first key, or `undefined` for none. */
  getFirstKey?: (key?: Key, global?: boolean) => Key | undefined;

  /** Returns the last key, or `undefined` for none. */
  getLastKey?: (key?: Key, global?: boolean) => Key | undefined;

  /** Returns the next key after `fromKey` that matches the given search string, or `undefined` for none. */
  getKeyForSearch?: (search: string, fromKey?: Key) => Key | undefined;
}
