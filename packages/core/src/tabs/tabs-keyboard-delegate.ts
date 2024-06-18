/*
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/6b51339cca0b8344507d3c8e81e7ad05d6e75f9b/packages/@react-aria/tabs/src/TabsKeyboardDelegate.ts
 */

import type { Orientation } from "@kobalte/utils";
import type { Accessor } from "solid-js";

import type { Direction } from "../i18n";
import type { Collection, CollectionNode } from "../primitives";
import type { KeyboardDelegate } from "../selection";

export class TabsKeyboardDelegate implements KeyboardDelegate {
	private collection: Accessor<Collection<CollectionNode>>;
	private direction: Accessor<Direction>;
	private orientation: Accessor<Orientation>;

	constructor(
		collection: Accessor<Collection<CollectionNode>>,
		direction: Accessor<Direction>,
		orientation: Accessor<Orientation>,
	) {
		this.collection = collection;
		this.direction = direction;
		this.orientation = orientation;
	}

	private flipDirection() {
		return this.direction() === "rtl" && this.orientation() === "horizontal";
	}

	getKeyLeftOf(key: string) {
		if (this.flipDirection()) {
			return this.getNextKey(key);
		}
		if (this.orientation() === "horizontal") {
			return this.getPreviousKey(key);
		}

		return undefined;
	}

	getKeyRightOf(key: string) {
		if (this.flipDirection()) {
			return this.getPreviousKey(key);
		}
		if (this.orientation() === "horizontal") {
			return this.getNextKey(key);
		}

		return undefined;
	}

	getKeyAbove(key: string) {
		if (this.orientation() === "vertical") {
			return this.getPreviousKey(key);
		}

		return undefined;
	}

	getKeyBelow(key: string) {
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

		if (item?.disabled) {
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

		if (item?.disabled) {
			key = this.getPreviousKey(key);
		}

		return key;
	}

	getNextKey(key: string) {
		let nextKey: string | undefined = key;
		let nextItem: CollectionNode | undefined;

		do {
			nextKey =
				this.collection().getKeyAfter(nextKey) ??
				this.collection().getFirstKey();

			if (nextKey == null) {
				return;
			}

			nextItem = this.collection().getItem(nextKey);

			if (nextItem == null) {
				return;
			}
		} while (nextItem.disabled);

		return nextKey;
	}

	getPreviousKey(key: string) {
		let previousKey: string | undefined = key;
		let previousItem: CollectionNode | undefined;

		do {
			previousKey =
				this.collection().getKeyBefore(previousKey) ??
				this.collection().getLastKey();

			if (previousKey == null) {
				return;
			}

			previousItem = this.collection().getItem(previousKey);

			if (previousItem == null) {
				return;
			}
		} while (previousItem.disabled);

		return previousKey;
	}
}
