/*
 * Portions of this file are based on code from ariakit.
 * MIT Licensed, Copyright (c) Diego Haz.
 *
 * Credits to the Ariakit team:
 * https://github.com/ariakit/ariakit/blob/232bc79018ec20967fec1e097a9474aba3bb5be7/packages/ariakit-utils/src/dom.ts
 */

/**
 * Similar to `Element.prototype.contains`, but a little faster when `element` is the same as `child`.
 */
export function contains(parent: Node | undefined, child: Node | null) {
	if (!parent) {
		return false;
	}

	return parent === child || parent.contains(child);
}

/**
 * Returns `element.ownerDocument.activeElement`.
 */
export function getActiveElement(
	node?: Node | null,
	activeDescendant = false,
): HTMLElement | null {
	const { activeElement } = getDocument(node);

	if (!activeElement?.nodeName) {
		// In IE11, activeElement might be an empty object if we're interacting
		// with elements inside an iframe.
		return null;
	}

	if (isFrame(activeElement) && activeElement.contentDocument) {
		return getActiveElement(
			activeElement.contentDocument.body,
			activeDescendant,
		);
	}

	if (activeDescendant) {
		const id = activeElement.getAttribute("aria-activedescendant");

		if (id) {
			const element = getDocument(activeElement).getElementById(id);

			if (element) {
				return element;
			}
		}
	}

	return activeElement as HTMLElement | null;
}

/**
 * Returns `element.ownerDocument.defaultView || window`.
 */
export function getWindow(node?: Node | null): Window {
	return getDocument(node).defaultView || window;
}

/**
 * Returns `element.ownerDocument || document`.
 */
export function getDocument(node?: Node | null): Document {
	return node ? node.ownerDocument || (node as Document) : document;
}

/**
 * Checks whether `element` is a frame element.
 */
export function isFrame(element: Element): element is HTMLIFrameElement {
	return element.tagName === "IFRAME";
}
