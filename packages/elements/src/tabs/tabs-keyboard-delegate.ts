/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/6b51339cca0b8344507d3c8e81e7ad05d6e75f9b/packages/@react-aria/tabs/src/TabsKeyboardDelegate.ts
 */

import { Orientation } from "@kobalte/utils";
import { Accessor } from "solid-js";

import { ReadingDirection } from "../i18n";
import { Collection, CollectionKey, CollectionNode } from "../primitives";
import { KeyboardDelegate } from "../selection";

export class TabsKeyboardDelegate implements KeyboardDelegate {
  private collection: Accessor<Collection<CollectionNode>>;
  private direction: Accessor<ReadingDirection>;
  private orientation: Accessor<Orientation>;
  private loop: Accessor<boolean>;

  constructor(
    collection: Accessor<Collection<CollectionNode>>,
    direction: Accessor<ReadingDirection>,
    orientation: Accessor<Orientation>,
    loop: Accessor<boolean>
  ) {
    this.collection = collection;
    this.direction = direction;
    this.orientation = orientation;
    this.loop = loop;
  }

  private flipDirection() {
    return this.direction() === "rtl" && this.orientation() === "horizontal";
  }

  getKeyLeftOf(key: CollectionKey) {
    if (this.flipDirection()) {
      return this.getNextKey(key);
    } else {
      if (this.orientation() === "horizontal") {
        return this.getPreviousKey(key);
      }

      return undefined;
    }
  }

  getKeyRightOf(key: CollectionKey) {
    if (this.flipDirection()) {
      return this.getPreviousKey(key);
    } else {
      if (this.orientation() === "horizontal") {
        return this.getNextKey(key);
      }

      return undefined;
    }
  }

  getKeyAbove(key: CollectionKey) {
    if (this.orientation() === "vertical") {
      return this.getPreviousKey(key);
    }

    return undefined;
  }

  getKeyBelow(key: CollectionKey) {
    if (this.orientation() === "vertical") {
      return this.getNextKey(key);
    }

    return undefined;
  }

  getFirstKey() {
    let key = this.collection().getFirstKey();

    if (key == null) {
      return;
    }

    const item = this.collection().getItem(key);

    if (item?.isDisabled) {
      key = this.getNextKey(key);
    }

    return key;
  }

  getLastKey() {
    let key = this.collection().getLastKey();

    if (key == null) {
      return;
    }

    const item = this.collection().getItem(key);

    if (item?.isDisabled) {
      key = this.getPreviousKey(key);
    }

    return key;
  }

  getNextKey(key: CollectionKey) {
    let nextKey: CollectionKey | undefined = key;
    let nextItem: CollectionNode | undefined;

    do {
      if (this.loop()) {
        nextKey = this.collection().getKeyAfter(nextKey) ?? this.collection().getFirstKey();
      } else {
        nextKey = this.collection().getKeyAfter(nextKey);
      }

      if (nextKey == null) {
        return;
      }

      nextItem = this.collection().getItem(nextKey);

      if (nextItem == null) {
        return;
      }
    } while (nextItem.isDisabled);

    return nextKey;
  }

  getPreviousKey(key: CollectionKey) {
    let previousKey: CollectionKey | undefined = key;
    let previousItem: CollectionNode | undefined;

    do {
      if (this.loop()) {
        previousKey = this.collection().getKeyBefore(previousKey) ?? this.collection().getLastKey();
      } else {
        previousKey = this.collection().getKeyBefore(previousKey);
      }

      if (previousKey == null) {
        return;
      }

      previousItem = this.collection().getItem(previousKey);

      if (previousItem == null) {
        return;
      }
    } while (previousItem.isDisabled);

    return previousKey;
  }
}
