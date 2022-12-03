/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/8f2f2acb3d5850382ebe631f055f88c704aa7d17/packages/@react-aria/selection/src/ListKeyboardDelegate.ts
 */

import { Accessor } from "solid-js";

import { Collection, CollectionNode } from "../primitives";
import { KeyboardDelegate } from "../selection";

export class ListKeyboardDelegate implements KeyboardDelegate {
  private collection: Collection<CollectionNode>;
  private disabledKeys: Set<string>;
  private ref?: Accessor<HTMLElement | undefined>;
  private collator?: Intl.Collator;

  constructor(
    collection: Collection<CollectionNode>,
    disabledKeys: Set<string>,
    ref?: Accessor<HTMLElement | undefined>,
    collator?: Intl.Collator
  ) {
    this.collection = collection;
    this.disabledKeys = disabledKeys;
    this.ref = ref;
    this.collator = collator;
  }

  getKeyBelow(key: string) {
    let keyAfter = this.collection.getKeyAfter(key);

    while (keyAfter != null) {
      const item = this.collection.getItem(keyAfter);
      if (item && item.type === "item" && !this.disabledKeys.has(keyAfter)) {
        return keyAfter;
      }

      keyAfter = this.collection.getKeyAfter(keyAfter);
    }
  }

  getKeyAbove(key: string) {
    let keyBefore = this.collection.getKeyBefore(key);

    while (keyBefore != null) {
      const item = this.collection.getItem(keyBefore);
      if (item && item.type === "item" && !this.disabledKeys.has(keyBefore)) {
        return keyBefore;
      }

      keyBefore = this.collection.getKeyBefore(keyBefore);
    }
  }

  getFirstKey() {
    let key = this.collection.getFirstKey();

    while (key != null) {
      const item = this.collection.getItem(key);

      if (item && item.type === "item" && !this.disabledKeys.has(key)) {
        return key;
      }

      key = this.collection.getKeyAfter(key);
    }
  }

  getLastKey() {
    let key = this.collection.getLastKey();

    while (key != null) {
      const item = this.collection.getItem(key);

      if (item && item.type === "item" && !this.disabledKeys.has(key)) {
        return key;
      }

      key = this.collection.getKeyBefore(key);
    }
  }

  private getItem(key: string): HTMLElement | null {
    return this.ref?.()?.querySelector(`[data-key="${key}"]`) ?? null;
  }

  getKeyPageAbove(key: string) {
    const menu = this.ref?.();
    let item = this.getItem(key);

    if (!menu || !item) {
      return;
    }

    const pageY = Math.max(0, item.offsetTop + item.offsetHeight - menu.offsetHeight);

    let keyAbove: string | undefined = key;

    while (keyAbove && item && item.offsetTop > pageY) {
      keyAbove = this.getKeyAbove(keyAbove);
      item = keyAbove != null ? this.getItem(keyAbove) : null;
    }

    return keyAbove;
  }

  getKeyPageBelow(key: string) {
    const menu = this.ref?.();
    let item = this.getItem(key);

    if (!menu || !item) {
      return;
    }

    const pageY = Math.min(
      menu.scrollHeight,
      item.offsetTop - item.offsetHeight + menu.offsetHeight
    );

    let keyBelow: string | undefined = key;

    while (keyBelow && item && item.offsetTop < pageY) {
      keyBelow = this.getKeyBelow(keyBelow);
      item = keyBelow != null ? this.getItem(keyBelow) : null;
    }

    return keyBelow;
  }

  getKeyForSearch(search: string, fromKey?: string) {
    if (!this.collator) {
      return;
    }

    // Prevent from getting the same key twice
    let key = fromKey != null ? this.getKeyBelow(fromKey) : this.getFirstKey();

    while (key != null) {
      const item = this.collection.getItem(key);

      if (item) {
        const substring = item.textValue.slice(0, search.length);

        if (item.textValue && this.collator.compare(substring, search) === 0) {
          return key;
        }
      }

      key = this.getKeyBelow(key);
    }
  }
}
