/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/bfce84fee12a027d9cbc38b43e1747e3e4b4b169/packages/@react-stately/list/src/ListCollection.ts
 */

import { Collection, CollectionNode } from "../collection";

export class ListCollection<T> implements Collection<CollectionNode<T>> {
  private keyMap: Map<string, CollectionNode<T>> = new Map();
  private iterable: Iterable<CollectionNode<T>>;
  private firstKey?: string;
  private lastKey?: string;

  constructor(nodes: Iterable<CollectionNode<T>>) {
    this.iterable = nodes;

    for (const node of nodes) {
      this.keyMap.set(node.key, node);
    }

    if (this.keyMap.size === 0) {
      return;
    }

    let last!: CollectionNode<T>;
    let index = 0;

    for (const [key, node] of this.keyMap) {
      if (last) {
        last.nextKey = key;
        node.prevKey = last.key;
      } else {
        this.firstKey = key;
        node.prevKey = undefined;
      }

      if (node.type === "item") {
        node.index = index++;
      }

      last = node;

      // Set nextKey as undefined since this might be the last node
      // If it isn't the last node, last.nextKey will properly set at start of new loop
      last.nextKey = undefined;
    }

    this.lastKey = last.key;
  }

  *[Symbol.iterator]() {
    yield* this.iterable;
  }

  getSize() {
    return this.keyMap.size;
  }

  getKeys() {
    return this.keyMap.keys();
  }

  getKeyBefore(key: string) {
    return this.keyMap.get(key)?.prevKey;
  }

  getKeyAfter(key: string) {
    return this.keyMap.get(key)?.nextKey;
  }

  getFirstKey() {
    return this.firstKey;
  }

  getLastKey() {
    return this.lastKey;
  }

  getItem(key: string) {
    return this.keyMap.get(key);
  }

  at(idx: number) {
    const keys = [...this.getKeys()];
    return this.getItem(keys[idx]);
  }
}
