/*
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/a9dea8a3672179e6c38aafd1429daf44c7ea2ff6/packages/@react-aria/utils/src/getScrollParent.ts
 */

export function getScrollParent(node: Element | null): Element {
	let parentNode = node;
	while (parentNode && !isScrollable(parentNode)) {
		parentNode = parentNode.parentElement;
	}

	return parentNode || document.scrollingElement || document.documentElement;
}

function isScrollable(node: Element): boolean {
	const style = window.getComputedStyle(node);
	return /(auto|scroll)/.test(
		style.overflow + style.overflowX + style.overflowY,
	);
}
